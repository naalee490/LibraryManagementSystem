package edu.bi.springdemo.service;

import edu.bi.springdemo.dto.BookDTO;
import edu.bi.springdemo.entity.Book;
import edu.bi.springdemo.entity.exception.BadRequestException;
import edu.bi.springdemo.entity.exception.ResourceAlreadyExistsException;
import edu.bi.springdemo.entity.exception.ResourceNotFoundException;
import edu.bi.springdemo.repository.BookRepository;
import edu.bi.springdemo.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final LoanRepository loanRepository;

    @Autowired
    public BookService(BookRepository bookRepository, LoanRepository loanRepository) {
        // need loan repo to check active borrows before delete
        this.bookRepository = bookRepository;
        this.loanRepository = loanRepository;
    }

    // POST /book/add - creates new row in catalog
    public Book saveBook(BookDTO bookDto) {
        // dont allow duplicate ISBN in catalog
        if (bookRepository.existsByIsbn(bookDto.getIsbn())) {
            throw new ResourceAlreadyExistsException("Book with ISBN " + bookDto.getIsbn() + " already exists.");
        }

        Book book = new Book();
        book.setIsbn(bookDto.getIsbn());
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setPublisher(bookDto.getPublisher());
        book.setYear(bookDto.getYear());
        book.setAvailableCopies(bookDto.getAvailableCopies());
        return bookRepository.save(book);
    }

    // whole catalogue for GET /book/getAll
    public Iterable<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // search by title or author
    public Iterable<Book> searchBooks(String query) {
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(query, query);
    }

    // update metadata on existing book
    public Book updateBook(Integer id, BookDTO bookDto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));

        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setPublisher(bookDto.getPublisher());
        book.setYear(bookDto.getYear());
        book.setAvailableCopies(bookDto.getAvailableCopies());

        return bookRepository.save(book);
    }

    // admin changes stock from catalogue
    public Book updateStock(Integer id, Long copies) {
        if (copies == null || copies < 0) {
            throw new BadRequestException("Available copies must be 0 or greater.");
        }
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));
        book.setAvailableCopies(copies);
        return bookRepository.save(book);
    }

    // cant delete if someone still has the book borrowed
    public void deleteBook(Integer id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with ID: " + id);
        }
        if (loanRepository.existsByBook_BookIDAndStatus(id, "BORROWED")) {
            throw new BadRequestException("Cannot delete: book has active loans. Return all copies first.");
        }
        bookRepository.deleteById(id);
    }
}
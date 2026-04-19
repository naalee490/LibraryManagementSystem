package edu.bi.springdemo.service;

import edu.bi.springdemo.dto.BookDTO;
import edu.bi.springdemo.entity.Book;
import edu.bi.springdemo.entity.exception.ResourceAlreadyExistsException;
import edu.bi.springdemo.entity.exception.ResourceNotFoundException;
import edu.bi.springdemo.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookService {
    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book saveBook(BookDTO bookDto) {
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

    public Iterable<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    //Search for books
    public Iterable<Book> searchBooks(String query) {
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(query, query);
    }

    //Update an existing book
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

    //Delete a book
    public void deleteBook(Integer id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with ID: " + id);
        }
        bookRepository.deleteById(id);
    }
}
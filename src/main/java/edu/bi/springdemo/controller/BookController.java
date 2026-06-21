package edu.bi.springdemo.controller;

import edu.bi.springdemo.dto.BookDTO;
import edu.bi.springdemo.entity.Book;
import edu.bi.springdemo.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/book")
public class BookController {

    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        // inject book service
        this.bookService = bookService;
    }

    @PostMapping("/add")
    @ResponseStatus(code = HttpStatus.CREATED) //code 201
    // add book form hits this (librarian)
    public @ResponseBody Book addBook(@RequestBody BookDTO bookDto) {
        return bookService.saveBook(bookDto);
    }

    // catalogue page - public, no login needed
    @GetMapping("/getAll")
    public @ResponseBody Iterable<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/search")
    // title or author contains query (case insensitive)
    public Iterable<Book> searchBooks(@RequestParam String query) {
        return bookService.searchBooks(query);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    // librarian/admin delete - we mostly use /admin/books instead
    public void deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
    }
}
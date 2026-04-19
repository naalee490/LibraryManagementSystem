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
        this.bookService = bookService;
    }

    @PostMapping("/add")
    @ResponseStatus(code = HttpStatus.CREATED) //code 201
    public @ResponseBody Book addBook(@RequestBody BookDTO bookDto) {
        return bookService.saveBook(bookDto);
    }

    //Route the getAll method through the Service
    @GetMapping("/getAll")
    public @ResponseBody Iterable<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/search")
    public Iterable<Book> searchBooks(@RequestParam String query) {
        return bookService.searchBooks(query);
    }

    @PutMapping("/update/{id}")
    public Book updateBook(@PathVariable Integer id, @RequestBody BookDTO bookDto) {
        return bookService.updateBook(id, bookDto);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
    }
}
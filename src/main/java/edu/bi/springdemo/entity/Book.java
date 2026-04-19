package edu.bi.springdemo.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer bookID;

    @Column(unique = true)
    private String isbn;

    private String title;
    private String author;
    private String publisher;
    private Long year;
    private Long availableCopies;

    @JsonIgnore
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<Loan> loans;

    public Integer getBookID() {
        return bookID;
    }

    public void setBookID(Integer bookID) {
        this.bookID = bookID;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public Long getYear() {
        return year;
    }

    public void setYear(Long year) {
        this.year = year;
    }

    public Long getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(Long availableCopies) {
        this.availableCopies = availableCopies;
    }

    //getter and setter for the loans relationship
    public List<Loan> getLoans() {
        return loans;
    }

    public void setLoans(List<Loan> loans) {
        this.loans = loans;
    }
}
package edu.bi.springdemo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer loanID;

    //defines a many-to-one relationship with the book entity
    @ManyToOne
    @JoinColumn(name = "bookID", nullable = false)
    private Book book;

    //defines a many-to-one relationship with the user entity
    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    private LocalDate borrowDate;
    private String status; //e.g. "BORROWED" or "RETURNED"

    //getters and setters
    public Integer getLoanID() { return loanID; }
    public void setLoanID(Integer loanID) { this.loanID = loanID; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
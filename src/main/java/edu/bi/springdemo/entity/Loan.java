package edu.bi.springdemo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
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

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate borrowDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate returnDate;
    private String status;

    //getters and setters
    public Integer getLoanID() { return loanID; }
    public void setLoanID(Integer loanID) { this.loanID = loanID; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @PrePersist
    @PreUpdate
    // due date is always exactly 1 month after borrow date
    public void syncDueDate() {
        if (borrowDate != null) {
            dueDate = borrowDate.plusMonths(1);
        }
    }
}
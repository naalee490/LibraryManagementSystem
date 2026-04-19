package edu.bi.springdemo.service;

import edu.bi.springdemo.dto.LoanDTO;
import edu.bi.springdemo.entity.Book;
import edu.bi.springdemo.entity.Loan;
import edu.bi.springdemo.entity.User;
import edu.bi.springdemo.entity.exception.BadRequestException;
import edu.bi.springdemo.entity.exception.ResourceNotFoundException;
import edu.bi.springdemo.repository.BookRepository;
import edu.bi.springdemo.repository.LoanRepository;
import edu.bi.springdemo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class LoanService {
    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Autowired
    public LoanService(LoanRepository loanRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.loanRepository = loanRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public Loan saveLoan(LoanDTO loanDto) {
        //fetch the actual Book object from the database
        Book book = bookRepository.findById(loanDto.getBookID())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + loanDto.getBookID()));

        //fetch the actual User object from the database using UserRepository
        User user = userRepository.findById(loanDto.getUserID())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + loanDto.getUserID()));

        //Exception for Bad Request (0 copies)
        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("No available copies for book ID: " + loanDto.getBookID());
        }

        //Decrement the available copies and save the book
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        //create and save the new Loan using the actual objects
        Loan loan = new Loan();
        loan.setBook(book); //Passes the full object
        loan.setUser(user); //-||-
        loan.setBorrowDate(LocalDate.now());
        loan.setStatus("BORROWED");

        return loanRepository.save(loan);
    }

    public Iterable<Loan> getAllLoans() {
        return loanRepository.findAll();
    }


    //Return a book
    public Loan returnBook(Integer loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with ID: " + loanId));

        if ("RETURNED".equals(loan.getStatus())) {
            throw new BadRequestException("This book has already been returned.");
        }

        //Update loan status
        loan.setStatus("RETURNED");

        //Give the copy back to the book inventory
        Book book = loan.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return loanRepository.save(loan);
    }

    //View personal loan history
    public Iterable<Loan> getMyLoans(String username) {
        User user = userRepository.findUserByUsername(username).iterator().next();
        return loanRepository.findByUser(user);
    }
}
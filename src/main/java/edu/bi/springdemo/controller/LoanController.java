package edu.bi.springdemo.controller;

import edu.bi.springdemo.dto.LoanDTO;
import edu.bi.springdemo.entity.Loan;
import edu.bi.springdemo.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/loan")
public class LoanController {

    private final LoanService loanService;

    @Autowired
    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public Loan addLoan(@RequestBody LoanDTO loanDto) {
        return loanService.saveLoan(loanDto);
    }

    @GetMapping("/getAll")
    public Iterable<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    //Return a book endpoint
    @PutMapping("/return/{id}")
    public Loan returnBook(@PathVariable Integer id) {
        return loanService.returnBook(id);
    }

    //View personal history endpoint
    @GetMapping("/myHistory")
    public Iterable<Loan> getMyHistory(Principal principal) {
        //principal.getName() extracts the username from the verified JWT token
        return loanService.getMyLoans(principal.getName());
    }
}
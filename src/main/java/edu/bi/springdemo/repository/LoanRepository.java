package edu.bi.springdemo.repository;

import edu.bi.springdemo.entity.Loan;
import edu.bi.springdemo.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends CrudRepository<Loan, Integer> {
    //Find loans for a specific user
    List<Loan> findByUser(User user);
}
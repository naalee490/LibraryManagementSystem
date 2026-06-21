package edu.bi.springdemo.repository;

import edu.bi.springdemo.entity.Loan;
import edu.bi.springdemo.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends CrudRepository<Loan, Integer> {
    // all loans belonging to one reader
    List<Loan> findByUser(User user);

    List<Loan> findByUser_Id(Integer userId);

    void deleteByUser_Id(Integer userId);

    // true if book still has BORROWED status
    boolean existsByBook_BookIDAndStatus(Integer bookId, String status);
}
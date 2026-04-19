package edu.bi.springdemo.repository;

import edu.bi.springdemo.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
    @Query(value = "SELECT * FROM user u WHERE u.username = ?1", nativeQuery = true)
    Collection<User> findUserByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
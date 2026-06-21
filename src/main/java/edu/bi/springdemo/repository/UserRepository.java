package edu.bi.springdemo.repository;

import edu.bi.springdemo.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
    @Query(value = "SELECT * FROM user u WHERE u.username = ?1", nativeQuery = true)
    Collection<User> findUserByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // check email not taken by someone else when admin edits contact info
    boolean existsByEmailAndIdNot(String email, Integer id);

    // members search - username or email contains query
    List<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String username, String email);

    // inactive accounts for admin panel
    List<User> findByIsActiveFalse();
}
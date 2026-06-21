package edu.bi.springdemo.controller;

import edu.bi.springdemo.dto.BookDTO;
import edu.bi.springdemo.dto.UserListItemDTO;
import edu.bi.springdemo.dto.UserProfileUpdateDTO;
import edu.bi.springdemo.entity.Book;
import edu.bi.springdemo.entity.User;
import edu.bi.springdemo.entity.exception.ResourceNotFoundException;
import edu.bi.springdemo.repository.UserRepository;
import edu.bi.springdemo.service.BookService;
import edu.bi.springdemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private BookService bookService;
    @Autowired private UserService userService;

    @PutMapping("/users/{id}/approve")
    // admin activates pending librarian account
    public ResponseEntity<String> approveUser(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(true);
        userRepository.save(user);
        return ResponseEntity.ok("User approved.");
    }

    @PutMapping("/users/{id}/reset-password")
    // generates random temp password, admin shows it to user
    public ResponseEntity<String> resetPassword(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("New password: " + newPassword);
    }

    @PutMapping("/users/{id}/role")
    // flip READER <-> LIBRARIAN from members page
    public ResponseEntity<String> changeRole(@PathVariable Integer id, @RequestParam String newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole("ROLE_" + newRole.toUpperCase());
        userRepository.save(user);
        return ResponseEntity.ok("Role changed to " + newRole);
    }

    @PutMapping("/users/{id}/profile")
    // contact details only - no login credentials
    public ResponseEntity<UserListItemDTO> updateMemberProfile(
            @PathVariable Integer id,
            @RequestBody UserProfileUpdateDTO profileDto) {
        return ResponseEntity.ok(userService.updateMemberProfile(id, profileDto));
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    // admin removes member account
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }

    @PutMapping("/books/{id}/stock")
    // admin edits available copies from catalogue
    public ResponseEntity<Book> updateBookStock(@PathVariable Integer id, @RequestParam Long copies) {
        return ResponseEntity.ok(bookService.updateStock(id, copies));
    }

    @PutMapping("/books/{id}")
    // admin edits title/author/publisher/year (ISBN stays the same)
    public ResponseEntity<Book> updateBook(@PathVariable Integer id, @RequestBody BookDTO bookDto) {
        return ResponseEntity.ok(bookService.updateBook(id, bookDto));
    }

    @DeleteMapping("/books/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    // delete book from catalog (frontend uses this one)
    public void deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
    }
}

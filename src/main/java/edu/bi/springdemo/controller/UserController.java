package edu.bi.springdemo.controller;

import edu.bi.springdemo.dto.UserDTO;
import edu.bi.springdemo.dto.UserListItemDTO;
import edu.bi.springdemo.entity.User;
import edu.bi.springdemo.security.RoleNormalizer;
import edu.bi.springdemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        // inject user service
        this.userService = userService;
    }

    @PostMapping("/add")
    // signup form - creates new user (reader or librarian pending approval)
    public ResponseEntity<User> addUser(@RequestBody UserDTO userDto) {
        User savedUser = userService.saveUser(userDto);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    // members page - admin sees roles, librarian doesnt
    public ResponseEntity<List<UserListItemDTO>> getAllUsers(Principal principal) {
        boolean isAdmin = isAdmin(principal);
        return ResponseEntity.ok(userService.getUserListForViewer(isAdmin));
    }

    @DeleteMapping("/delete/{id}")
    // admin removes account
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/search")
    // search members by username/email
    public ResponseEntity<List<UserListItemDTO>> searchUsers(@RequestParam String query, Principal principal) {
        boolean isAdmin = isAdmin(principal);
        return ResponseEntity.ok(userService.searchUserListForViewer(query, isAdmin));
    }

    @GetMapping("/pending")
    // admin panel list
    public ResponseEntity<Iterable<User>> getPendingUsers() {
        return new ResponseEntity<>(userService.getPendingUsers(), HttpStatus.OK);
    }

    @GetMapping("/me")
    // who am i - from JWT principal
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        return ResponseEntity.ok(userService.getByUsername(principal.getName()));
    }

    // admin sees more columns than librarian
    private boolean isAdmin(Principal principal) {
        User current = userService.getByUsername(principal.getName());
        return "ROLE_ADMIN".equals(RoleNormalizer.normalize(current.getRole()));
    }
}

package edu.bi.springdemo.service;

import edu.bi.springdemo.dto.UserDTO;
import edu.bi.springdemo.dto.UserListItemDTO;
import edu.bi.springdemo.dto.UserProfileUpdateDTO;
import edu.bi.springdemo.entity.Book;
import edu.bi.springdemo.entity.Loan;
import edu.bi.springdemo.entity.User;
import edu.bi.springdemo.entity.exception.BadRequestException;
import edu.bi.springdemo.entity.exception.ResourceAlreadyExistsException;
import edu.bi.springdemo.entity.exception.ResourceNotFoundException;
import edu.bi.springdemo.repository.BookRepository;
import edu.bi.springdemo.repository.LoanRepository;
import edu.bi.springdemo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.time.LocalDate;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    // spring injects repo + bcrypt encoder
    public UserService(UserRepository userRepository, LoanRepository loanRepository,
                       BookRepository bookRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.loanRepository = loanRepository;
        this.bookRepository = bookRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // signup - hash password, librarian starts inactive till admin approves
    public User saveUser(UserDTO userDto) {
        if (!userRepository.findUserByUsername(userDto.getUsername()).isEmpty()) {
            throw new ResourceAlreadyExistsException("Username is already taken.");
        }

        validatePassword(userDto.getPassword());

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());

        if ("LIBRARIAN".equalsIgnoreCase(userDto.getRole())) {
            user.setRole("ROLE_LIBRARIAN");
            user.setActive(false);
        } else {
            user.setRole("ROLE_READER");
            user.setActive(true);
        }

        return userRepository.save(user);
    }

    //now: minimum 8 characters
    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters.");
        }

        //at least one uppercase letter:
        // if (!password.matches(".*[A-Z].*")) {
        //     throw new BadRequestException("Password must include at least one uppercase letter.");
        // }

        //at least one number:
        // if (!password.matches(".*[0-9].*")) {
        //     throw new BadRequestException("Password must include at least one number.");
        // }
    }

    public Iterable<User> getAllUsers() {
        // raw list, mostly used internally
        return userRepository.findAll();
    }

    // admin deletes member - borrowed books go back to catalogue first
    @Transactional
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + id + " not found."));

        if ("ROLE_ADMIN".equals(user.getRole())) {
            throw new BadRequestException("Cannot delete the admin account.");
        }

        List<Loan> loans = loanRepository.findByUser_Id(id);
        for (Loan loan : loans) {
            if (loan.getStatus() != null && "BORROWED".equalsIgnoreCase(loan.getStatus())) {
                Book book = loan.getBook();
                if (book != null) {
                    book.setAvailableCopies(book.getAvailableCopies() + 1);
                    bookRepository.save(book);
                }
                loan.setStatus("RETURNED");
                loan.setReturnDate(LocalDate.now());
                loanRepository.save(loan);
            }
        }

        loanRepository.deleteByUser_Id(id);
        userRepository.delete(user);
    }

    // members page search box
    public Iterable<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }

    // admin panel - librarians who signed up but not approved yet
    public Iterable<User> getPendingUsers() {
        return userRepository.findByIsActiveFalse();
    }

    // lookup by username - used in login + JWT stuff
    public User getByUsername(String username) {
        Collection<User> users = userRepository.findUserByUsername(username);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("User not found: " + username);
        }
        return users.iterator().next();
    }

    // builds member list DTO - hide admin row from librarians
    public List<UserListItemDTO> getUserListForViewer(boolean includeAdminAndRoles) {
        List<UserListItemDTO> result = new ArrayList<>();
        for (User user : userRepository.findAll()) {
            if (!includeAdminAndRoles && "ROLE_ADMIN".equals(user.getRole())) {
                continue;
            }
            result.add(toListItem(user, includeAdminAndRoles));
        }
        return result;
    }

    // same as getAll but filtered by search query
    public List<UserListItemDTO> searchUserListForViewer(String query, boolean includeAdminAndRoles) {
        List<UserListItemDTO> result = new ArrayList<>();
        for (User user : userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query)) {
            if (!includeAdminAndRoles && "ROLE_ADMIN".equals(user.getRole())) {
                continue;
            }
            result.add(toListItem(user, includeAdminAndRoles));
        }
        return result;
    }

    // map entity -> what frontend actually needs (no password etc)
    private UserListItemDTO toListItem(User user, boolean includeRole) {
        UserListItemDTO dto = new UserListItemDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setActive(user.isActive());
        if (includeRole) {
            dto.setRole(user.getRole());
            dto.setPhoneNumber(user.getPhoneNumber());
        }
        return dto;
    }

    // admin edits contact info only - username/password/role stay unchanged
    public UserListItemDTO updateMemberProfile(Integer id, UserProfileUpdateDTO profileDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + id + " not found."));

        if (userRepository.existsByEmailAndIdNot(profileDto.getEmail(), id)) {
            throw new ResourceAlreadyExistsException("Email is already in use.");
        }

        user.setFirstName(profileDto.getFirstName());
        user.setLastName(profileDto.getLastName());
        user.setEmail(profileDto.getEmail());
        user.setPhoneNumber(profileDto.getPhoneNumber());
        userRepository.save(user);

        return toListItem(user, true);
    }
}

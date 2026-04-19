package edu.bi.springdemo.service;

import edu.bi.springdemo.dto.UserDTO;
import edu.bi.springdemo.entity.User;
import edu.bi.springdemo.entity.exception.ResourceAlreadyExistsException;
import edu.bi.springdemo.entity.exception.ResourceNotFoundException;
import edu.bi.springdemo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(UserDTO userDto) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new ResourceAlreadyExistsException("User with username '" + userDto.getUsername() + "' already exists.");
        }
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new ResourceAlreadyExistsException("User with email '" + userDto.getEmail() + "' already exists.");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        String role = userDto.getRole();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role.toUpperCase();
        }
        user.setRole(role);

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());

        return userRepository.save(user);
    }

    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User with ID " + id + " not found.");
        }
        userRepository.deleteById(id);
    }
}
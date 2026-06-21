package edu.bi.springdemo.security;

import edu.bi.springdemo.entity.User;
import edu.bi.springdemo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // needs repo + encoder to create default admin
    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    // on startup create admin/admin123 if no admin exists yet
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin") && !userRepository.existsByEmail("admin@library.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            admin.setEmail("admin@library.com");
            admin.setFirstName("Library");
            admin.setLastName("Admin");
            admin.setPhoneNumber("000000000");
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("Default admin account created (username: admin). Change the password after first login.");
        }
    }
}
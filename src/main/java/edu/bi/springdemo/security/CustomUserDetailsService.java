package edu.bi.springdemo.security;

import edu.bi.springdemo.entity.User;
import edu.bi.springdemo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Collection<User> users = userRepository.findUserByUsername(username);

        if (users.isEmpty()) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        //returns the first matched user from the database
        return users.iterator().next();
    }
}
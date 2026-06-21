package edu.bi.springdemo.service;

import edu.bi.springdemo.entity.User;
import edu.bi.springdemo.entity.exception.LoginPasswordException;
import edu.bi.springdemo.repository.UserRepository;
import edu.bi.springdemo.security.JwtTokenService;
import edu.bi.springdemo.security.RoleNormalizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class LoginService {
    private final UserRepository userRepository;
    private final JwtTokenService jwtTokenService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public LoginService(UserRepository userRepository, JwtTokenService jwtTokenService, AuthenticationManager authenticationManager) {
        // auth manager checks password, jwt builds token after
        this.userRepository = userRepository;
        this.jwtTokenService = jwtTokenService;
        this.authenticationManager = authenticationManager;
    }

    // checks credentials then returns JWT string
    public String login(String username, String password) {
        try {
            // spring checks password hash for us
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (AuthenticationException e) {
            throw LoginPasswordException.create("Incorrect login or password");
        }

        // If authentication passes, fetch the user to get their role for the token
        Collection<User> list = userRepository.findUserByUsername(username);
        User user = list.iterator().next();

        // build JWT with username + role inside
        return jwtTokenService.generateToken(username, RoleNormalizer.normalize(user.getRole()));
    }
}
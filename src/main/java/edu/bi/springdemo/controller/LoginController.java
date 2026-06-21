package edu.bi.springdemo.controller;

import edu.bi.springdemo.dto.LoginDTO;
import edu.bi.springdemo.entity.User;
import edu.bi.springdemo.security.RoleNormalizer;
import edu.bi.springdemo.service.LoginService;
import edu.bi.springdemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class LoginController {
    private final LoginService loginService;
    private final UserService userService;

    @Autowired
    public LoginController(LoginService loginService, UserService userService) {
        // wires login + user lookup
        this.loginService = loginService;
        this.userService = userService;
    }

    @PostMapping("/login")
    // frontend sends username+password, we return JWT + role
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO loginDTO) {
        String token = loginService.login(loginDTO.getUsername(), loginDTO.getPassword());
        User user = userService.getByUsername(loginDTO.getUsername());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("token", token);
        body.put("userId", user.getId());
        body.put("username", user.getUsername());
        body.put("role", RoleNormalizer.normalize(user.getRole()));
        return new ResponseEntity<>(body, HttpStatus.OK);
    }
}

package edu.bi.springdemo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordEncoderConfig {

    @Bean
    // bcrypt for hashing passwords in db
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
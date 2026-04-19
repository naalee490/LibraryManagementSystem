package edu.bi.springdemo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenService jwtTokenService;

    @Autowired
    public SecurityConfig(JwtTokenService jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // 1. THE PUBLIC PERMIT LIST
                        .requestMatchers(
                                "/login",
                                "/user/add",

                                //SWAGGER & API DOCS
                                "/v3/api-docs",       //the raw JSON file that describes all your API endpoints
                                "/v3/api-docs/**",    //allows access to any sub-paths of the raw JSON documentation
                                "/swagger-ui/**",     //the interactive, visual Swagger webpage where you can test your API
                                "/swagger-ui.html",   //the main HTML file that loads the Swagger webpage

                                //ERROR HANDLING
                                "/error"              //Spring Boot's default error path. If a user goes to a URL that doesn't exist, this lets them see the actual "404 Not Found" error instead of blocking them with a "401 Unauthorized" error
                        ).permitAll()

                        // 2. Librarian only endpoints
                        .requestMatchers("/user/delete/**", "/book/add", "/book/update/**", "/book/delete/**").hasRole("LIBRARIAN")

                        // 3. Reader endpoints
                        .requestMatchers("/loan/add").hasAnyRole("READER", "LIBRARIAN")

                        // 4. Require authentication for everything else
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(new JWTTokenFilter(jwtTokenService), UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
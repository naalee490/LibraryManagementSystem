package edu.bi.springdemo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JWTTokenFilter extends OncePerRequestFilter {

    private final JwtTokenService jwtTokenService;

    public  JWTTokenFilter(JwtTokenService jwtTokenService){
        // runs on every request before controllers
        this.jwtTokenService = jwtTokenService;
    }

    @Override
    // check Authorization header, if Bearer token ok then set spring security context
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        // let CORS preflight through without wiping auth checks on real requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(header!=null && header.startsWith("Bearer ")){
            String token = header.split(" ")[1];
            try {
                String username = jwtTokenService.extractUsername(token);
                String role = RoleNormalizer.normalize(jwtTokenService.extractRole(token));

                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(username,
                                null, List.of(new SimpleGrantedAuthority(role)));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e){
                SecurityContextHolder.getContext().setAuthentication(null);
            }
        } else {
            SecurityContextHolder.getContext().setAuthentication(null);
        }

        filterChain.doFilter(request, response);
    }
}

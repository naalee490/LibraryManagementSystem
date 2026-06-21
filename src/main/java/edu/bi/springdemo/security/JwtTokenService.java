package edu.bi.springdemo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenService {

    private final SecretKey key;

    private final long expirationTime; //in ms

    // reads secret + expiry from application.properties
    public JwtTokenService(@Value("${jwt.key}")String secret,
                           @Value("${jwt.expiration-time}") long expirationTime) {

        key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationTime = expirationTime;
    }

    // after login we pack username + role into signed token
    public String generateToken(String username, String role){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(username)
                .claim("role", RoleNormalizer.normalize(role))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    // who is this token for
    public String extractUsername(String token){
        return extractClaims(token).getSubject();
    }

    // ROLE_READER / LIBRARIAN / ADMIN from claim
    public String extractRole(String token){
        return RoleNormalizer.normalize(extractClaims(token).get("role").toString());
    }

    // verify signature + parse payload
    private Claims extractClaims(String token){
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

package edu.bi.springdemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LibraryApplication {

	// boots spring + starts on port 8080
	public static void main(String[] args) {
		SpringApplication.run(LibraryApplication.class, args);
	}

}

package edu.bi.springdemo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {


    @GetMapping("/hello")
    public String sayHello(@RequestParam(defaultValue = "World") String name) {
        return "Hello "+name+"!";
    }

    @GetMapping("/add")
    public Integer addNumbers(@RequestParam Integer a, @RequestParam Integer b) {
        return a+b;
    }
}

package com.senai.tenix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = "http://localhost:8081")  // Substitua pelo endereço do seu front-end
public class TenixApplication {
    public static void main(String[] args) {
        SpringApplication.run(TenixApplication.class, args);
    }
}



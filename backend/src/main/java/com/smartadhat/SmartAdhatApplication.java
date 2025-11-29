package com.smartadhat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SmartAdhatApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartAdhatApplication.class, args);
    }
}

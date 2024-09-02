package com.six;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SixsenceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SixsenceApplication.class, args);
	}

}
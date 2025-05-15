package com.oumaima.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.oumaima.entities.Candidate;
import com.oumaima.repositories.CandidateRepository;


@SpringBootApplication
@ComponentScan(basePackages = {"com.oumaima"})
@EnableJpaRepositories(basePackages = "com.oumaima.repositories")
@EntityScan(basePackages = "com.oumaima.entities")

public class RecruitmentWebsiteAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecruitmentWebsiteAppApplication.class, args);
	}

	

}

package com.oumaima.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oumaima.entities.Candidate;
import com.oumaima.entities.Company;
import com.oumaima.entities.Recruiter;
import com.oumaima.repositories.CandidateRepository;
import com.oumaima.repositories.CompanyRepository;
import com.oumaima.repositories.RecruiterRepository;


@Service
public class RecruiterService {

	@Autowired
    private RecruiterRepository recruiterRepository;
	
	@Autowired
    private CompanyRepository companyRepository;

    public List<Recruiter> getAllrecruiters() {
        return recruiterRepository.findAll();
    }

    public void createRecruiter(Recruiter recruiter) {
        recruiterRepository.save(recruiter);
    }

    public Recruiter register(Recruiter recruiter) {
        if (recruiterRepository.findByEmail(recruiter.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        return recruiterRepository.save(recruiter);
    }

    public Recruiter login(String email, String password) {
        return recruiterRepository.findByEmail(email)
                .filter(r -> r.getPassword().equals(password)) 
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }
    
    public Recruiter register(Recruiter recruiter, Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        recruiter.setCompany(company);
        return recruiterRepository.save(recruiter);
    }
}

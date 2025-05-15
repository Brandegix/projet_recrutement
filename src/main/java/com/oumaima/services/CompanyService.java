package com.oumaima.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oumaima.entities.Company;
import com.oumaima.entities.Recruiter;
import com.oumaima.repositories.CompanyRepository;
import com.oumaima.repositories.RecruiterRepository;

import jakarta.transaction.Transactional;

@Service
public class CompanyService {


	@Autowired
    private RecruiterRepository recruiterRepository;
	@Autowired
    private CompanyRepository companyRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public void createCompany(Company company) {
        companyRepository.save(company);
    }
    public Company saveCompany(Company company) {
        return companyRepository.save(company);
    }
    @Transactional
    public Company createCompany(Company company, Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId).orElseThrow();

        company.setRecruiter(recruiter);  
        Company savedCompany = companyRepository.save(company);

        recruiter.setCompany(savedCompany);
        recruiterRepository.save(recruiter);

        return savedCompany;
    }

}

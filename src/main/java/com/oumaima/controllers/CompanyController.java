package com.oumaima.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.oumaima.entities.Company;
import com.oumaima.entities.Recruiter;
import com.oumaima.repositories.CompanyRepository;
import com.oumaima.repositories.RecruiterRepository;
import com.oumaima.services.CompanyService;
import com.oumaima.services.RecruiterService;


@Controller
@RequestMapping("/api/companies")

public class CompanyController {


	@Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private RecruiterRepository recruiterRepo;
    
	@Autowired
	private CompanyService companyService;
	
	@Autowired
	private RecruiterService recruiterService;
	
	 @GetMapping("/companies")
	    public String getAllcompanies(Model model) {
	        model.addAttribute("companies", companyService.getAllCompanies());
	        return "companiesList";  
	    }

	 @PostMapping("/companies")
	 public String createCompany(@ModelAttribute Company company, @RequestParam Long recruiterId) {
	     Recruiter recruiter = recruiterRepo.findById(recruiterId).orElseThrow();
	     company.setRecruiter(recruiter);

	     System.out.println(recruiterId);
	     System.out.println(recruiter);

	     Company savedCompany = companyRepository.save(company);

	     
	     recruiter.setCompany(savedCompany);
	     recruiter.setCompanyName(savedCompany.getName());
	     recruiterRepo.save(recruiter);	     
	     return "redirect:/api/recruiters/dashboard";
	 }


	 @GetMapping("/companies/create")
	 public String showCreateForm(@RequestParam Long recruiterId, Model model) {
	     model.addAttribute("company", new Company());
	     model.addAttribute("recruiterId", recruiterId);
	     return "companies"; 
	 }

	   
	 @GetMapping("/companies/edit")
	    public String showEditForm(@RequestParam Long recruiterId, Model model) {
	        Recruiter recruiter = recruiterRepo.findById(recruiterId).orElseThrow();
	        Company company = recruiter.getCompany(); 

	        model.addAttribute("company", company);
	        model.addAttribute("recruiter", recruiter);
	        return "editCompanyForm"; 
	    }

	    @PostMapping("/companies/update")
	    public String updateCompany(@ModelAttribute Company company, @RequestParam Long recruiterId) {
	        Recruiter recruiter = recruiterRepo.findById(recruiterId).orElseThrow();
	        Company existingCompany = recruiter.getCompany(); 

	        existingCompany.setName(company.getName());
	        existingCompany.setWebsite(company.getWebsite());
	        existingCompany.setIndustry(company.getIndustry());
	        existingCompany.setAddress(company.getAddress());
	        existingCompany.setRegistrationNumber(company.getRegistrationNumber());

	        companyRepository.save(existingCompany);

	        recruiter.setCompanyName(existingCompany.getName());
	        recruiterRepo.save(recruiter);

	        return "redirect:/api/recruiters/dashboard";
	    }


}

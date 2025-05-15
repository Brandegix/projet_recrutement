package com.oumaima.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;


import com.oumaima.entities.Candidate;
import com.oumaima.entities.JobOffer;
import com.oumaima.entities.Role;
import com.oumaima.repositories.CandidateRepository;
import com.oumaima.services.CandidateService;
import com.oumaima.services.JobOfferService;


@Controller
public class CandidateController {



	@Autowired
	private JobOfferService jobOfferService;
	
	@Autowired
	private CandidateService candidateService;
	
	
	
	 @GetMapping("/candidates")
	    public String getAllCandidates(Model model) {
	        model.addAttribute("candidates", candidateService.getAllCandidates());
	        return "candidatesList";  
	    }

	 @PostMapping("/candidates")
	    public String createCandidate(@ModelAttribute Candidate candidate) {
	        candidateService.createCandidate(candidate);
	        return "redirect:/candidates";
	    }
	    
	    @GetMapping("/candidates/create")
	 public String showCreateForm(Model model) {
	        model.addAttribute("candidate", new Candidate());  
	        return "candidates";  
	    }
	    
	    @PostMapping("/apply")
	    public String applyToJob(@RequestParam Long candidateId, @RequestParam Long jobOfferId) {
	        candidateService.applyToJob(candidateId, jobOfferId);
	        return "redirect:/jobOffers"; 
	    }
	    
	    private final CandidateRepository candidateRepository;

	    public CandidateController(CandidateRepository candidateRepository) {
	        this.candidateRepository = candidateRepository;
	    }

	    @GetMapping("/candidate/register")
	    public String showRegistrationForm() { 
	    	  return "register";
	    }

	    @PostMapping("/candidate/register")
	    public String registerCandidate(@RequestParam String email, @RequestParam String password) {
	        Candidate candidate = new Candidate();
	        candidate.setEmail(email);
	        candidate.setRole(Role.CANDIDATE); 
	        candidate.setPassword(password);  
	        candidateRepository.save(candidate);
	        return "redirect:/candidate/login";  
	    }

	    

	    @GetMapping("/candidate/home")
	    @PreAuthorize("hasRole('CANDIDATE')")
	    public String candidateHome(Model model, @AuthenticationPrincipal UserDetails userDetails) {
	        Candidate candidate = candidateRepository.findByEmail(userDetails.getUsername())
	                .orElseThrow(() -> new RuntimeException("Candidate not found"));

	        Set<JobOffer> appliedJobOffers = candidate.getAppliedJobOffers();

	        model.addAttribute("jobOffers", appliedJobOffers);
	        model.addAttribute("candidate", candidate); 
	        
	        return "candidateDashboard";
	    }

	  
	    
	    
}

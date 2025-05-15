package com.oumaima.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.oumaima.entities.Candidate;
import com.oumaima.entities.JobOffer;
import com.oumaima.entities.Recruiter;
import com.oumaima.repositories.CandidateRepository;
import com.oumaima.repositories.JobOfferRepository;
import com.oumaima.repositories.RecruiterRepository;
import com.oumaima.services.CandidateService;
import com.oumaima.services.RecruiterService;

@Controller
@RequestMapping("/api/recruiters")

public class RecruiterController {
	 @Autowired
	    private JobOfferRepository jobOfferRepository;

	 @Autowired
		private CandidateService candidateService;
	@Autowired
    private RecruiterRepository recruiterRepository;
	@Autowired
	private RecruiterService recruiterService;
	
	
	@Autowired
    private CandidateRepository candidateRepository;
	
	 @GetMapping("/recruiters")
	    public String getAllrecruiters(Model model) {
	        model.addAttribute("recruiters", recruiterService.getAllrecruiters());
	        return "recruitersList";  
	    }

	 @PostMapping("/recruiters")
	    public String createRecruiter(@ModelAttribute Recruiter recruiter) {
	        recruiterService.createRecruiter(recruiter);
	        return "redirect:/recruiters";
	    }
	    
	    @GetMapping("/recruiters/create")
	 public String showCreateForm(Model model) {
	        model.addAttribute("recruiter", new Recruiter());  
	        return "recruiters";  
	    }
	    
	    
	    @PostMapping("/register")
	    public ResponseEntity<Recruiter> register(@RequestBody Recruiter recruiter) {
	        Recruiter saved = recruiterService.register(recruiter);
	        return ResponseEntity.ok(saved);
	    }

	    @PostMapping("/login")
	    public ResponseEntity<String> login(@RequestBody Map<String, String> loginData) {
	        String email = loginData.get("email");
	        String password = loginData.get("password");
	        Recruiter recruiter = recruiterService.login(email, password);
	        return ResponseEntity.ok("Login successful! Recruiter ID: " + recruiter.getRecruiterId());
	    }
	   @PostMapping("/recruiters/register")
	    public String registerRecruiter(@ModelAttribute Recruiter recruiter) {
	        recruiterRepository.save(recruiter);
	        return "redirect:/login"; 
	    }
	    
	 

	  

	    @GetMapping("/dashboard")
	    public String dashboard(Model model, Principal principal) {
	        String email = principal.getName();

	        Recruiter recruiter = recruiterRepository.findByEmail(email)
	                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

	        List<JobOffer> jobOffers = jobOfferRepository.findByRecruiter_RecruiterId(recruiter.getRecruiterId());

	        model.addAttribute("jobOffers", jobOffers);
	       
	        model.addAttribute("recruiter", recruiter);
	        return "dashboard";
	        
	    }

	    @GetMapping("/recruiter/dashboard")
	    public String recruiterDashboard() {
	        return "redirect:/api/recruiters/recruiters/registers";
	    }
	    
	    
	    @GetMapping("/recruiter/applicants")
	    @PreAuthorize("hasRole('RECRUITER')")
	    public String viewApplicants(@AuthenticationPrincipal UserDetails userDetails, Model model) {
	        Recruiter recruiter = recruiterRepository.findByEmail(userDetails.getUsername())
	                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

	        List<Candidate> applicants = candidateRepository.findCandidatesByRecruiterId(recruiter.getRecruiterId());

	        model.addAttribute("applicants", applicants);
	        model.addAttribute("recruiter", recruiter);

	        return "recruiterApplicants"; 
	    }

	    
	    @GetMapping("/recruiter/job/{jobOfferId}/applicants")
	    @PreAuthorize("hasRole('RECRUITER')")
	    public String viewApplicantsForJob(@PathVariable Long jobOfferId, Model model) {
	        JobOffer jobOffer = jobOfferRepository.findById(jobOfferId)
	                .orElseThrow(() -> new RuntimeException("Job offer not found"));

	        Set<Candidate> applicants = jobOffer.getCandidates(); 

	        model.addAttribute("jobOffer", jobOffer);
	        model.addAttribute("applicants", applicants);

	        return "jobApplicants"; 
	    }


	    
	    
}

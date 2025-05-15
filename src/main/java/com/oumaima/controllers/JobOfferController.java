package com.oumaima.controllers;

import java.time.LocalDate;
import java.util.List;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.oumaima.entities.Candidate;
import com.oumaima.entities.JobOffer;
import com.oumaima.entities.Recruiter;
import com.oumaima.repositories.CandidateRepository;
import com.oumaima.repositories.JobOfferRepository;
import com.oumaima.repositories.RecruiterRepository;
import com.oumaima.services.JobOfferService;
import com.oumaima.services.RecruiterService;

@Controller
@RequestMapping("/api/jobOffers")
public class JobOfferController {
	
	@Autowired
    private CandidateRepository candidateRepository;


	@Autowired
	private JobOfferService jobOfferService;
	
	 @Autowired
	    private JobOfferRepository jobOfferRepository;

	    @Autowired
	    private RecruiterRepository recruiterRepository;
	    
	    
	    @GetMapping("/jobOffers")
	    public String showAllJobOffers(Model model) {
	        model.addAttribute("jobOffers", jobOfferService.getAllJobOffers());
	        return "jobOffersList"; 
	    }

	 @PostMapping("/jobOfferss")
	    public String createjobOffer(@ModelAttribute JobOffer jobOffer) {
		 jobOfferService.createJobOffer(jobOffer);
	        return "redirect:/jobOffers";
	    }
	    
	    @GetMapping("/jobOffers/creates")
	 public String showCreateForm(Model model) {
	        model.addAttribute("jobOffer", new JobOffer());  
	        return "jobOffers";  
	    }
	    
	    @PostMapping("/create")
	    public ResponseEntity<JobOffer> createOffer(
	        @RequestBody JobOffer jobOffer,
	        @RequestParam Long recruiterId  
	    ) {
	        Recruiter recruiter = recruiterRepository.findById(recruiterId)
	                                 .orElseThrow(() -> new RuntimeException("Recruiter not found"));
	        jobOffer.setRecruiter(recruiter);
	        JobOffer saved = jobOfferRepository.save(jobOffer);
	        return ResponseEntity.ok(saved);
	    }
	  
	    @GetMapping("/recruiter/{recruiterId}")
	    public ResponseEntity<List<JobOffer>> getOffersByRecruiter(@PathVariable Long recruiterId) {
	        List<JobOffer> offers = jobOfferService.getJobOffersByRecruiterId(recruiterId);
	        return ResponseEntity.ok(offers);
	    }

	    @GetMapping("/jobOffers/create")
	    public String showJobOfferForm(@RequestParam Long recruiterId, Model model) {
	        model.addAttribute("jobOffer", new JobOffer());
	        model.addAttribute("recruiterId", recruiterId);
	        return "createJobOffer";
	    }

	    @PostMapping("/jobOffers")
	    public String createJobOffer(@ModelAttribute JobOffer jobOffer, @RequestParam Long recruiterId) {
	        Recruiter recruiter = recruiterRepository.findById(recruiterId).orElseThrow();
	        
	        jobOffer.setRecruiter(recruiter);
	        jobOffer.setCompany(recruiter.getCompany()); 

	        jobOffer.setPostedDate(LocalDate.now());
	        jobOfferRepository.save(jobOffer);

	        return "redirect:/api/jobOffers/recruiters/" + recruiterId + "/joboffers";
	    }	    

	    @GetMapping("/recruiters/{id}/joboffers")
	    public String getJobOffersByRecruiter(@PathVariable Long id, Model model) {
	        Recruiter recruiter = recruiterRepository.findById(id).orElseThrow();
	        List<JobOffer> jobOffers = jobOfferRepository.findByRecruiter_RecruiterId(id);
	        model.addAttribute("jobOffers", jobOffers);
	        model.addAttribute("recruiter",recruiter);
	        return "recruiterJobOffers";
	    }

	    @GetMapping("/jobOffers/edit/{id}")
	    public String showEditForm(@PathVariable Long id, Model model) {
	        JobOffer jobOffer = jobOfferRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Offer not found"));
	        model.addAttribute("jobOffer", jobOffer);
	        model.addAttribute("recruiterId", jobOffer.getRecruiter().getRecruiterId());
	        return "editJobOffer";  
	    }

	    @PostMapping("/jobOffers/edit/{id}")
	    public String updateJobOffer(@PathVariable Long id, @ModelAttribute JobOffer updatedOffer) {
	        JobOffer existingOffer = jobOfferRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Offer not found"));

	        existingOffer.setTitle(updatedOffer.getTitle());
	        existingOffer.setDescription(updatedOffer.getDescription());
	        existingOffer.setLocation(updatedOffer.getLocation());
	        existingOffer.setSalary(updatedOffer.getSalary());
	        existingOffer.setPostedDate(LocalDate.now());

	        jobOfferRepository.save(existingOffer);

	        Long recruiterId = existingOffer.getRecruiter().getRecruiterId();
	        return "redirect:/api/recruiters/dashboard";
	    }

	    @GetMapping("/jobOffers/delete/{id}")
	    public String deleteJobOffer(@PathVariable Long id) {
	        JobOffer offer = jobOfferRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Offer not found"));
	        Long recruiterId = offer.getRecruiter().getRecruiterId();
	        jobOfferRepository.delete(offer);
	        return "redirect:/api/jobOffers/recruiters/" + recruiterId + "/joboffers";
	    }

	    
	    @GetMapping("/jobs")
	    public String viewJobOfferss(Model model) {
	        List<JobOffer> jobOffers = jobOfferService.getAllJobOffers();
	        model.addAttribute("jobOffers", jobOffers);
	        return "jobOffersList";  
	    }
	    
	    
	    
	    
	    
	    
	    
	    
	    //apply to job offer as a candidate
	    @GetMapping
	    @PreAuthorize("hasRole('CANDIDATE')")
	    public String viewJobOffers(Model model) {
	        List<JobOffer> jobOffers = jobOfferService.getAllJobOffers();
	        model.addAttribute("jobOffers", jobOffers);
	        return "jobOffersList";
	    }

	    @PostMapping("/apply/{jobOfferId}")
	    @PreAuthorize("hasRole('CANDIDATE')")
	    public String applyForJob(@PathVariable("jobOfferId") Long jobOfferId, @AuthenticationPrincipal UserDetails userDetails,RedirectAttributes redirectAttributes) {
	        Candidate candidate = candidateRepository.findByEmail(userDetails.getUsername())
	            .orElseThrow(() -> new RuntimeException("Candidate not found"));

	        JobOffer jobOffer = jobOfferRepository.findById(jobOfferId)
	            .orElseThrow(() -> new RuntimeException("Job Offer not found"));

	        candidate.getAppliedJobOffers().add(jobOffer);
	        candidateRepository.save(candidate);  
	        redirectAttributes.addFlashAttribute("message", "You have successfully applied for the job: " + jobOffer.getTitle());


	        return "redirect:/api/jobOffers/candidates/applied-jobs";
	    }
	    
	    @GetMapping("/candidates/applied-jobs")
	    @PreAuthorize("hasRole('CANDIDATE')")
	    public String viewAppliedJobs(@AuthenticationPrincipal UserDetails userDetails, Model model) {
	        Candidate candidate = candidateRepository.findByEmail(userDetails.getUsername())
	                .orElseThrow(() -> new RuntimeException("Candidate not found"));

	        Set<JobOffer> appliedJobOffers = candidate.getAppliedJobOffers();

	        model.addAttribute("appliedJobOffers", appliedJobOffers);

	        return "applied-jobs";
	    }

}


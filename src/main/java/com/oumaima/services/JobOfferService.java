package com.oumaima.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oumaima.entities.Candidate;
import com.oumaima.entities.JobOffer;
import com.oumaima.repositories.CandidateRepository;
import com.oumaima.repositories.JobOfferRepository;

@Service
public class JobOfferService {

	@Autowired
    private JobOfferRepository jobOfferRepository;

    public List<JobOffer> getAllJobOffer() {
        return jobOfferRepository.findAll();
    }

    public void createJobOffer(JobOffer JobOffer) {
    	jobOfferRepository.save(JobOffer);
    	
    }
    public List<JobOffer> getJobOffersByRecruiterId(Long recruiterId) {
        return jobOfferRepository.findByRecruiter_RecruiterId(recruiterId);
    }
   
    public List<JobOffer> getAllJobOffers() {
        return jobOfferRepository.findAll(); 
    }

    public List<JobOffer> getJobOffersByCandidate(Long candidateId) {
        return jobOfferRepository.findAll();
    }
}

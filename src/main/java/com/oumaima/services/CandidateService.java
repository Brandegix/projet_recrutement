package com.oumaima.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oumaima.entities.Candidate;
import com.oumaima.entities.JobOffer;
import com.oumaima.repositories.CandidateRepository;
import com.oumaima.repositories.JobOfferRepository;

@Service
public class CandidateService {

	@Autowired
    private CandidateRepository candidateRepository;

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public void createCandidate(Candidate candidate) {
        candidateRepository.save(candidate);
    }

    @Autowired
    private JobOfferRepository jobOfferRepository;

    public void applyToJob(Long candidateId, Long jobOfferId) {
        Candidate candidate = candidateRepository.findById(candidateId).orElse(null);
        JobOffer jobOffer = jobOfferRepository.findById(jobOfferId).orElse(null);

        if (candidate != null && jobOffer != null) {
            candidate.getAppliedJobOffers().add(jobOffer);
            candidateRepository.save(candidate);
        }
    }

    public Candidate getCandidateById(Long id) {
        return candidateRepository.findById(id).orElse(null);
    }


    public List<Candidate> getCandidatesForRecruiter(Long recruiterId) {
        return candidateRepository.findCandidatesByRecruiterId(recruiterId);
    }

	
}

package com.oumaima.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oumaima.entities.JobOffer;
import com.oumaima.entities.Recruiter;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long>{
	
    List<JobOffer> findByRecruiter_RecruiterId(Long recruiterId);


}


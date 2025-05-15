package com.oumaima.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oumaima.entities.Candidate;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long>{
    Optional<Candidate> findByEmail(String email);

   
    @Query("SELECT DISTINCT c FROM Candidate c JOIN c.appliedJobOffers j WHERE j.recruiter.id = :recruiterId")
    List<Candidate> findCandidatesByRecruiterId(@Param("recruiterId") Long recruiterId);

	
}

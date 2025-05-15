package com.oumaima.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.oumaima.entities.Recruiter;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter, Long>{

    Optional<Recruiter> findByEmail(String email);


}

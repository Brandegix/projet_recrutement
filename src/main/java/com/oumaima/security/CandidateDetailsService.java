package com.oumaima.security;


import java.util.ArrayList;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.oumaima.entities.Candidate;
import com.oumaima.repositories.CandidateRepository;
@Service
public class CandidateDetailsService implements UserDetailsService {

    private final CandidateRepository candidateRepository;

    public CandidateDetailsService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Candidate candidate = candidateRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Candidate not found"));

        return org.springframework.security.core.userdetails.User.builder()
                .username(candidate.getEmail())
                .password(candidate.getPassword())
                .roles(candidate.getRole().name())  
                .build();
    }
}

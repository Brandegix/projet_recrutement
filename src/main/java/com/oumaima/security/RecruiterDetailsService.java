package com.oumaima.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.oumaima.entities.Recruiter;
import com.oumaima.repositories.RecruiterRepository;

@Service
public class RecruiterDetailsService implements UserDetailsService {

    private final RecruiterRepository recruiterRepository;

    public RecruiterDetailsService(RecruiterRepository recruiterRepository) {
        this.recruiterRepository = recruiterRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Recruiter recruiter = recruiterRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Recruiter not found"));

        return User.builder()
                .username(recruiter.getEmail())
                .password(recruiter.getPassword())
                .roles(recruiter.getRole().name())  
                .build();
    }
}

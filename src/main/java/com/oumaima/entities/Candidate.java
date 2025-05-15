package com.oumaima.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Entity
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long candidateId;

    private String name;
    private String email;
    private String password;

    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;

    private String skills;

    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToMany
    @JoinTable(
        name = "candidate_joboffer",
        joinColumns = @JoinColumn(name = "candidate_id"),
        inverseJoinColumns = @JoinColumn(name = "joboffer_id")
    )
    private Set<JobOffer> appliedJobOffers = new HashSet<>();

    // Getters and Setters
    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public Set<JobOffer> getAppliedJobOffers() { return appliedJobOffers; }
    public void setAppliedJobOffers(Set<JobOffer> appliedJobOffers) { this.appliedJobOffers = appliedJobOffers; }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
    

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}

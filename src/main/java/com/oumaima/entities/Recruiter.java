package com.oumaima.entities;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
public class Recruiter implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long recruiterId;

    private String name;
    private String email;
    private String password;

    private String phoneNumber;
    private String address;
    private String companyName;

    @Enumerated(EnumType.STRING)
    private Role role; 

    @OneToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @OneToMany(mappedBy = "recruiter", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<JobOffer> jobOffers;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
    

    @Override public String getUsername() { return email; }
    @Override public String getPassword() { return password; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    // Getters & Setters
    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public void setPassword(String password) { this.password = password; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public List<JobOffer> getJobOffers() { return jobOffers; }
    public void setJobOffers(List<JobOffer> jobOffers) { this.jobOffers = jobOffers; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}

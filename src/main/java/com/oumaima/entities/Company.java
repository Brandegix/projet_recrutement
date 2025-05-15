package com.oumaima.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
@Entity
public class Company {

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long companyId;
    
    private String name;
    private String website;
    private String industry;
    
    private String address;
    
    private String registrationNumber;
    
    
    @OneToOne(mappedBy = "company")
    private Recruiter recruiter;


    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<JobOffer> jobOffers;

    
    
    
	public String getRegistrationNumber() {
		return registrationNumber;
	}



	public void setRegistrationNumber(String registrationNumber) {
		this.registrationNumber = registrationNumber;
	}



	
	

	public Recruiter getRecruiter() {
		return recruiter;
	}



	public void setRecruiter(Recruiter recruiter) {
		this.recruiter = recruiter;
	}



	public List<JobOffer> getJobOffers() {
		return jobOffers;
	}

	public void setJobOffers(List<JobOffer> jobOffers) {
		this.jobOffers = jobOffers;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public String getIndustry() {
		return industry;
	}

	public void setIndustry(String industry) {
		this.industry = industry;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	} 

    
  
}

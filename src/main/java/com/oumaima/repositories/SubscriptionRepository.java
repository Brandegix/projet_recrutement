package com.oumaima.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oumaima.entities.Company;
import com.oumaima.entities.Subscription;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long>{

}

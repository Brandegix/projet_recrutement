package com.oumaima.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oumaima.entities.Subscription;
import com.oumaima.repositories.RecruiterRepository;
import com.oumaima.repositories.SubscriptionRepository;

@Service
public class SubscriptionService {


	@Autowired
    private SubscriptionRepository subscriptionRepository;

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    public void createSubscription(Subscription subscription) {
    	subscriptionRepository.save(subscription);
    }
}

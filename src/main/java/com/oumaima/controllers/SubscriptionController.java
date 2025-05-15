package com.oumaima.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.oumaima.entities.Recruiter;
import com.oumaima.entities.Subscription;
import com.oumaima.services.RecruiterService;
import com.oumaima.services.SubscriptionService;

@Controller
public class SubscriptionController {

	@Autowired
	private SubscriptionService subscriptionService;
	
	 @GetMapping("/subscriptions")
	    public String getAllsubscriptions(Model model) {
	        model.addAttribute("subscriptions", subscriptionService.getAllSubscriptions());
	        return "subscriptionsList";  
	    }

	 @PostMapping("/subscriptions")
	    public String createsubscription(@ModelAttribute Subscription subscription) {
		 subscriptionService.createSubscription(subscription);
	        return "redirect:/subscriptions";
	    }
	    
	    @GetMapping("/subscriptions/create")
	 public String showCreateForm(Model model) {
	        model.addAttribute("subscription", new Subscription());  
	        return "subscriptions";  
	    }
}

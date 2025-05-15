package com.oumaima.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final RecruiterDetailsService recruiterDetailsService;
    private final CandidateDetailsService candidateDetailsService;
    private final CustomAuthenticationSuccessHandler successHandler;

    public SecurityConfig(RecruiterDetailsService recruiterDetailsService, CandidateDetailsService candidateDetailsService, CustomAuthenticationSuccessHandler successHandler) {
        this.recruiterDetailsService = recruiterDetailsService;
        this.candidateDetailsService = candidateDetailsService;
        this.successHandler = successHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/css/**", "/js/**", "/", "/api/recruiters/recruiters/**", "/h2-console/**").permitAll()
                .requestMatchers("/candidate/login", "/candidate/register").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .successHandler(successHandler)  
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/login?logout")
                .permitAll()
            )
            .headers(headers -> headers.frameOptions().disable());

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            try {
                return recruiterDetailsService.loadUserByUsername(email);
            } catch (UsernameNotFoundException ex) {
                return candidateDetailsService.loadUserByUsername(email);
            }
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                   .userDetailsService(userDetailsService())
                   .passwordEncoder(passwordEncoder())
                   .and()
                   .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();  
    }
}

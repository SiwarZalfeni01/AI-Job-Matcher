package com.aijobmatcher.config;

import com.aijobmatcher.model.JobOffer;
import com.aijobmatcher.model.User;
import com.aijobmatcher.model.UserRole;
import com.aijobmatcher.repository.JobOfferRepository;
import com.aijobmatcher.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobOfferRepository jobOfferRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking if data initialization is needed...");
        if (userRepository.count() == 0) {
            System.out.println("Initializing demo data...");
            // Create a Recruiter
            User recruiter = new User();
            recruiter.setName("Recruiter One");
            recruiter.setEmail("recruiter@test.com");
            recruiter.setPassword(passwordEncoder.encode("password"));
            recruiter.setRole(UserRole.RECRUITER);
            userRepository.save(recruiter);

            // Create a Candidate
            User candidate = new User();
            candidate.setName("Candidate One");
            candidate.setEmail("candidate@test.com");
            candidate.setPassword(passwordEncoder.encode("password"));
            candidate.setRole(UserRole.CANDIDATE);
            userRepository.save(candidate);

            // Create some Job Offers
            JobOffer job1 = new JobOffer();
            job1.setTitle("Java Developer");
            job1.setCompanyName("Tech Corp");
            job1.setLocation("Remote");
            job1.setRecruiter(recruiter);
            job1.setRequiredSkills("[\"java\", \"spring boot\", \"hibernate\", \"mysql\"]");
            job1.setDescription("We are looking for a Java Developer with experience in Spring Boot and Hibernate.");
            
            JobOffer job2 = new JobOffer();
            job2.setTitle("Frontend Developer");
            job2.setCompanyName("Web Solutions");
            job2.setLocation("Paris");
            job2.setRecruiter(recruiter);
            job2.setRequiredSkills("[\"react\", \"javascript\", \"css\", \"html\"]");
            job2.setDescription("Join our team as a Frontend Developer to build amazing user interfaces with React.");

            JobOffer job3 = new JobOffer();
            job3.setTitle("Python Developer");
            job3.setCompanyName("AI Innovations");
            job3.setLocation("London");
            job3.setRecruiter(recruiter);
            job3.setRequiredSkills("[\"python\", \"flask\", \"machine learning\", \"nlp\"]");
            job3.setDescription("Work on cutting-edge AI projects using Python and NLP techniques.");

            jobOfferRepository.saveAll(Arrays.asList(job1, job2, job3));

            System.out.println("Demo data initialized successfully!");
        }
    }
}

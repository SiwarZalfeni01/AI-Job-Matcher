package com.aijobmatcher.service;

import com.aijobmatcher.dto.JobOfferRequest;
import com.aijobmatcher.model.JobOffer;
import com.aijobmatcher.model.User;
import com.aijobmatcher.repository.JobOfferRepository;
import com.aijobmatcher.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final UserRepository userRepository;
    private final AIService aiService;

    public JobOffer createJobOffer(Long recruiterId, JobOfferRequest request) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        JobOffer jobOffer = new JobOffer();
        jobOffer.setRecruiter(recruiter);
        jobOffer.setTitle(request.getTitle());
        jobOffer.setDescription(request.getDescription());
        jobOffer.setCompanyName(request.getCompanyName());
        jobOffer.setLocation(request.getLocation());
        jobOffer.setSalaryRange(request.getSalaryRange());

        // Extract skills from description if not provided
        String skills = request.getRequiredSkills();
        if (skills == null || skills.isEmpty()) {
            skills = aiService.extractSkills(request.getDescription());
        }
        jobOffer.setRequiredSkills(skills);

        return jobOfferRepository.save(jobOffer);
    }

    public List<JobOffer> getAllJobOffers() {
        return jobOfferRepository.findAll();
    }

    public List<JobOffer> getRecruiterJobOffers(Long recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        return jobOfferRepository.findByRecruiter(recruiter);
    }

    public JobOffer getJobOffer(Long jobId) {
        return jobOfferRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job offer not found"));
    }

    public JobOffer updateJobOffer(Long jobId, JobOfferRequest request) {
        JobOffer jobOffer = jobOfferRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job offer not found"));

        jobOffer.setTitle(request.getTitle());
        jobOffer.setDescription(request.getDescription());
        jobOffer.setCompanyName(request.getCompanyName());
        jobOffer.setLocation(request.getLocation());
        jobOffer.setSalaryRange(request.getSalaryRange());

        String skills = request.getRequiredSkills();
        if (skills == null || skills.isEmpty()) {
            skills = aiService.extractSkills(request.getDescription());
        }
        jobOffer.setRequiredSkills(skills);

        return jobOfferRepository.save(jobOffer);
    }

    public void deleteJobOffer(Long jobId) {
        JobOffer jobOffer = jobOfferRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job offer not found"));

        jobOfferRepository.delete(jobOffer);
    }
}

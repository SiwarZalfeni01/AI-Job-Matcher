package com.aijobmatcher.service;

import com.aijobmatcher.dto.JobApplicationResponse;
import com.aijobmatcher.model.ApplicationStatus;
import com.aijobmatcher.model.JobApplication;
import com.aijobmatcher.model.JobOffer;
import com.aijobmatcher.model.User;
import com.aijobmatcher.repository.JobApplicationRepository;
import com.aijobmatcher.repository.JobOfferRepository;
import com.aijobmatcher.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobOfferRepository jobOfferRepository;
    private final UserRepository userRepository;

    public JobApplicationResponse applyForJob(Long userId, Long jobId) {
        User candidate = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        JobOffer job = jobOfferRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job offer not found"));

        // Check if already applied
        if (jobApplicationRepository.findByCandidateAndJobOffer(candidate, job).isPresent()) {
            throw new RuntimeException("Already applied for this job");
        }

        JobApplication application = new JobApplication();
        application.setCandidate(candidate);
        application.setJobOffer(job);
        application.setStatus(ApplicationStatus.PENDING);

        JobApplication savedApplication = jobApplicationRepository.save(application);
        return mapToResponse(savedApplication);
    }

    public List<JobApplicationResponse> getCandidateApplications(Long userId) {
        User candidate = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return jobApplicationRepository.findByCandidateOrderByAppliedAtDesc(candidate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobApplicationResponse> getRecruiterApplications(Long recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobApplicationRepository.findByJobOffer_RecruiterOrderByAppliedAtDesc(recruiter)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatus status) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        JobApplication updated = jobApplicationRepository.save(application);
        return mapToResponse(updated);
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {
        return new JobApplicationResponse(
                application.getId(),
                application.getJobOffer().getId(),
                application.getJobOffer().getTitle(),
                application.getJobOffer().getCompanyName(),
                application.getCandidate().getId(),
                application.getCandidate().getName(),
                application.getCandidate().getEmail(),
                application.getStatus(),
                application.getAppliedAt()
        );
    }
}

package com.aijobmatcher.repository;

import com.aijobmatcher.model.JobApplication;
import com.aijobmatcher.model.JobOffer;
import com.aijobmatcher.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByCandidateOrderByAppliedAtDesc(User candidate);
    List<JobApplication> findByJobOfferOrderByAppliedAtDesc(JobOffer jobOffer);
    List<JobApplication> findByJobOffer_RecruiterOrderByAppliedAtDesc(User recruiter);
    Optional<JobApplication> findByCandidateAndJobOffer(User candidate, JobOffer jobOffer);
}

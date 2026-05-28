package com.aijobmatcher.repository;

import com.aijobmatcher.model.JobOffer;
import com.aijobmatcher.model.MatchResult;
import com.aijobmatcher.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {
    List<MatchResult> findByUser(User user);
    List<MatchResult> findByUserOrderByScoreDesc(User user);
    List<MatchResult> findByJobOffer(JobOffer jobOffer);
    List<MatchResult> findByJobOfferOrderByScoreDesc(JobOffer jobOffer);
    List<MatchResult> findByJobOffer_RecruiterOrderByScoreDesc(User recruiter);
}

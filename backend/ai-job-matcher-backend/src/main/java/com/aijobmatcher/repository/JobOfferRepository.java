package com.aijobmatcher.repository;

import com.aijobmatcher.model.JobOffer;
import com.aijobmatcher.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    List<JobOffer> findByRecruiter(User recruiter);
    List<JobOffer> findAll();
}

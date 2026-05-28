package com.aijobmatcher.controller;

import com.aijobmatcher.dto.JobOfferRequest;
import com.aijobmatcher.model.JobOffer;
import com.aijobmatcher.service.JobOfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;

    @PostMapping("/create/{recruiterId}")
    public ResponseEntity<JobOffer> createJobOffer(@PathVariable Long recruiterId, @RequestBody JobOfferRequest request) {
        JobOffer jobOffer = jobOfferService.createJobOffer(recruiterId, request);
        return ResponseEntity.ok(jobOffer);
    }

    @GetMapping("/all")
    public ResponseEntity<List<JobOffer>> getAllJobOffers() {
        List<JobOffer> jobs = jobOfferService.getAllJobOffers();
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<JobOffer>> getRecruiterJobOffers(@PathVariable Long recruiterId) {
        List<JobOffer> jobs = jobOfferService.getRecruiterJobOffers(recruiterId);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobOffer> getJobOffer(@PathVariable Long jobId) {
        JobOffer job = jobOfferService.getJobOffer(jobId);
        return ResponseEntity.ok(job);
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<JobOffer> updateJobOffer(@PathVariable Long jobId, @RequestBody JobOfferRequest request) {
        JobOffer job = jobOfferService.updateJobOffer(jobId, request);
        return ResponseEntity.ok(job);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJobOffer(@PathVariable Long jobId) {
        jobOfferService.deleteJobOffer(jobId);
        return ResponseEntity.noContent().build();
    }
}

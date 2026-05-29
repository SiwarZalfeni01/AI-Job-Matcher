package com.aijobmatcher.controller;

import com.aijobmatcher.dto.JobApplicationResponse;
import com.aijobmatcher.model.ApplicationStatus;
import com.aijobmatcher.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping("/apply/{userId}/{jobId}")
    public ResponseEntity<JobApplicationResponse> apply(@PathVariable Long userId, @PathVariable Long jobId) {
        return ResponseEntity.ok(jobApplicationService.applyForJob(userId, jobId));
    }

    @GetMapping("/candidate/{userId}")
    public ResponseEntity<List<JobApplicationResponse>> getCandidateApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(jobApplicationService.getCandidateApplications(userId));
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<JobApplicationResponse>> getRecruiterApplications(@PathVariable Long recruiterId) {
        return ResponseEntity.ok(jobApplicationService.getRecruiterApplications(recruiterId));
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<JobApplicationResponse> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(jobApplicationService.updateApplicationStatus(applicationId, status));
    }
}

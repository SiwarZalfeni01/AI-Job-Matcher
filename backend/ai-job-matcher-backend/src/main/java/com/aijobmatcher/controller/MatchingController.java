package com.aijobmatcher.controller;

import com.aijobmatcher.dto.CandidateMatchResponse;
import com.aijobmatcher.dto.MatchResultResponse;
import com.aijobmatcher.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    @GetMapping("/job-candidates/{jobId}")
    public ResponseEntity<List<CandidateMatchResponse>> getCandidatesForJob(@PathVariable Long jobId) {
        List<CandidateMatchResponse> candidates = matchingService.getCandidatesForJob(jobId);
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/recruiter-candidates/{recruiterId}")
    public ResponseEntity<List<CandidateMatchResponse>> getCandidatesForRecruiter(@PathVariable Long recruiterId) {
        List<CandidateMatchResponse> candidates = matchingService.getCandidatesForRecruiter(recruiterId);
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/matches/{userId}")
    public ResponseEntity<List<MatchResultResponse>> getMatches(@PathVariable Long userId) {
        List<MatchResultResponse> matches = matchingService.getMatchesForCandidate(userId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/top-matches/{userId}")
    public ResponseEntity<List<MatchResultResponse>> getTopMatches(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        List<MatchResultResponse> matches = matchingService.getTopMatches(userId, limit);
        return ResponseEntity.ok(matches);
    }
}

package com.aijobmatcher.service;

import com.aijobmatcher.dto.CandidateMatchResponse;
import com.aijobmatcher.dto.MatchResultResponse;
import com.aijobmatcher.model.CV;
import com.aijobmatcher.model.JobOffer;
import com.aijobmatcher.model.MatchResult;
import com.aijobmatcher.model.User;
import com.aijobmatcher.repository.CVRepository;
import com.aijobmatcher.repository.JobOfferRepository;
import com.aijobmatcher.repository.MatchResultRepository;
import com.aijobmatcher.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final MatchResultRepository matchResultRepository;
    private final CVRepository cvRepository;
    private final JobOfferRepository jobOfferRepository;
    private final UserRepository userRepository;
    private final AIService aiService;

    public List<CandidateMatchResponse> getCandidatesForJob(Long jobId) {
        JobOffer job = jobOfferRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job offer not found"));
        
        return matchResultRepository.findByJobOfferOrderByScoreDesc(job).stream()
                .map(this::mapToCandidateMatchResponse)
                .collect(Collectors.toList());
    }

    public List<CandidateMatchResponse> getCandidatesForRecruiter(Long recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        
        return matchResultRepository.findByJobOffer_RecruiterOrderByScoreDesc(recruiter).stream()
                .map(this::mapToCandidateMatchResponse)
                .collect(Collectors.toList());
    }

    private CandidateMatchResponse mapToCandidateMatchResponse(MatchResult result) {
        return new CandidateMatchResponse(
                result.getId(),
                result.getUser().getId(),
                result.getUser().getName(),
                result.getUser().getEmail(),
                result.getScore(),
                result.getMatchedSkills(),
                result.getMissingSkills(),
                result.getJobOffer().getTitle()
        );
    }

    public List<MatchResultResponse> getMatchesForCandidate(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CV> cvs = cvRepository.findByUser(user);
        if (cvs.isEmpty()) {
            return new ArrayList<>();
        }

        CV latestCV = cvs.get(cvs.size() - 1);
        List<JobOffer> allJobs = jobOfferRepository.findAll();

        List<MatchResultResponse> matches = new ArrayList<>();

        for (JobOffer job : allJobs) {
            MatchResult matchResult = calculateMatch(user, latestCV, job);
            if (matchResult != null) {
                MatchResultResponse response = new MatchResultResponse(
                        matchResult.getId(),
                        job.getId(),
                        job.getTitle(),
                        job.getCompanyName(),
                        matchResult.getScore(),
                        matchResult.getMatchedSkills(),
                        matchResult.getMissingSkills()
                );
                matches.add(response);
            }
        }

        matches.sort((a, b) -> b.getScore().compareTo(a.getScore()));
        return matches;
    }

    public MatchResult calculateMatch(User user, CV cv, JobOffer job) {
        try {
            Map<String, Object> matchDetails = aiService.getMatchDetails(
                    cv.getExtractedSkills(),
                    job.getRequiredSkills()
            );

            MatchResult matchResult = new MatchResult();
            matchResult.setUser(user);
            matchResult.setJobOffer(job);
            matchResult.setScore((Double) matchDetails.get("score"));
            matchResult.setMatchedSkills((String) matchDetails.get("matched_skills"));
            matchResult.setMissingSkills((String) matchDetails.get("missing_skills"));

            return matchResultRepository.save(matchResult);
        } catch (Exception e) {
            return null;
        }
    }

    public List<MatchResultResponse> getTopMatches(Long userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MatchResult> results = matchResultRepository.findByUserOrderByScoreDesc(user);

        if (results.isEmpty()) {
            // Trigger calculation if no results found
            getMatchesForCandidate(userId);
            // Re-fetch results after calculation
            results = matchResultRepository.findByUserOrderByScoreDesc(user);
        }

        List<MatchResultResponse> responses = new ArrayList<>();
        for (int i = 0; i < Math.min(limit, results.size()); i++) {
            MatchResult result = results.get(i);
            MatchResultResponse response = new MatchResultResponse(
                    result.getId(),
                    result.getJobOffer().getId(),
                    result.getJobOffer().getTitle(),
                    result.getJobOffer().getCompanyName(),
                    result.getScore(),
                    result.getMatchedSkills(),
                    result.getMissingSkills()
            );
            responses.add(response);
        }

        return responses;
    }
}

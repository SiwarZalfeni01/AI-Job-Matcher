package com.aijobmatcher.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateMatchResponse {
    private Long matchId;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private Double score;
    private String matchedSkills;
    private String missingSkills;
    private String jobTitle;
}

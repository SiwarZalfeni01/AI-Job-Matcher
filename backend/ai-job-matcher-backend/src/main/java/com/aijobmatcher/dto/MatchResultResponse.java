package com.aijobmatcher.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchResultResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private Double score;
    private String matchedSkills;
    private String missingSkills;
}

package com.aijobmatcher.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobOfferRequest {
    private String title;
    private String description;
    private String requiredSkills;
    private String companyName;
    private String location;
    private String salaryRange;
}

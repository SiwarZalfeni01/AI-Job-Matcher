package com.aijobmatcher.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requiredSkills;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    @JsonIgnoreProperties({"password", "cvs", "jobOffers", "createdAt", "updatedAt", "hibernateLazyInitializer"})
    private User recruiter;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "location")
    private String location;

    @Column(name = "salary_range")
    private String salaryRange;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
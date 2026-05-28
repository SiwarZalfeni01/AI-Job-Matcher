package com.aijobmatcher.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "cvs", "jobOffers", "createdAt", "updatedAt", "hibernateLazyInitializer"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    @JsonIgnoreProperties({"recruiter", "createdAt", "updatedAt", "hibernateLazyInitializer"})
    private JobOffer jobOffer;

    @Column(nullable = false)
    private Double score;

    @Column(columnDefinition = "TEXT")
    private String matchedSkills;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

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
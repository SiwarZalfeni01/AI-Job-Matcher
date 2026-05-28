package com.aijobmatcher.controller;

import com.aijobmatcher.dto.JobOfferRequest;
import com.aijobmatcher.model.JobOffer;
import com.aijobmatcher.service.JobOfferService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class JobOfferControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JobOfferService jobOfferService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateJobOffer() throws Exception {
        JobOfferRequest request = new JobOfferRequest();
        request.setTitle("Java Developer");
        request.setDescription("Spring Boot expert");

        JobOffer job = new JobOffer();
        job.setId(1L);
        job.setTitle("Java Developer");

        when(jobOfferService.createJobOffer(eq(1L), any(JobOfferRequest.class))).thenReturn(job);

        mockMvc.perform(post("/api/jobs/create/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Java Developer"));
    }

    @Test
    public void testGetAllJobOffers() throws Exception {
        JobOffer job1 = new JobOffer();
        job1.setId(1L);
        JobOffer job2 = new JobOffer();
        job2.setId(2L);
        List<JobOffer> jobs = Arrays.asList(job1, job2);

        when(jobOfferService.getAllJobOffers()).thenReturn(jobs);

        mockMvc.perform(get("/api/jobs/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    public void testGetRecruiterJobOffers() throws Exception {
        JobOffer job = new JobOffer();
        job.setId(1L);
        List<JobOffer> jobs = Arrays.asList(job);

        when(jobOfferService.getRecruiterJobOffers(1L)).thenReturn(jobs);

        mockMvc.perform(get("/api/jobs/recruiter/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    public void testGetJobOffer() throws Exception {
        JobOffer job = new JobOffer();
        job.setId(1L);

        when(jobOfferService.getJobOffer(1L)).thenReturn(job);

        mockMvc.perform(get("/api/jobs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void testUpdateJobOffer() throws Exception {
        JobOfferRequest request = new JobOfferRequest();
        request.setTitle("Updated Title");

        JobOffer job = new JobOffer();
        job.setId(1L);
        job.setTitle("Updated Title");

        when(jobOfferService.updateJobOffer(eq(1L), any(JobOfferRequest.class))).thenReturn(job);

        mockMvc.perform(put("/api/jobs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    public void testDeleteJobOffer() throws Exception {
        mockMvc.perform(delete("/api/jobs/1"))
                .andExpect(status().isNoContent());
    }
}

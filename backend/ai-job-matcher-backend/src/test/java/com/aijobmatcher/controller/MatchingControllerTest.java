package com.aijobmatcher.controller;

import com.aijobmatcher.dto.MatchResultResponse;
import com.aijobmatcher.service.MatchingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class MatchingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MatchingService matchingService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetMatches() throws Exception {
        MatchResultResponse match1 = new MatchResultResponse();
        match1.setJobId(1L);
        match1.setScore(85.5);
        
        MatchResultResponse match2 = new MatchResultResponse();
        match2.setJobId(2L);
        match2.setScore(70.0);
        
        List<MatchResultResponse> matches = Arrays.asList(match1, match2);

        when(matchingService.getMatchesForCandidate(1L)).thenReturn(matches);

        mockMvc.perform(get("/api/matching/matches/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].jobId").value(1))
                .andExpect(jsonPath("$[0].score").value(85.5))
                .andExpect(jsonPath("$[1].jobId").value(2))
                .andExpect(jsonPath("$[1].score").value(70.0));
    }

    @Test
    public void testGetTopMatches() throws Exception {
        MatchResultResponse match = new MatchResultResponse();
        match.setJobId(1L);
        match.setScore(95.0);
        
        List<MatchResultResponse> matches = Arrays.asList(match);

        when(matchingService.getTopMatches(1L, 5)).thenReturn(matches);

        mockMvc.perform(get("/api/matching/top-matches/1").param("limit", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].jobId").value(1))
                .andExpect(jsonPath("$[0].score").value(95.0));
    }
}

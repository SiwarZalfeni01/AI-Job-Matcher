package com.aijobmatcher.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${ai.service.url:http://localhost:5000}")
    private String aiServiceUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public String extractSkills(String text) {
        try {
            Map<String, String> request = new HashMap<>();
            request.put("text", text);

            String response = webClient.post()
                    .uri(aiServiceUrl + "/extract-skills")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.get("skills").asText();
        } catch (Exception e) {
            return "[]";
        }
    }

    public Double calculateMatchScore(String cvSkills, String jobSkills) {
        try {
            Map<String, String> request = new HashMap<>();
            request.put("cv_skills", cvSkills);
            request.put("job_skills", jobSkills);

            String response = webClient.post()
                    .uri(aiServiceUrl + "/calculate-match")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.get("score").asDouble();
        } catch (Exception e) {
            return 0.0;
        }
    }

    public Map<String, Object> getMatchDetails(String cvSkills, String jobSkills) {
        try {
            Map<String, String> request = new HashMap<>();
            request.put("cv_skills", cvSkills);
            request.put("job_skills", jobSkills);

            String response = webClient.post()
                    .uri(aiServiceUrl + "/match-details")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            Map<String, Object> result = new HashMap<>();
            result.put("score", jsonNode.get("score").asDouble());
            result.put("matched_skills", jsonNode.get("matched_skills").asText());
            result.put("missing_skills", jsonNode.get("missing_skills").asText());

            return result;
        } catch (Exception e) {
            return new HashMap<>();
        }
    }
}

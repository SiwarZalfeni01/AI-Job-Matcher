package com.aijobmatcher.service;

import com.aijobmatcher.dto.CVRequest;
import com.aijobmatcher.model.CV;
import com.aijobmatcher.model.User;
import com.aijobmatcher.repository.CVRepository;
import com.aijobmatcher.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CVService {

    private final CVRepository cvRepository;
    private final UserRepository userRepository;
    private final AIService aiService;

    public CV uploadCV(Long userId, MultipartFile file) throws IOException {
        System.out.println("Uploading CV for userId: " + userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        String content = "";
        try {
            content = extractTextFromFile(file);
        } catch (Exception e) {
            System.err.println("Error extracting text: " + e.getMessage());
            content = "Error extracting text from file";
        }

        CV cv = new CV();
        cv.setUser(user);
        cv.setFileName(file.getOriginalFilename());
        cv.setContent(content);

        // Call AI service to extract skills
        try {
            String extractedSkills = aiService.extractSkills(content);
            cv.setExtractedSkills(extractedSkills);
        } catch (Exception e) {
            System.err.println("AI Service error: " + e.getMessage());
            cv.setExtractedSkills("[]");
        }

        CV savedCv = cvRepository.save(cv);
        System.out.println("CV saved successfully with ID: " + savedCv.getId());
        return savedCv;
    }

    public CV addCV(Long userId, CVRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CV cv = new CV();
        cv.setUser(user);
        cv.setFileName(request.getFileName());
        cv.setContent(request.getContent());

        // Call AI service to extract skills
        String extractedSkills = aiService.extractSkills(request.getContent());
        cv.setExtractedSkills(extractedSkills);

        return cvRepository.save(cv);
    }

    public List<CV> getUserCVs(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cvRepository.findByUser(user);
    }

    public CV getCV(Long userId, Long cvId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cvRepository.findByUserAndId(user, cvId)
                .orElseThrow(() -> new RuntimeException("CV not found"));
    }

    public void deleteCV(Long userId, Long cvId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CV cv = cvRepository.findByUserAndId(user, cvId)
                .orElseThrow(() -> new RuntimeException("CV not found"));

        cvRepository.delete(cv);
    }

    private String extractTextFromFile(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();

        if (fileName != null && fileName.endsWith(".pdf")) {
            return extractTextFromPDF(file);
        } else {
            return new String(file.getBytes());
        }
    }

    private String extractTextFromPDF(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}

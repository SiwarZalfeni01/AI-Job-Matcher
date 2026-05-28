package com.aijobmatcher.controller;

import com.aijobmatcher.dto.CVRequest;
import com.aijobmatcher.model.CV;
import com.aijobmatcher.service.CVService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
public class CVController {

    private final CVService cvService;

    @PostMapping("/upload/{userId}")
    public ResponseEntity<CV> uploadCV(@PathVariable Long userId, @RequestParam("file") MultipartFile file) throws IOException {
        CV cv = cvService.uploadCV(userId, file);
        return ResponseEntity.ok(cv);
    }

    @PostMapping("/add/{userId}")
    public ResponseEntity<CV> addCV(@PathVariable Long userId, @RequestBody CVRequest request) {
        CV cv = cvService.addCV(userId, request);
        return ResponseEntity.ok(cv);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CV>> getUserCVs(@PathVariable Long userId) {
        List<CV> cvs = cvService.getUserCVs(userId);
        return ResponseEntity.ok(cvs);
    }

    @GetMapping("/{userId}/{cvId}")
    public ResponseEntity<CV> getCV(@PathVariable Long userId, @PathVariable Long cvId) {
        CV cv = cvService.getCV(userId, cvId);
        return ResponseEntity.ok(cv);
    }

    @DeleteMapping("/{userId}/{cvId}")
    public ResponseEntity<Void> deleteCV(@PathVariable Long userId, @PathVariable Long cvId) {
        cvService.deleteCV(userId, cvId);
        return ResponseEntity.noContent().build();
    }
}

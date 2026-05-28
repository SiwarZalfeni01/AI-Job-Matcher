package com.aijobmatcher.controller;

import com.aijobmatcher.dto.CVRequest;
import com.aijobmatcher.model.CV;
import com.aijobmatcher.service.CVService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
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
public class CVControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CVService cvService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testUploadCV() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "cv.pdf", "application/pdf", "dummy content".getBytes());
        CV cv = new CV();
        cv.setId(1L);
        cv.setFileName("cv.pdf");

        when(cvService.uploadCV(eq(1L), any())).thenReturn(cv);

        mockMvc.perform(multipart("/api/cv/upload/1").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.fileName").value("cv.pdf"));
    }

    @Test
    public void testAddCV() throws Exception {
        CVRequest request = new CVRequest();
        request.setFileName("Software Engineer CV.pdf");
        request.setContent("Experienced Java Developer");

        CV cv = new CV();
        cv.setId(1L);
        cv.setFileName("Software Engineer CV.pdf");

        when(cvService.addCV(eq(1L), any(CVRequest.class))).thenReturn(cv);

        mockMvc.perform(post("/api/cv/add/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.fileName").value("Software Engineer CV.pdf"));
    }

    @Test
    public void testGetUserCVs() throws Exception {
        CV cv1 = new CV();
        cv1.setId(1L);
        CV cv2 = new CV();
        cv2.setId(2L);
        List<CV> cvs = Arrays.asList(cv1, cv2);

        when(cvService.getUserCVs(1L)).thenReturn(cvs);

        mockMvc.perform(get("/api/cv/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    public void testGetCV() throws Exception {
        CV cv = new CV();
        cv.setId(1L);

        when(cvService.getCV(1L, 1L)).thenReturn(cv);

        mockMvc.perform(get("/api/cv/1/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void testDeleteCV() throws Exception {
        mockMvc.perform(delete("/api/cv/1/1"))
                .andExpect(status().isNoContent());
    }
}

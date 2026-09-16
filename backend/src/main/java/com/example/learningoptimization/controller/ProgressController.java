package com.example.learningoptimization.controller;

import com.example.learningoptimization.model.Progress;
import com.example.learningoptimization.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/progress")
@CrossOrigin(origins = "*")
public class ProgressController {
    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody Progress progress) {
        Progress saved = progressService.updateProgress(progress);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Progress>> list(@RequestParam Long userId) {
        return ResponseEntity.ok(progressService.getProgress(userId));
    }
}

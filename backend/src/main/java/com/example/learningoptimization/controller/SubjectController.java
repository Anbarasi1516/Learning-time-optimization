package com.example.learningoptimization.controller;

import com.example.learningoptimization.model.Subject;
import com.example.learningoptimization.service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {
    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Subject subject) {
        Subject saved = subjectService.addSubject(subject);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Subject>> list(@RequestParam Long userId) {
        return ResponseEntity.ok(subjectService.listSubjects(userId));
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Subject subject) {
        Subject updated = subjectService.updateSubject(subject);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam Long subjectId) {
        subjectService.deleteSubject(subjectId);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}

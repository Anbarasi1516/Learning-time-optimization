package com.example.learningoptimization.controller;

import com.example.learningoptimization.model.TimetableEntry;
import com.example.learningoptimization.service.TimetableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/timetable")
@CrossOrigin(origins = "*")
public class TimetableController {
    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody Map<String, Long> payload) {
        List<TimetableEntry> entries = timetableService.generateTimetable(payload.get("userId"));
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/today")
    public ResponseEntity<List<TimetableEntry>> today(@RequestParam Long userId) {
        return ResponseEntity.ok(timetableService.getTodayTimetable(userId));
    }

    @PostMapping("/regenerate")
    public ResponseEntity<?> regenerate(@RequestBody Map<String, Long> payload) {
        List<TimetableEntry> entries = timetableService.regenerateTimetable(payload.get("userId"));
        return ResponseEntity.ok(entries);
    }
}

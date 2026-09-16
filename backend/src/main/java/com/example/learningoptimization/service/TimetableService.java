package com.example.learningoptimization.service;

import com.example.learningoptimization.model.Progress;
import com.example.learningoptimization.model.Subject;
import com.example.learningoptimization.model.TimetableEntry;
import com.example.learningoptimization.model.User;
import com.example.learningoptimization.repository.ProgressRepository;
import com.example.learningoptimization.repository.SubjectRepository;
import com.example.learningoptimization.repository.TimetableRepository;
import com.example.learningoptimization.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;

    public TimetableService(TimetableRepository timetableRepository,
                            SubjectRepository subjectRepository,
                            UserRepository userRepository,
                            ProgressRepository progressRepository) {
        this.timetableRepository = timetableRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.progressRepository = progressRepository;
    }

    // ✅ GENERATE TIMETABLE
    public List<TimetableEntry> generateTimetable(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Subject> subjects = subjectRepository.findByUserId(userId);

        if (subjects.isEmpty()) {
            return Collections.emptyList();
        }

        Map<Subject, Double> scoreMap = new HashMap<>();
        for (Subject subject : subjects) {
            scoreMap.put(subject, calculateScore(subject));
        }

        List<Subject> sorted = scoreMap.entrySet()
                .stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        timetableRepository.deleteByUserId(userId);

        int totalHours = Math.max(1, user.getDailyHours());
        double totalScore = scoreMap.values().stream()
                .mapToDouble(Double::doubleValue)
                .sum();

        List<TimetableEntry> entries = new ArrayList<>();
        LocalTime cursor = LocalTime.of(5, 0);

        for (Subject subject : sorted) {

            double score = scoreMap.get(subject);

            int hoursForSubject = (int) Math.max(1,
                    Math.round((score / totalScore) * totalHours));

            if (cursor.plusHours(hoursForSubject).isAfter(LocalTime.of(22, 0))) {
                hoursForSubject = Math.max(1, 22 - cursor.getHour());
            }

            if (hoursForSubject <= 0) continue;

            TimetableEntry entry = createEntry(userId, subject, cursor, hoursForSubject);
            entries.add(entry);

            cursor = cursor.plusHours(hoursForSubject);

            if (cursor.isAfter(LocalTime.of(21, 0))) break;
        }

        if (entries.isEmpty() && !sorted.isEmpty()) {
            entries.add(createEntry(userId, sorted.get(0), LocalTime.of(5, 0), 1));
        }

        return timetableRepository.saveAll(entries);
    }

    // ✅ GET TODAY
    public List<TimetableEntry> getTodayTimetable(Long userId) {
        return timetableRepository.findByUserId(userId);
    }

    // ✅ REGENERATE (FIXED — NO LAMBDA ISSUE)
    public List<TimetableEntry> regenerateTimetable(Long userId) {

        List<TimetableEntry> existing = timetableRepository.findByUserId(userId);

        List<TimetableEntry> missed = existing.stream()
                .filter(entry -> entry.getStatus().equalsIgnoreCase("pending"))
                .collect(Collectors.toList());

        if (missed.isEmpty()) {
            return generateTimetable(userId);
        }

        LocalTime start = LocalTime.now().isBefore(LocalTime.of(5, 0))
                ? LocalTime.of(5, 0)
                : LocalTime.now();

        if (start.isAfter(LocalTime.of(22, 0))) {
            start = LocalTime.of(20, 0);
        }

        Map<Long, Subject> subjectMap = subjectRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(Subject::getId, s -> s));

        timetableRepository.deleteByUserId(userId);

        List<TimetableEntry> regenerated = new ArrayList<>();

        for (TimetableEntry entry : missed) {

            Subject subject = subjectMap.get(entry.getSubjectId());
            if (subject == null) continue;

            TimetableEntry next = createEntry(userId, subject, start, 1);
            next.setStatus("pending");

            regenerated.add(next);

            start = start.plusHours(1);
        }

        return timetableRepository.saveAll(regenerated);
    }

    // ✅ CREATE ENTRY
    private TimetableEntry createEntry(Long userId, Subject subject, LocalTime start, int hours) {

        TimetableEntry entry = new TimetableEntry();

        entry.setUserId(userId);
        entry.setSubjectId(subject.getId());
        entry.setSubjectName(subject.getName());
        entry.setTopic("Study important topics");
        entry.setStartTime(start.toString());
        entry.setEndTime(start.plusHours(hours).toString());
        entry.setStatus("pending");

        return entry;
    }

    // ✅ SCORE CALCULATION
    private double calculateScore(Subject subject) {

        int difficulty;
        switch (subject.getDifficulty()) {
            case "HARD": difficulty = 3; break;
            case "MEDIUM": difficulty = 2; break;
            default: difficulty = 1;
        }

        int priority;
        switch (subject.getPriority()) {
            case "HIGH": priority = 3; break;
            case "MEDIUM": priority = 2; break;
            default: priority = 1;
        }

        long days = Math.max(0,
                LocalDate.now().until(subject.getExamDate()).getDays());

        double urgency = (days <= 1) ? 10 : Math.max(1, 10 - days);

        return (difficulty * 2) + (priority * 3) + urgency;
    }
}
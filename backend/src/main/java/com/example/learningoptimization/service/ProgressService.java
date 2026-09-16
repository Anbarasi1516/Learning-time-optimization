package com.example.learningoptimization.service;

import com.example.learningoptimization.model.Progress;
import com.example.learningoptimization.model.Subject;
import com.example.learningoptimization.repository.ProgressRepository;
import com.example.learningoptimization.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProgressService {
    private final ProgressRepository progressRepository;
    private final SubjectRepository subjectRepository;

    public ProgressService(ProgressRepository progressRepository, SubjectRepository subjectRepository) {
        this.progressRepository = progressRepository;
        this.subjectRepository = subjectRepository;
    }

    public Progress updateProgress(Progress progress) {
        Subject subject = subjectRepository.findById(progress.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Subject not found."));
        Progress existing = progressRepository.findByUserIdAndSubjectId(progress.getUserId(), progress.getSubjectId());
        if (existing != null) {
            existing.setHoursStudied(existing.getHoursStudied() + progress.getHoursStudied());
            existing.setPerformanceScore(progress.getPerformanceScore());
            existing.setSubjectName(subject.getName());
            return progressRepository.save(existing);
        }
        progress.setSubjectName(subject.getName());
        return progressRepository.save(progress);
    }

    public List<Progress> getProgress(Long userId) {
        return progressRepository.findByUserId(userId);
    }
}

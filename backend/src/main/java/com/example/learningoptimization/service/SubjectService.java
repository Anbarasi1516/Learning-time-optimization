package com.example.learningoptimization.service;

import com.example.learningoptimization.model.Subject;
import com.example.learningoptimization.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubjectService {
    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public Subject addSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public List<Subject> listSubjects(Long userId) {
        return subjectRepository.findByUserId(userId);
    }

    public Subject updateSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public void deleteSubject(Long subjectId) {
        subjectRepository.deleteById(subjectId);
    }
}

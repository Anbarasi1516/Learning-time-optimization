package com.example.learningoptimization.repository;

import com.example.learningoptimization.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUserId(Long userId);
    Progress findByUserIdAndSubjectId(Long userId, Long subjectId);
}

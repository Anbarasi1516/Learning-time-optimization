package com.example.learningoptimization.repository;

import com.example.learningoptimization.model.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimetableRepository extends JpaRepository<TimetableEntry, Long> {
    List<TimetableEntry> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}

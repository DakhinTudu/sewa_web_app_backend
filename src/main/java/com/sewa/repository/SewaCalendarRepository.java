package com.sewa.repository;

import com.sewa.entity.SewaCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SewaCalendarRepository extends JpaRepository<SewaCalendar, Integer> {
    List<SewaCalendar> findByChapterId(Integer chapterId);
}

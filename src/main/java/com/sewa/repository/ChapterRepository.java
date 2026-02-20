package com.sewa.repository;

import com.sewa.entity.Chapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Integer> {
    List<Chapter> findByIsDeletedFalse();

    Page<Chapter> findByIsDeletedFalse(Pageable pageable);

    Optional<Chapter> findByIdAndIsDeletedFalse(Integer id);
}

package com.sewa.repository;

import com.sewa.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByMembershipCode(String membershipCode);

    Optional<Student> findByUserUsername(String username);

    @Query("SELECT s.chapter.chapterName, COUNT(s) FROM Student s GROUP BY s.chapter.chapterName")
    List<Object[]> countStudentsByChapter();

    @Query("SELECT s.educationalLevel, COUNT(s) FROM Student s GROUP BY s.educationalLevel")
    List<Object[]> countStudentsByEducationalLevel();

    org.springframework.data.domain.Page<Student> findByStatus(com.sewa.entity.enums.MembershipStatus status,
            org.springframework.data.domain.Pageable pageable);

    @Query("SELECT COALESCE(MAX(s.id), 0) FROM Student s")
    Long getLastStudentId();
}

package com.sewa.repository;

import com.sewa.entity.EducationalLevelMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EducationalLevelRepository extends JpaRepository<EducationalLevelMaster, Integer> {
    List<EducationalLevelMaster> findByActiveTrue();

    Optional<EducationalLevelMaster> findByName(String name);
}

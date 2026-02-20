package com.sewa.repository;

import com.sewa.entity.WorkingSectorMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkingSectorRepository extends JpaRepository<WorkingSectorMaster, Integer> {
    List<WorkingSectorMaster> findByActiveTrue();

    Optional<WorkingSectorMaster> findByName(String name);
}

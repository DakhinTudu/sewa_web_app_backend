package com.sewa.repository;

import com.sewa.entity.GenderMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenderRepository extends JpaRepository<GenderMaster, Integer> {
    List<GenderMaster> findByActiveTrue();

    Optional<GenderMaster> findByName(String name);
}

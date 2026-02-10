package com.sewa.repository;

import com.sewa.entity.ElectedRepresentative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElectedRepresentativeRepository extends JpaRepository<ElectedRepresentative, Integer> {
    List<ElectedRepresentative> findByActiveTrue();
}

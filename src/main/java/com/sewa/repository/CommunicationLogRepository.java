package com.sewa.repository;

import com.sewa.entity.CommunicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Integer> {

    List<CommunicationLog> findTop50ByOrderByCreatedAtDesc();
}

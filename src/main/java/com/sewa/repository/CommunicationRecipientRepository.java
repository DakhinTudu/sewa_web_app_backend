package com.sewa.repository;

import com.sewa.entity.CommunicationRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunicationRecipientRepository extends JpaRepository<CommunicationRecipient, Integer> {

    @Query("SELECT cr FROM CommunicationRecipient cr JOIN FETCH cr.communicationLog WHERE cr.userId = :userId ORDER BY cr.communicationLog.createdAt DESC")
    List<CommunicationRecipient> findByUserIdOrderByLogCreatedAtDesc(@Param("userId") Integer userId, Pageable pageable);

    long countByUserIdAndReadAtIsNull(Integer userId);

    @Modifying
    @Query("UPDATE CommunicationRecipient cr SET cr.readAt = CURRENT_TIMESTAMP WHERE cr.userId = :userId AND cr.readAt IS NULL")
    int markAllAsReadByUserId(@Param("userId") Integer userId);
}

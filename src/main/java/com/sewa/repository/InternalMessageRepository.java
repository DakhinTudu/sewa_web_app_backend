package com.sewa.repository;

import com.sewa.entity.InternalMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InternalMessageRepository extends JpaRepository<InternalMessage, Integer> {
}

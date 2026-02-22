package com.sewa.repository;

import com.sewa.entity.UserAnnouncementRead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAnnouncementReadRepository extends JpaRepository<UserAnnouncementRead, Integer> {

    Optional<UserAnnouncementRead> findByUserIdAndAnnouncementId(Integer userId, Integer announcementId);

    @Query("SELECT uar.announcementId FROM UserAnnouncementRead uar WHERE uar.userId = :userId")
    List<Integer> findReadAnnouncementIdsByUserId(@Param("userId") Integer userId);

    boolean existsByUserIdAndAnnouncementId(Integer userId, Integer announcementId);
}

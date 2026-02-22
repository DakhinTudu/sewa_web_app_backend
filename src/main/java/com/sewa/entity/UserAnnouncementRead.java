package com.sewa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_announcement_reads", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "announcement_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAnnouncementRead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "announcement_id", nullable = false)
    private Integer announcementId;

    @Column(name = "read_at", nullable = false)
    private LocalDateTime readAt;
}

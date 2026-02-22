package com.sewa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "communication_recipients", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "communication_log_id", "user_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunicationRecipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "communication_log_id", nullable = false)
    private CommunicationLog communicationLog;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "read_at")
    private LocalDateTime readAt;
}

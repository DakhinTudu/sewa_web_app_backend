package com.sewa.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "communication_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class CommunicationLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Integer id;

    @Column(name = "sent_by_user_id", nullable = false)
    private Integer sentByUserId;

    @Column(name = "subject", nullable = false, length = 500)
    private String subject;

    @Column(name = "recipient_count", nullable = false)
    private Integer recipientCount;

    @Column(name = "criteria_summary", length = 1000)
    private String criteriaSummary;
}

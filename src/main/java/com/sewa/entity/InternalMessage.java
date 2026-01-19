package com.sewa.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "internal_messages")
@Data
public class InternalMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    private String subject;

    @Column(name = "message_body", nullable = false)
    private String messageBody;

    private String priority;
    private String visibility;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}


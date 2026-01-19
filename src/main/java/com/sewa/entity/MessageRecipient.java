package com.sewa.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "message_recipients")
@Data
public class MessageRecipient {

    @EmbeddedId
    private MessageRecipientId id;

    @ManyToOne
    @MapsId("messageId")
    @JoinColumn(name = "message_id")
    private InternalMessage message;

    @ManyToOne
    @MapsId("recipientUserId")
    @JoinColumn(name = "recipient_user_id")
    private User recipient;

    private Boolean isRead;
    private LocalDateTime readAt;
}


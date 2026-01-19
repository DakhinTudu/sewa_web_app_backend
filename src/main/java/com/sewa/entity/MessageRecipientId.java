package com.sewa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class MessageRecipientId implements Serializable {

    @Column(name = "message_id")
    private Integer messageId;

    @Column(name = "recipient_user_id")
    private Integer recipientUserId;
}

package com.sewa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunicationReceivedResponse {

    /** ID of CommunicationRecipient (for mark-as-read) */
    private Integer id;
    private String subject;
    private LocalDateTime sentAt;
    private boolean read;
}

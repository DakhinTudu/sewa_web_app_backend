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
public class CommunicationLogResponse {

    private Integer id;
    private Integer sentByUserId;
    private String subject;
    private Integer recipientCount;
    private String criteriaSummary;
    private LocalDateTime sentAt;
}

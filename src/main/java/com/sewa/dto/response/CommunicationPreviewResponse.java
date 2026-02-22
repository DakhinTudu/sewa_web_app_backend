package com.sewa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunicationPreviewResponse {

    private int recipientCount;
    private List<String> sampleEmails;
}

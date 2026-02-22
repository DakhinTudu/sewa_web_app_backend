package com.sewa.service;

import com.sewa.dto.request.CommunicationRecipientRequest;
import com.sewa.dto.request.SendCommunicationRequest;
import com.sewa.dto.response.CommunicationLogResponse;
import com.sewa.dto.response.CommunicationPreviewResponse;
import com.sewa.dto.response.CommunicationReceivedResponse;

import java.util.List;

public interface CommunicationService {

    CommunicationPreviewResponse preview(CommunicationRecipientRequest selection);

    void send(SendCommunicationRequest request, String sentByUsername);

    List<CommunicationLogResponse> getHistory();

    List<CommunicationReceivedResponse> getCommunicationsReceivedByMe(String username);

    int getCommunicationsReceivedUnreadCount(String username);

    void markCommunicationReceivedAsRead(Integer recipientId, String username);
}

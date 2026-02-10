package com.sewa.service;

import com.sewa.dto.request.MessageRequest;
import com.sewa.dto.response.MessageResponse;
import java.util.List;

public interface InternalMessageService {
    List<MessageResponse> getAllMessages();

    MessageResponse sendMessage(String senderUsername, MessageRequest messageRequest);
}

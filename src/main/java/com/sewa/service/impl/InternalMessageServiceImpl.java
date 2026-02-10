package com.sewa.service.impl;

import com.sewa.dto.request.MessageRequest;
import com.sewa.dto.response.MessageResponse;
import com.sewa.entity.InternalMessage;
import com.sewa.entity.User;
import com.sewa.exception.SewaException;
import com.sewa.repository.InternalMessageRepository;
import com.sewa.repository.UserRepository;
import com.sewa.service.InternalMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InternalMessageServiceImpl implements InternalMessageService {

    private final InternalMessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    public List<MessageResponse> getAllMessages() {
        return messageRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageResponse sendMessage(String senderUsername, MessageRequest messageRequest) {
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new SewaException("Sender not found"));

        InternalMessage message = InternalMessage.builder()
                .sender(sender)
                .subject(messageRequest.getSubject())
                .content(messageRequest.getContent())
                .priority(messageRequest.getPriority())
                .visibility(messageRequest.getVisibility())
                .expiresAt(messageRequest.getExpiresAt())
                .build();

        return mapToResponse(messageRepository.save(message));
    }

    private MessageResponse mapToResponse(InternalMessage message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderName(message.getSender() != null ? message.getSender().getUsername() : "System")
                .subject(message.getSubject())
                .content(message.getContent())
                .priority(message.getPriority())
                .visibility(message.getVisibility())
                .expiresAt(message.getExpiresAt())
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .build();
    }
}

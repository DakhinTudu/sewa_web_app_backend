package com.sewa.service.impl;

import com.sewa.dto.request.NoticeRequest;
import com.sewa.dto.response.NoticeResponse;
import com.sewa.entity.Notice;
import com.sewa.entity.User;
import com.sewa.exception.SewaException;
import com.sewa.repository.NoticeRepository;
import com.sewa.repository.UserRepository;
import com.sewa.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;

    @Override
    public List<NoticeResponse> getAllNotices() {
        return noticeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NoticeResponse saveNotice(String authorUsername, NoticeRequest noticeRequest) {
        User author = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new SewaException("Author not found"));

        Notice notice = Notice.builder()
                .title(noticeRequest.getTitle())
                .content(noticeRequest.getContent())
                .expiresAt(noticeRequest.getExpiresAt())
                .active(noticeRequest.getActive() != null ? noticeRequest.getActive() : true)
                .author(author)
                .build();

        return mapToResponse(noticeRepository.save(notice));
    }

    private NoticeResponse mapToResponse(Notice notice) {
        return NoticeResponse.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .authorName(notice.getAuthor() != null ? notice.getAuthor().getUsername() : "System")
                .active(notice.getActive())
                .expiresAt(notice.getExpiresAt())
                .createdAt(notice.getCreatedAt())
                .updatedAt(notice.getUpdatedAt())
                .build();
    }
}

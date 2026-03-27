package com.sewa.service.impl;

import com.sewa.dto.request.AnnouncementRequest;
import com.sewa.dto.response.AnnouncementResponse;
import com.sewa.entity.Announcement;
import com.sewa.entity.User;
import com.sewa.entity.UserAnnouncementRead;
import com.sewa.exception.SewaException;
import com.sewa.repository.AnnouncementRepository;
import com.sewa.repository.UserAnnouncementReadRepository;
import com.sewa.repository.UserRepository;
import com.sewa.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserAnnouncementReadRepository readRepository;
    private final UserRepository userRepository;

    @Override
    public List<AnnouncementResponse> listForCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));
        List<Integer> readIds = readRepository.findReadAnnouncementIdsByUserId(user.getId());
        Set<Integer> readSet = readIds.stream().collect(Collectors.toSet());
        List<Announcement> announcements = announcementRepository.findTop50ByOrderByCreatedAtDesc();
        return announcements.stream()
                .map(a -> toResponse(a, readSet.contains(a.getId())))
                .toList();
    }

    @Override
    public int getUnreadCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));
        List<Integer> readIds = readRepository.findReadAnnouncementIdsByUserId(user.getId());
        Set<Integer> readSet = readIds.stream().collect(Collectors.toSet());
        List<Announcement> all = announcementRepository.findTop50ByOrderByCreatedAtDesc();
        return (int) all.stream().filter(a -> !readSet.contains(a.getId())).count();
    }

    @Override
    @Transactional
    public void create(AnnouncementRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));
        Announcement announcement = Announcement.builder()
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .createdByUserId(user.getId())
                .build();
        announcementRepository.save(announcement);
    }

    @Override
    @Transactional
    public void markAsRead(Integer announcementId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));
        if (readRepository.existsByUserIdAndAnnouncementId(user.getId(), announcementId)) {
            return;
        }
        UserAnnouncementRead read = UserAnnouncementRead.builder()
                .userId(user.getId())
                .announcementId(announcementId)
                .readAt(LocalDateTime.now())
                .build();
        readRepository.save(read);
    }

    @Override
    @Transactional
    public void markAllAsRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));
        Set<Integer> readSet = readRepository.findReadAnnouncementIdsByUserId(user.getId()).stream()
                .collect(Collectors.toSet());
        List<Announcement> announcements = announcementRepository.findTop50ByOrderByCreatedAtDesc();
        List<UserAnnouncementRead> newReads = announcements.stream()
                .filter(a -> !readSet.contains(a.getId()))
                .map(a -> UserAnnouncementRead.builder()
                        .userId(user.getId())
                        .announcementId(a.getId())
                        .readAt(LocalDateTime.now())
                        .build())
                .toList();
        if (!newReads.isEmpty()) {
            readRepository.saveAll(newReads);
        }
    }

    private AnnouncementResponse toResponse(Announcement a, boolean read) {
        String authorName = userRepository.findById(a.getCreatedByUserId())
                .map(User::getUsername)
                .orElse("—");
        return AnnouncementResponse.builder()
                .id(a.getId())
                .title(a.getTitle())
                .content(a.getContent())
                .createdByUserId(a.getCreatedByUserId())
                .createdByUsername(authorName)
                .createdAt(a.getCreatedAt())
                .read(read)
                .build();
    }
}

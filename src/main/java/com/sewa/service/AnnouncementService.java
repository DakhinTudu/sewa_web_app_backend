package com.sewa.service;

import com.sewa.dto.request.AnnouncementRequest;
import com.sewa.dto.response.AnnouncementResponse;

import java.util.List;

public interface AnnouncementService {

    List<AnnouncementResponse> listForCurrentUser(String username);

    int getUnreadCount(String username);

    void create(AnnouncementRequest request, String username);

    void markAsRead(Integer announcementId, String username);

    void markAllAsRead(String username);
}

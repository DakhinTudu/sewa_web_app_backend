package com.sewa.service;

import com.sewa.dto.request.NoticeRequest;
import com.sewa.dto.response.NoticeResponse;
import java.util.List;

public interface NoticeService {
    List<NoticeResponse> getAllNotices();

    NoticeResponse saveNotice(String authorUsername, NoticeRequest noticeRequest);
}

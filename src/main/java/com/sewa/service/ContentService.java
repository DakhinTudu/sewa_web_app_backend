package com.sewa.service;

import com.sewa.dto.request.ContentRequest;
import com.sewa.dto.response.ContentResponse;
import com.sewa.entity.Content;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContentService {
    Page<ContentResponse> getAllContent(Pageable pageable);

    ContentResponse getContentById(Integer id);

    ContentResponse createContent(ContentRequest contentRequest);

    ContentResponse updateContent(Integer id, ContentRequest contentRequest);

    void deleteContent(Integer id);

    ContentResponse uploadFile(Integer id, org.springframework.web.multipart.MultipartFile file);
}

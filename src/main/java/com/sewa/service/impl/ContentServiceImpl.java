package com.sewa.service.impl;

import com.sewa.dto.request.ContentRequest;
import com.sewa.dto.response.ContentResponse;
import com.sewa.entity.Content;
import com.sewa.exception.SewaException;
import com.sewa.repository.ContentRepository;
import com.sewa.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {

    private final ContentRepository contentRepository;

    @Override
    public Page<ContentResponse> getAllContent(Pageable pageable) {
        return contentRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public ContentResponse getContentById(Integer id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new SewaException("Content not found"));
        return mapToResponse(content);
    }

    @Override
    @Transactional
    public ContentResponse createContent(ContentRequest contentRequest) {
        Content content = Content.builder()
                .contentType(contentRequest.getContentType())
                .title(contentRequest.getTitle())
                .description(contentRequest.getDescription())
                .visibility(contentRequest.getVisibility())
                .eventDate(contentRequest.getEventDate())
                .published(contentRequest.getPublished())
                .build();
        return mapToResponse(contentRepository.save(content));
    }

    @Override
    @Transactional
    public ContentResponse updateContent(Integer id, ContentRequest contentRequest) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new SewaException("Content not found"));
        content.setTitle(contentRequest.getTitle());
        content.setDescription(contentRequest.getDescription());
        content.setContentType(contentRequest.getContentType());
        content.setVisibility(contentRequest.getVisibility());
        content.setEventDate(contentRequest.getEventDate());
        content.setPublished(contentRequest.getPublished());
        return mapToResponse(contentRepository.save(content));
    }

    @Override
    @Transactional
    public void deleteContent(Integer id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new SewaException("Content not found"));
        content.setIsDeleted(true); // Soft delete
        contentRepository.save(content);
    }

    @Override
    @Transactional
    public ContentResponse uploadFile(Integer id, org.springframework.web.multipart.MultipartFile file) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new SewaException("Content not found"));
        // Simulating file upload - in real app, save to S3/Cloudinary/Local disk
        String fileName = org.springframework.util.StringUtils.cleanPath(file.getOriginalFilename());
        content.setFileUrl("/uploads/contents/" + fileName);
        return mapToResponse(contentRepository.save(content));
    }

    private ContentResponse mapToResponse(Content content) {
        return ContentResponse.builder()
                .id(content.getId())
                .contentType(content.getContentType())
                .title(content.getTitle())
                .description(content.getDescription())
                .visibility(content.getVisibility())
                .eventDate(content.getEventDate())
                .authorName(content.getAuthor() != null ? content.getAuthor().getUsername() : "System")
                .published(content.getPublished())
                .fileUrl(content.getFileUrl())
                .createdAt(content.getCreatedAt())
                .updatedAt(content.getUpdatedAt())
                .build();
    }
}

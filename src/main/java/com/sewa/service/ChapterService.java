package com.sewa.service;

import com.sewa.dto.request.ChapterRequest;
import com.sewa.dto.response.ChapterResponse;
import com.sewa.entity.Chapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChapterService {
    Page<ChapterResponse> getAllChapters(Pageable pageable);

    ChapterResponse getChapterById(Integer id);

    ChapterResponse createChapter(ChapterRequest chapterRequest);

    ChapterResponse updateChapter(Integer id, ChapterRequest chapterRequest);

    ChapterResponse activateChapter(Integer id);

    void assignMember(Integer chapterId, Integer memberId, String role);

    void updateMemberRole(Integer chapterId, Integer memberId, String role);

    void removeMember(Integer chapterId, Integer memberId);

    void deleteChapter(Integer id);
}

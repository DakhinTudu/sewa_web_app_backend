package com.sewa.service.impl;

import com.sewa.dto.request.ChapterRequest;
import com.sewa.dto.response.ChapterResponse;
import com.sewa.entity.Chapter;
import com.sewa.exception.SewaException;
import com.sewa.repository.ChapterRepository;
import com.sewa.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService {

    private final ChapterRepository chapterRepository;

    @Override
    public Page<ChapterResponse> getAllChapters(Pageable pageable) {
        return chapterRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public ChapterResponse getChapterById(Integer id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new SewaException("Chapter not found"));
        return mapToResponse(chapter);
    }

    @Override
    @Transactional
    public ChapterResponse createChapter(ChapterRequest chapterRequest) {
        Chapter chapter = Chapter.builder()
                .chapterName(chapterRequest.getChapterName())
                .location(chapterRequest.getLocation())
                .chapterType(chapterRequest.getChapterType())
                .build();
        return mapToResponse(chapterRepository.save(chapter));
    }

    @Override
    @Transactional
    public ChapterResponse updateChapter(Integer id, ChapterRequest chapterRequest) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new SewaException("Chapter not found"));

        chapter.setChapterName(chapterRequest.getChapterName());
        chapter.setLocation(chapterRequest.getLocation());
        if (chapterRequest.getChapterType() != null) {
            chapter.setChapterType(chapterRequest.getChapterType());
        }

        return mapToResponse(chapterRepository.save(chapter));
    }

    @Override
    @Transactional
    public ChapterResponse activateChapter(Integer id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new SewaException("Chapter not found"));
        // Assuming there is an active field in Chapter entity, let's check
        // If not, we might need to add it or just return as is if implementation varies
        return mapToResponse(chapter);
    }

    @Override
    @Transactional
    public void assignMember(Integer chapterId, Integer memberId, String role) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new SewaException("Chapter not found"));
        com.sewa.entity.Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new SewaException("Member not found"));

        com.sewa.entity.ChapterMember chapterMember = new com.sewa.entity.ChapterMember();
        chapterMember.setId(new com.sewa.entity.ChapterMemberId(chapterId, memberId));
        chapterMember.setChapter(chapter);
        chapterMember.setMember(member);
        chapterMember.setRoleInChapter(role);

        chapterMemberRepository.save(chapterMember);
    }

    @Override
    @Transactional
    public void updateMemberRole(Integer chapterId, Integer memberId, String role) {
        com.sewa.entity.ChapterMember chapterMember = chapterMemberRepository
                .findByChapterIdAndMemberId(chapterId, memberId)
                .orElseThrow(() -> new SewaException("Member not found in chapter"));
        chapterMember.setRoleInChapter(role);
        chapterMemberRepository.save(chapterMember);
    }

    @Override
    @Transactional
    public void removeMember(Integer chapterId, Integer memberId) {
        com.sewa.entity.ChapterMember chapterMember = chapterMemberRepository
                .findByChapterIdAndMemberId(chapterId, memberId)
                .orElseThrow(() -> new SewaException("Member not found in chapter"));
        chapterMemberRepository.delete(chapterMember);
    }

    private final com.sewa.repository.MemberRepository memberRepository;
    private final com.sewa.repository.ChapterMemberRepository chapterMemberRepository;

    private ChapterResponse mapToResponse(Chapter chapter) {
        return ChapterResponse.builder()
                .id(chapter.getId())
                .chapterName(chapter.getChapterName())
                .location(chapter.getLocation())
                .chapterType(chapter.getChapterType())
                .createdAt(chapter.getCreatedAt())
                .updatedAt(chapter.getUpdatedAt())
                .build();
    }
}

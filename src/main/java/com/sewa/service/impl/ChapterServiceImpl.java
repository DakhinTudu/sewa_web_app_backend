package com.sewa.service.impl;

import com.sewa.dto.request.ChapterRequest;
import com.sewa.dto.response.ChapterResponse;
import com.sewa.entity.Chapter;
import com.sewa.exception.SewaException;
import com.sewa.repository.ChapterRepository;
import com.sewa.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService {

    private final ChapterRepository chapterRepository;

    @Override
    public Page<ChapterResponse> getAllChapters(org.springframework.data.domain.Pageable pageable) {
        if (pageable == null) {
            throw new IllegalArgumentException("Pageable cannot be null");
        }
        return chapterRepository.findByIsDeletedFalse(pageable).map(this::mapToResponse);
    }

    @Override
    public ChapterResponse getChapterById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Chapter chapter = chapterRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new SewaException("Chapter not found"));

        ChapterResponse response = mapToResponse(chapter);

        // Add extras for single view
        response.setTotalMembers(memberRepository.countByChapterId(id));

        java.util.List<ChapterResponse.ExecutiveResponse> reps = chapterMemberRepository.findAllByChapterId(id).stream()
                .map(cm -> ChapterResponse.ExecutiveResponse.builder()
                        .memberName(cm.getMember().getFullName())
                        .membershipCode(cm.getMember().getMembershipCode())
                        .role(cm.getRoleInChapter())
                        .build())
                .collect(java.util.stream.Collectors.toList());

        response.setRepresentatives(reps);

        return response;
    }

    @Override
    @Transactional
    public ChapterResponse createChapter(ChapterRequest chapterRequest) {
        if (chapterRequest == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        Chapter chapter = Chapter.builder()
                .chapterName(chapterRequest.getChapterName())
                .location(chapterRequest.getLocation())
                .chapterType(chapterRequest.getChapterType())
                .build();
        Chapter savedChapter = java.util.Objects.requireNonNull(chapterRepository.save(chapter));
        return mapToResponse(savedChapter);
    }

    @Override
    @Transactional
    public ChapterResponse updateChapter(Integer id, ChapterRequest chapterRequest) {
        if (id == null || chapterRequest == null) {
            throw new IllegalArgumentException("ID and request cannot be null");
        }
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
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new SewaException("Chapter not found"));
        return mapToResponse(chapter);
    }

    @Override
    @Transactional
    public void assignMember(Integer chapterId, Integer memberId, String role) {
        if (chapterId == null || memberId == null) {
            throw new IllegalArgumentException("IDs cannot be null");
        }
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
        if (chapterId == null || memberId == null) {
            throw new IllegalArgumentException("IDs cannot be null");
        }
        com.sewa.entity.ChapterMember chapterMember = chapterMemberRepository
                .findByChapterIdAndMemberId(chapterId, memberId)
                .orElseThrow(() -> new SewaException("Member not found in chapter"));
        chapterMember.setRoleInChapter(role);
        chapterMemberRepository.save(chapterMember);
    }

    @Override
    @Transactional
    public void removeMember(Integer chapterId, Integer memberId) {
        if (chapterId == null || memberId == null) {
            throw new IllegalArgumentException("IDs cannot be null");
        }
        com.sewa.entity.ChapterMember chapterMember = chapterMemberRepository
                .findByChapterIdAndMemberId(chapterId, memberId)
                .orElseThrow(() -> new SewaException("Member not found in chapter"));
        if (chapterMember != null) {
            chapterMemberRepository.delete(chapterMember);
        }
    }

    @Override
    @Transactional
    public void deleteChapter(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Chapter chapter = chapterRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new SewaException("Chapter not found"));
        chapter.setIsDeleted(true);
        chapterRepository.save(chapter);
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

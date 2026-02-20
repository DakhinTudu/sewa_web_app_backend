package com.sewa.service;

import com.sewa.dto.response.MemberResponse;
import com.sewa.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MemberService {
    Page<MemberResponse> getAllMembers(Pageable pageable);

    Page<MemberResponse> getPendingMembers(Pageable pageable);

    MemberResponse getMemberById(Integer id);

    MemberResponse getMemberByUsername(String username);

    MemberResponse getMemberByCode(String code);

    MemberResponse approveMember(Integer memberId);

    MemberResponse rejectMember(Integer memberId);

    MemberResponse updateMember(Integer id, MemberResponse request);

    MemberResponse updateMemberStatus(Integer id, String status);

    void deleteMember(Integer id);

    Page<MemberResponse> getMembersByChapter(Integer chapterId, Pageable pageable);

    Page<MemberResponse> getMembersByChapterAndStatus(Integer chapterId, String status, Pageable pageable);

    Page<MemberResponse> searchMembers(Integer chapterId, String eduLevel,
            String sector, String status,
            String query, Pageable pageable);
}

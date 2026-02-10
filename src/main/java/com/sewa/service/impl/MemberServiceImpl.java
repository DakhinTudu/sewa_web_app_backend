package com.sewa.service.impl;

import com.sewa.dto.response.MemberResponse;
import com.sewa.entity.Member;
import com.sewa.entity.User;
import com.sewa.entity.enums.MembershipStatus;
import com.sewa.exception.SewaException;
import com.sewa.repository.MemberRepository;
import com.sewa.repository.UserRepository;
import com.sewa.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;

    @Override
    public Page<MemberResponse> getAllMembers(Pageable pageable) {
        return memberRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public MemberResponse getMemberById(Integer id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new SewaException("Member not found"));
        return mapToResponse(member);
    }

    @Override
    public MemberResponse getMemberByUsername(String username) {
        Member member = memberRepository.findByUserUsername(username)
                .orElseThrow(() -> new SewaException("Member not found for user: " + username));
        return mapToResponse(member);
    }

    @Override
    public MemberResponse getMemberByCode(String code) {
        Member member = memberRepository.findByMembershipCode(code)
                .orElseThrow(() -> new SewaException("Member not found with code: " + code));
        return mapToResponse(member);
    }

    @Override
    @Transactional
    public MemberResponse approveMember(Integer memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new SewaException("Member not found"));
        if (member.getMembershipCode() == null) {
            Long lastId = memberRepository.getLastMemberId();
            member.setMembershipCode(String.format("SEWAM%03d", (lastId != null ? lastId : 0) + 1));
        }
        member.setMembershipStatus(MembershipStatus.ACTIVE);
        User user = member.getUser();
        user.setActive(true);
        userRepository.save(user);
        return mapToResponse(memberRepository.save(member));
    }

    @Override
    @Transactional
    public MemberResponse rejectMember(Integer memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new SewaException("Member not found"));
        member.setMembershipStatus(MembershipStatus.REJECTED);
        return mapToResponse(memberRepository.save(member));
    }

    @Override
    @Transactional
    public MemberResponse updateMember(Integer id, MemberResponse request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new SewaException("Member not found"));

        member.setFullName(request.getFullName());
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());
        member.setDesignation(request.getDesignation());
        member.setOrganization(request.getOrganization());
        member.setCollege(request.getCollege());
        member.setUniversity(request.getUniversity());
        member.setGraduationYear(request.getGraduationYear());
        member.setGender(request.getGender());

        return mapToResponse(memberRepository.save(member));
    }

    @Override
    @Transactional
    public MemberResponse updateMemberStatus(Integer id, String status) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new SewaException("Member not found"));
        member.setMembershipStatus(MembershipStatus.valueOf(status.toUpperCase()));
        return mapToResponse(memberRepository.save(member));
    }

    @Override
    @Transactional
    public void deleteMember(Integer id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new SewaException("Member not found"));
        member.setIsDeleted(true); // Soft delete
        memberRepository.save(member);
    }

    @Override
    public Page<MemberResponse> getMembersByChapter(Integer chapterId, Pageable pageable) {
        return memberRepository.findByChapterId(chapterId, pageable).map(this::mapToResponse);
    }

    @Override
    public Page<MemberResponse> getMembersByChapterAndStatus(Integer chapterId, String status, Pageable pageable) {
        MembershipStatus s = MembershipStatus.valueOf(status.toUpperCase());
        return memberRepository.findByChapterIdAndStatus(chapterId, s, pageable).map(this::mapToResponse);
    }

    private MemberResponse mapToResponse(Member member) {
        return MemberResponse.builder()
                .id(member.getId())
                .username(member.getUser() != null ? member.getUser().getUsername() : null)
                .email(member.getUser() != null ? member.getUser().getEmail() : null)
                .membershipCode(member.getMembershipCode())
                .fullName(member.getFullName())
                .phone(member.getPhone())
                .address(member.getAddress())
                .designation(member.getDesignation())
                .membershipStatus(member.getMembershipStatus())
                .joinedDate(member.getJoinedDate())
                .organization(member.getOrganization())
                .gender(member.getGender())
                .college(member.getCollege())
                .university(member.getUniversity())
                .graduationYear(member.getGraduationYear())
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .build();
    }
}

package com.sewa.service.impl;

import com.sewa.dto.response.MemberResponse;
import com.sewa.entity.Member;
import com.sewa.entity.User;
import com.sewa.entity.enums.MembershipStatus;
import com.sewa.exception.SewaException;
import com.sewa.repository.MemberRepository;
import com.sewa.repository.UserRepository;
import com.sewa.repository.EducationalLevelRepository;
import com.sewa.repository.WorkingSectorRepository;
import com.sewa.repository.GenderRepository;
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
    private final EducationalLevelRepository educationalLevelRepository;
    private final WorkingSectorRepository workingSectorRepository;
    private final GenderRepository genderRepository;

    @Override
    public Page<MemberResponse> getAllMembers(org.springframework.data.domain.Pageable pageable) {
        if (pageable == null) {
            throw new IllegalArgumentException("Pageable cannot be null");
        }
        return memberRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public Page<MemberResponse> getPendingMembers(org.springframework.data.domain.Pageable pageable) {
        if (pageable == null) {
            throw new IllegalArgumentException("Pageable cannot be null");
        }
        return memberRepository.findByMembershipStatus(MembershipStatus.PENDING, pageable).map(this::mapToResponse);
    }

    @Override
    public MemberResponse getMemberById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new SewaException("Member not found"));
        return mapToResponse(member);
    }

    @Override
    public MemberResponse getMemberByUsername(String username) {
        if (username == null) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        // Try to find a Member record first; if the user is admin-only (no Member),
        // fall back to User info
        return memberRepository.findByUserUsername(username)
                .map(this::mapToResponse)
                .orElseGet(() -> {
                    // Admin users (superadmin, etc.) may not have a Member record — return basic
                    // User profile
                    User user = userRepository.findByUsername(username)
                            .orElseThrow(() -> new SewaException("User not found: " + username));
                    return MemberResponse.builder()
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .fullName(user.getUsername()) // use username as display name
                            .build();
                });
    }

    @Override
    public MemberResponse getMemberByCode(String code) {
        if (code == null) {
            throw new IllegalArgumentException("Code cannot be null");
        }
        Member member = memberRepository.findByMembershipCode(code)
                .orElseThrow(() -> new SewaException("Member not found with code: " + code));
        return mapToResponse(member);
    }

    @Override
    @Transactional
    public MemberResponse approveMember(Integer memberId) {
        if (memberId == null) {
            throw new IllegalArgumentException("Member ID cannot be null");
        }
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new SewaException("Member not found"));
        if (member.getMembershipCode() == null) {
            Long lastId = memberRepository.getLastMemberId();
            String code;
            long nextNum = (lastId != null ? lastId : 0) + 1;
            do {
                code = String.format("SEWAM%03d", nextNum++);
            } while (memberRepository.findByMembershipCode(code).isPresent());
            member.setMembershipCode(code);
        }
        member.setMembershipStatus(MembershipStatus.ACTIVE);
        User user = member.getUser();
        if (user != null) {
            user.setActive(true);
            userRepository.save(user);
        }
        return mapToResponse(memberRepository.save(member));
    }

    @Override
    @Transactional
    public MemberResponse rejectMember(Integer memberId) {
        if (memberId == null) {
            throw new IllegalArgumentException("Member ID cannot be null");
        }
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new SewaException("Member not found"));
        member.setMembershipStatus(MembershipStatus.REJECTED);
        return mapToResponse(memberRepository.save(member));
    }

    @Override
    @Transactional
    public MemberResponse updateMember(Integer id, MemberResponse request) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new SewaException("Member not found"));

        if (request.getFullName() != null)
            member.setFullName(request.getFullName());
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());
        member.setDesignation(request.getDesignation());
        member.setOrganization(request.getOrganization());
        member.setCollege(request.getCollege());
        member.setUniversity(request.getUniversity());
        member.setGraduationYear(request.getGraduationYear());
        if (request.getEducationalLevel() != null) {
            member.setEducationalLevel(educationalLevelRepository.findByName(request.getEducationalLevel())
                    .orElseThrow(
                            () -> new SewaException("Educational Level not found: " + request.getEducationalLevel())));
        }
        if (request.getWorkingSector() != null) {
            member.setWorkingSector(workingSectorRepository.findByName(request.getWorkingSector())
                    .orElseThrow(() -> new SewaException("Working Sector not found: " + request.getWorkingSector())));
        }
        if (request.getGender() != null) {
            member.setGender(genderRepository.findByName(request.getGender())
                    .orElseThrow(() -> new SewaException("Gender not found: " + request.getGender())));
        }

        return mapToResponse(memberRepository.save(member));
    }

    @Override
    @Transactional
    public MemberResponse updateMemberStatus(Integer id, String status) {
        if (id == null || status == null) {
            throw new IllegalArgumentException("ID and status cannot be null");
        }
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new SewaException("Member not found"));
        member.setMembershipStatus(MembershipStatus.valueOf(status.toUpperCase()));
        return mapToResponse(memberRepository.save(member));
    }

    @Override
    @Transactional
    public void deleteMember(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
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

    @Override
    public Page<MemberResponse> searchMembers(Integer chapterId, String eduLevel,
            String sector, String status,
            String query, Pageable pageable) {
        MembershipStatus s = status != null ? MembershipStatus.valueOf(status.toUpperCase()) : null;
        String statusStr = s != null ? s.name() : null;
        String formattedQuery = (query != null && !query.isEmpty()) ? query : null;
        return memberRepository.searchMembers(chapterId, eduLevel, sector, statusStr, formattedQuery, pageable)
                .map(this::mapToResponse);
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
                .gender(member.getGender() != null ? member.getGender().getName() : null)
                .college(member.getCollege())
                .university(member.getUniversity())
                .graduationYear(member.getGraduationYear())
                .chapterId(member.getChapter() != null ? member.getChapter().getId() : null)
                .chapterName(member.getChapter() != null ? member.getChapter().getChapterName() : null)
                .educationalLevel(member.getEducationalLevel() != null ? member.getEducationalLevel().getName() : null)
                .workingSector(member.getWorkingSector() != null ? member.getWorkingSector().getName() : null)
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .build();
    }
}

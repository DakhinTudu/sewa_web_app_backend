package com.sewa.repository;

import com.sewa.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
    Optional<Member> findByMembershipCode(String membershipCode);

    Optional<Member> findByUserUsername(String username);

    @Query("SELECT cm.member FROM ChapterMember cm WHERE cm.chapter.id = :chapterId")
    org.springframework.data.domain.Page<Member> findByChapterId(Integer chapterId,
            org.springframework.data.domain.Pageable pageable);

    @Query("SELECT cm.member FROM ChapterMember cm WHERE cm.chapter.id = :chapterId AND cm.member.membershipStatus = :status")
    org.springframework.data.domain.Page<Member> findByChapterIdAndStatus(Integer chapterId,
            com.sewa.entity.enums.MembershipStatus status, org.springframework.data.domain.Pageable pageable);

    org.springframework.data.domain.Page<Member> findByMembershipStatus(com.sewa.entity.enums.MembershipStatus status,
            org.springframework.data.domain.Pageable pageable);

    @Query("SELECT COALESCE(MAX(m.id), 0) FROM Member m")
    Long getLastMemberId();
}

package com.sewa.repository;

import com.sewa.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

/**
 * Member search uses prefix-only conditions (column ILIKE :query || '%') to allow index use.
 * Optional indexes for production (run manually or via migration):
 * CREATE INDEX idx_members_full_name_lower ON members (lower(full_name) varchar_pattern_ops);
 * CREATE INDEX idx_members_membership_code_lower ON members (lower(membership_code) varchar_pattern_ops);
 * CREATE INDEX idx_members_phone ON members (phone varchar_pattern_ops);
 */
@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
        Optional<Member> findByMembershipCode(String membershipCode);

        Optional<Member> findByUserUsername(String username);

        @Query("SELECT m.chapter.chapterName, COUNT(m) FROM Member m WHERE (m.isDeleted = false OR m.isDeleted IS NULL) AND m.chapter IS NOT NULL GROUP BY m.chapter.chapterName")
        List<Object[]> countMembersByChapter();

        @Query("SELECT COALESCE(m.educationalLevel.name, 'Not set'), COUNT(m) FROM Member m WHERE (m.isDeleted = false OR m.isDeleted IS NULL) GROUP BY COALESCE(m.educationalLevel.name, 'Not set')")
        List<Object[]> countMembersByEducationalLevel();

        @Query("SELECT COALESCE(m.workingSector.name, 'Not set'), COUNT(m) FROM Member m WHERE (m.isDeleted = false OR m.isDeleted IS NULL) GROUP BY COALESCE(m.workingSector.name, 'Not set')")
        List<Object[]> countMembersByWorkingSector();

        @Query("SELECT cm.member FROM ChapterMember cm WHERE cm.chapter.id = :chapterId")
        org.springframework.data.domain.Page<Member> findByChapterId(Integer chapterId,
                        org.springframework.data.domain.Pageable pageable);

        @Query("SELECT cm.member FROM ChapterMember cm WHERE cm.chapter.id = :chapterId AND cm.member.membershipStatus = :status")
        org.springframework.data.domain.Page<Member> findByChapterIdAndStatus(Integer chapterId,
                        com.sewa.entity.enums.MembershipStatus status,
                        org.springframework.data.domain.Pageable pageable);

        org.springframework.data.domain.Page<Member> findByMembershipStatus(
                        com.sewa.entity.enums.MembershipStatus status,
                        org.springframework.data.domain.Pageable pageable);

        @Query(value = "SELECT m.* FROM members m " +
                        "LEFT JOIN educational_levels el ON el.id = m.educational_level_id " +
                        "LEFT JOIN working_sectors ws ON ws.id = m.working_sector_id " +
                        "LEFT JOIN elected_representatives er ON er.member_id = m.member_id AND er.is_active = true " +
                        "WHERE (:chapterId IS NULL OR m.chapter_id = :chapterId) " +
                        "AND (:eduLevel IS NULL OR el.name = :eduLevel) " +
                        "AND (:sector IS NULL OR ws.name = :sector) " +
                        "AND (:status IS NULL OR m.membership_status = :status) " +
                        "AND (:query IS NULL OR :query = '' " +
                        "  OR m.full_name ILIKE CAST(:query AS TEXT) || '%' " +
                        "  OR m.membership_code ILIKE CAST(:query AS TEXT) || '%' " +
                        "  OR m.phone ILIKE CAST(:query AS TEXT) || '%') " +
                        "AND (m.is_deleted = FALSE OR m.is_deleted IS NULL) " +
                        "ORDER BY (CASE WHEN er.rep_id IS NOT NULL THEN 0 ELSE 1 END), m.created_at DESC",
                countQuery = "SELECT COUNT(*) FROM members m " +
                        "LEFT JOIN educational_levels el ON el.id = m.educational_level_id " +
                        "LEFT JOIN working_sectors ws ON ws.id = m.working_sector_id " +
                        "WHERE (:chapterId IS NULL OR m.chapter_id = :chapterId) " +
                        "AND (:eduLevel IS NULL OR el.name = :eduLevel) " +
                        "AND (:sector IS NULL OR ws.name = :sector) " +
                        "AND (:status IS NULL OR m.membership_status = :status) " +
                        "AND (:query IS NULL OR :query = '' " +
                        "  OR m.full_name ILIKE CAST(:query AS TEXT) || '%' " +
                        "  OR m.membership_code ILIKE CAST(:query AS TEXT) || '%' " +
                        "  OR m.phone ILIKE CAST(:query AS TEXT) || '%') " +
                        "AND (m.is_deleted = FALSE OR m.is_deleted IS NULL)",
                nativeQuery = true)
        Page<Member> searchMembersOrderByRepresentativeThenRecent(
                        @Param("chapterId") Integer chapterId,
                        @Param("eduLevel") String eduLevel,
                        @Param("sector") String sector,
                        @Param("status") String status,
                        @Param("query") String query,
                        Pageable pageable);

        @Query(value = "SELECT m.* FROM members m " +
                        "LEFT JOIN educational_levels el ON el.id = m.educational_level_id " +
                        "LEFT JOIN working_sectors ws ON ws.id = m.working_sector_id " +
                        "WHERE (:chapterId IS NULL OR m.chapter_id = :chapterId) " +
                        "AND (:eduLevel IS NULL OR el.name = :eduLevel) " +
                        "AND (:sector IS NULL OR ws.name = :sector) " +
                        "AND (:status IS NULL OR m.membership_status = :status) " +
                        "AND (:query IS NULL OR :query = '' " +
                        "  OR m.full_name ILIKE CAST(:query AS TEXT) || '%' " +
                        "  OR m.membership_code ILIKE CAST(:query AS TEXT) || '%' " +
                        "  OR m.phone ILIKE CAST(:query AS TEXT) || '%') " +
                        "AND (m.is_deleted = FALSE OR m.is_deleted IS NULL)", countQuery = "SELECT COUNT(*) FROM members m " +
                        "LEFT JOIN educational_levels el ON el.id = m.educational_level_id " +
                        "LEFT JOIN working_sectors ws ON ws.id = m.working_sector_id " +
                        "WHERE (:chapterId IS NULL OR m.chapter_id = :chapterId) " +
                        "AND (:eduLevel IS NULL OR el.name = :eduLevel) " +
                        "AND (:sector IS NULL OR ws.name = :sector) " +
                        "AND (:status IS NULL OR m.membership_status = :status) " +
                        "AND (:query IS NULL OR :query = '' " +
                        "  OR m.full_name ILIKE CAST(:query AS TEXT) || '%' " +
                        "  OR m.membership_code ILIKE CAST(:query AS TEXT) || '%' " +
                        "  OR m.phone ILIKE CAST(:query AS TEXT) || '%') " +
                        "AND (m.is_deleted = FALSE OR m.is_deleted IS NULL)", nativeQuery = true)
        Page<Member> searchMembers(
                        @Param("chapterId") Integer chapterId,
                        @Param("eduLevel") String eduLevel,
                        @Param("sector") String sector,
                        @Param("status") String status,
                        @Param("query") String query,
                        Pageable pageable);

        @Query("SELECT COALESCE(MAX(m.id), 0) FROM Member m")
        Long getLastMemberId();

        @Query("SELECT COUNT(m) FROM Member m WHERE (m.isDeleted = false OR m.isDeleted IS NULL)")
        long countActiveMembers();

        @Query("SELECT COUNT(m) FROM Member m WHERE m.chapter.id = :chapterId AND (m.isDeleted = false OR m.isDeleted IS NULL)")
        long countByChapterId(@Param("chapterId") Integer chapterId);

        @Query("SELECT m FROM Member m JOIN m.user u WHERE (m.isDeleted = false OR m.isDeleted IS NULL) " +
                "AND m.membershipStatus = com.sewa.entity.enums.MembershipStatus.ACTIVE " +
                "AND u.email IS NOT NULL AND TRIM(u.email) != ''")
        List<Member> findActiveMembersWithEmail();

        @Query("SELECT m FROM Member m JOIN m.user u WHERE (m.isDeleted = false OR m.isDeleted IS NULL) " +
                "AND m.membershipStatus = com.sewa.entity.enums.MembershipStatus.ACTIVE " +
                "AND m.chapter.id IN :chapterIds " +
                "AND u.email IS NOT NULL AND TRIM(u.email) != ''")
        List<Member> findActiveMembersWithEmailByChapterIds(@Param("chapterIds") List<Integer> chapterIds);

        @Query("SELECT m FROM Member m JOIN m.user u WHERE m.id IN :memberIds " +
                "AND (m.isDeleted = false OR m.isDeleted IS NULL) " +
                "AND u.email IS NOT NULL AND TRIM(u.email) != ''")
        List<Member> findMembersWithEmailByIds(@Param("memberIds") List<Integer> memberIds);
}

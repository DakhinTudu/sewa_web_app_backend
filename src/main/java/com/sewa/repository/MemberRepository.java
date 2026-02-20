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

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
        Optional<Member> findByMembershipCode(String membershipCode);

        Optional<Member> findByUserUsername(String username);

        @Query("SELECT m.chapter.chapterName, COUNT(m) FROM Member m WHERE (m.isDeleted = false OR m.isDeleted IS NULL) AND m.chapter IS NOT NULL GROUP BY m.chapter.chapterName")
        List<Object[]> countMembersByChapter();

        @Query("SELECT m.educationalLevel, COUNT(m) FROM Member m WHERE (m.isDeleted = false OR m.isDeleted IS NULL) GROUP BY m.educationalLevel")
        List<Object[]> countMembersByEducationalLevel();

        @Query("SELECT m.workingSector, COUNT(m) FROM Member m WHERE (m.isDeleted = false OR m.isDeleted IS NULL) GROUP BY m.workingSector")
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
                        "WHERE (:chapterId IS NULL OR m.chapter_id = :chapterId) " +
                        "AND (:eduLevel IS NULL OR el.name = :eduLevel) " +
                        "AND (:sector IS NULL OR ws.name = :sector) " +
                        "AND (:status IS NULL OR m.membership_status = :status) " +
                        "AND (:query IS NULL " +
                        "  OR m.full_name ILIKE '%' || CAST(:query AS TEXT) || '%' " +
                        "  OR m.membership_code ILIKE '%' || CAST(:query AS TEXT) || '%' " +
                        "  OR m.phone ILIKE '%' || CAST(:query AS TEXT) || '%') " +
                        "AND (m.is_deleted = FALSE OR m.is_deleted IS NULL)", countQuery = "SELECT COUNT(*) FROM members m "
                                        +
                                        "LEFT JOIN educational_levels el ON el.id = m.educational_level_id " +
                                        "LEFT JOIN working_sectors ws ON ws.id = m.working_sector_id " +
                                        "WHERE (:chapterId IS NULL OR m.chapter_id = :chapterId) " +
                                        "AND (:eduLevel IS NULL OR el.name = :eduLevel) " +
                                        "AND (:sector IS NULL OR ws.name = :sector) " +
                                        "AND (:status IS NULL OR m.membership_status = :status) " +
                                        "AND (:query IS NULL " +
                                        "  OR m.full_name ILIKE '%' || CAST(:query AS TEXT) || '%' " +
                                        "  OR m.membership_code ILIKE '%' || CAST(:query AS TEXT) || '%' " +
                                        "  OR m.phone ILIKE '%' || CAST(:query AS TEXT) || '%') " +
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
}

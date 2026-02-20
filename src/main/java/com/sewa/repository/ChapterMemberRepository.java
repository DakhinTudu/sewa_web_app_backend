package com.sewa.repository;

import com.sewa.entity.ChapterMember;
import com.sewa.entity.ChapterMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChapterMemberRepository extends JpaRepository<ChapterMember, ChapterMemberId> {
    Optional<ChapterMember> findByChapterIdAndMemberId(Integer chapterId, Integer memberId);

    java.util.List<ChapterMember> findAllByChapterId(Integer chapterId);
}

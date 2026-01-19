package com.sewa.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "chapter_members")
@Data
public class ChapterMember {

    @EmbeddedId
    private ChapterMemberId id;

    @ManyToOne
    @MapsId("chapterId")
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;

    @ManyToOne
    @MapsId("memberId")
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "role_in_chapter")
    private String roleInChapter;
}

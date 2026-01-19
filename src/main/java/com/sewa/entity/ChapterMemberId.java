package com.sewa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class ChapterMemberId implements Serializable {

    @Column(name = "chapter_id")
    private Integer chapterId;

    @Column(name = "member_id")
    private Integer memberId;
}

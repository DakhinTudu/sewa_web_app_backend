package com.sewa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterMemberId implements Serializable {

    @Column(name = "chapter_id")
    private Integer chapterId;

    @Column(name = "member_id")
    private Integer memberId;
}

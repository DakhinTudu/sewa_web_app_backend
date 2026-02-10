package com.sewa.entity;

import com.sewa.entity.enums.ChapterType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chapters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Chapter extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chapter_id")
    private Integer id;

    @Column(name = "chapter_name", nullable = false)
    private String chapterName;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "chapter_type")
    @Builder.Default
    private ChapterType chapterType = ChapterType.LOCAL;
}

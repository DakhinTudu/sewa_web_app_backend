package com.sewa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "chapter_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class ChapterActivity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "activity_date")
    private LocalDate activityDate;
}

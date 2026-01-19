package com.sewa.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "chapters")
@Data
public class Chapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chapter_id")
    private Integer id;

    @Column(name = "chapter_name", nullable = false)
    private String chapterName;

    private String chapterType;
    private String location;

    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private Member coordinator;

    private String contactEmail;
    private String contactPhone;

    @Column(name = "is_active")
    private Boolean active;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}


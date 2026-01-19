package com.sewa.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contents")
@Data
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Integer id;

    private String contentType;

    @Column(nullable = false)
    private String title;

    private String description;
    private String visibility;
    private LocalDate eventDate;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private Boolean published;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}


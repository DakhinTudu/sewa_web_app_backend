package com.sewa.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sewa_calendar")
@Data
public class SewaCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calendar_id")
    private Integer id;

    @Column(nullable = false)
    private String title;

    private String description;
    private String eventType;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    private Boolean isRecurring;
    private String recurrenceRule;
    private String visibility;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;

    @ManyToOne
    @JoinColumn(name = "related_member_id")
    private Member relatedMember;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}


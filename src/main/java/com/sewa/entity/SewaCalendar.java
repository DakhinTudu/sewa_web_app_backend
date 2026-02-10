package com.sewa.entity;

import com.sewa.entity.enums.CalendarEventType;
import com.sewa.entity.enums.Visibility;
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
    @Column(name = "event_id")
    private Integer id;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type")
    private CalendarEventType eventType; // e.g., MEETING, FESTIVAL

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;

    @Enumerated(EnumType.STRING)
    private Visibility visibility = Visibility.PUBLIC;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}

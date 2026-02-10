package com.sewa.entity;

import com.sewa.entity.enums.ContentType;
import com.sewa.entity.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Content extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type")
    private ContentType contentType;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Visibility visibility = Visibility.PUBLIC;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @Builder.Default
    private Boolean published = true;

    @Column(name = "file_url")
    private String fileUrl;
}

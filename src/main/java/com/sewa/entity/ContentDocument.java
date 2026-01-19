package com.sewa.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "content_documents")
@Data
public class ContentDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "content_id")
    private Content content;

    private String fileName;
    private String fileType;

    @Column(nullable = false)
    private String filePath;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;
}


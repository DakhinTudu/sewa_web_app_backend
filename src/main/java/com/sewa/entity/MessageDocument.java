package com.sewa.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "message_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class MessageDocument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "message_id")
    private InternalMessage message;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;
}

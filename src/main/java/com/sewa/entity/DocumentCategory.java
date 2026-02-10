package com.sewa.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer id;

    @Column(name = "category_name", unique = true)
    private String categoryName;
}

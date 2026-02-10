package com.sewa.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class PaymentDocument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "fee_id")
    private MembershipFee fee;

    @Column(name = "document_type")
    private String documentType;

    @Column(name = "file_path", nullable = false)
    private String filePath;
}

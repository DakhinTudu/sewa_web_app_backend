package com.sewa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "elected_representatives")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class ElectedRepresentative extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rep_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "role_name")
    private String roleName;

    @Column(name = "term_start")
    private LocalDate termStart;

    @Column(name = "term_end")
    private LocalDate termEnd;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean active = true;
}

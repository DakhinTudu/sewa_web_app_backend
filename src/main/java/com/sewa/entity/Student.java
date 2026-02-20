package com.sewa.entity;

import com.sewa.entity.enums.MembershipStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@org.hibernate.annotations.DynamicUpdate
public class Student extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "membership_code", unique = true)
    private String membershipCode;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;

    private String institute;
    private String course;

    @ManyToOne
    @JoinColumn(name = "educational_level_id")
    private EducationalLevelMaster educationalLevel;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MembershipStatus status = MembershipStatus.PENDING;
}

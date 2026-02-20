package com.sewa.entity;

import com.sewa.entity.enums.MembershipStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@org.hibernate.annotations.DynamicUpdate
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "membership_code", unique = true)
    private String membershipCode;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;
    private String address;
    private String designation;

    @Enumerated(EnumType.STRING)
    @Column(name = "membership_status")
    @Builder.Default
    private MembershipStatus membershipStatus = MembershipStatus.PENDING;

    private LocalDate joinedDate;

    private String organization;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;

    @ManyToOne
    @JoinColumn(name = "educational_level_id")
    private EducationalLevelMaster educationalLevel;

    @ManyToOne
    @JoinColumn(name = "working_sector_id")
    private WorkingSectorMaster workingSector;

    @ManyToOne
    @JoinColumn(name = "gender_id")
    private GenderMaster gender;
    private String college;
    private String university;

    @Column(name = "graduation_year")
    private Integer graduationYear;
}

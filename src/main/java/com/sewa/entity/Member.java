package com.sewa.entity;

import com.sewa.entity.enums.Gender;
import com.sewa.entity.enums.MembershipStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
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

    @Enumerated(EnumType.STRING)
    private Gender gender;
    private String college;
    private String university;

    @Column(name = "graduation_year")
    private Integer graduationYear;
}

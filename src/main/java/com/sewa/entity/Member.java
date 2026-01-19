package com.sewa.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Data
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "membership_id", nullable = false, unique = true)
    private String membershipId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;
    private String address;
    private String designation;

    @Column(name = "membership_status")
    private String membershipStatus;

    private LocalDate joinedDate;

    private String organization;
    private String gender;
    private String college;
    private String university;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}


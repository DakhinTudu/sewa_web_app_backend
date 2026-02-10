package com.sewa.dto.response;

import com.sewa.entity.enums.Gender;
import com.sewa.entity.enums.MembershipStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class MemberResponse {
    private Integer id;
    private String username;
    private String email;
    private String membershipCode;
    private String fullName;
    private String phone;
    private String address;
    private String designation;
    private MembershipStatus membershipStatus;
    private LocalDate joinedDate;
    private String organization;
    private Gender gender;
    private String college;
    private String university;
    private Integer graduationYear;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

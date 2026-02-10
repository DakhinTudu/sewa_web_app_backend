package com.sewa.dto.response;

import com.sewa.entity.enums.MembershipStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StudentResponse {
    private Integer id;
    private String username;
    private String email;
    private String fullName;
    private String membershipCode;
    private String institute;
    private String course;
    private String phone;
    private MembershipStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

package com.sewa.repository;

import com.sewa.entity.MembershipFee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipFeeRepository extends JpaRepository<MembershipFee, Integer> {
    List<MembershipFee> findByMemberId(Integer memberId);

    List<MembershipFee> findByMemberMembershipCode(String membershipCode);
}

package com.sewa.repository;

import com.sewa.entity.MembershipFee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipFeeRepository extends JpaRepository<MembershipFee, Integer> {
        List<MembershipFee> findByMemberId(Integer memberId);

        List<MembershipFee> findByMemberMembershipCode(String membershipCode);

        @org.springframework.data.jpa.repository.Query("SELECT f FROM MembershipFee f WHERE " +
                        "(:query IS NULL OR f.member.fullName ILIKE %:query% OR f.member.membershipCode ILIKE %:query% OR f.transactionId ILIKE %:query%) "
                        +
                        "AND (:status IS NULL OR f.paymentStatus = :status) " +
                        "AND (:year IS NULL OR f.financialYear = :year) " +
                        "AND (f.isDeleted = false OR f.isDeleted IS NULL)")
        org.springframework.data.domain.Page<MembershipFee> searchFees(
                        @org.springframework.data.repository.query.Param("query") String query,
                        @org.springframework.data.repository.query.Param("status") com.sewa.entity.enums.PaymentStatus status,
                        @org.springframework.data.repository.query.Param("year") String year,
                        org.springframework.data.domain.Pageable pageable);
}

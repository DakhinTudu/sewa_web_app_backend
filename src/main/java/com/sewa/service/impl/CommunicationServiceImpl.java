package com.sewa.service.impl;

import com.sewa.dto.request.CommunicationRecipientRequest;
import com.sewa.dto.request.SendCommunicationRequest;
import com.sewa.dto.response.CommunicationLogResponse;
import com.sewa.dto.response.CommunicationPreviewResponse;
import com.sewa.dto.response.CommunicationReceivedResponse;
import com.sewa.entity.CommunicationLog;
import com.sewa.entity.CommunicationRecipient;
import com.sewa.entity.Member;
import com.sewa.entity.User;
import com.sewa.entity.enums.PaymentStatus;
import com.sewa.exception.SewaException;
import com.sewa.repository.CommunicationLogRepository;
import com.sewa.repository.CommunicationRecipientRepository;
import com.sewa.repository.MemberRepository;
import com.sewa.repository.MembershipFeeRepository;
import com.sewa.repository.UserRepository;
import com.sewa.service.CommunicationService;
import com.sewa.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunicationServiceImpl implements CommunicationService {

    private final MemberRepository memberRepository;
    private final MembershipFeeRepository membershipFeeRepository;
    private final UserRepository userRepository;
    private final CommunicationLogRepository communicationLogRepository;
    private final CommunicationRecipientRepository communicationRecipientRepository;
    private final EmailService emailService;

    private static final int RECEIVED_LIST_SIZE = 50;

    private static final int SAMPLE_EMAILS_LIMIT = 5;

    @Override
    public CommunicationPreviewResponse preview(CommunicationRecipientRequest selection) {
        List<Member> recipients = resolveRecipients(selection);
        List<String> emails = recipients.stream()
                .map(m -> m.getUser() != null ? m.getUser().getEmail() : null)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .toList();
        List<String> sample = emails.size() > SAMPLE_EMAILS_LIMIT
                ? emails.subList(0, SAMPLE_EMAILS_LIMIT)
                : emails;
        return CommunicationPreviewResponse.builder()
                .recipientCount(emails.size())
                .sampleEmails(sample)
                .build();
    }

    @Override
    @Transactional
    public void send(SendCommunicationRequest request, String sentByUsername) {
        User sentBy = userRepository.findByUsername(sentByUsername)
                .orElseThrow(() -> new SewaException("User not found"));
        CommunicationRecipientRequest sel = request.getRecipientSelection();
        List<Member> recipients = resolveRecipients(sel);
        // Send to each member's registered email (User.email — the one they use to log in)
        Set<String> emails = recipients.stream()
                .map(m -> m.getUser() != null ? m.getUser().getEmail() : null)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        String subject = request.getSubject();
        String body = request.getBody();
        int sent = 0;
        for (String toEmail : emails) {
            try {
                emailService.sendCustomEmail(toEmail, subject, body);
                sent++;
            } catch (Exception e) {
                log.warn("Failed to send to {}: {}", toEmail, e.getMessage());
            }
        }

        String criteriaSummary = buildCriteriaSummary(sel);
        CommunicationLog logEntry = CommunicationLog.builder()
                .sentByUserId(sentBy.getId())
                .subject(subject)
                .recipientCount(sent)
                .criteriaSummary(criteriaSummary)
                .build();
        communicationLogRepository.save(logEntry);
        Set<Integer> recipientUserIds = recipients.stream()
                .map(m -> m.getUser() != null ? m.getUser().getId() : null)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        for (Integer userId : recipientUserIds) {
            CommunicationRecipient rec = CommunicationRecipient.builder()
                    .communicationLog(logEntry)
                    .userId(userId)
                    .readAt(null)
                    .build();
            communicationRecipientRepository.save(rec);
        }
        log.info("Communication sent by {} to {} recipients. {}", sentByUsername, sent, criteriaSummary);
    }

    @Override
    public List<CommunicationLogResponse> getHistory() {
        return communicationLogRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<CommunicationReceivedResponse> getCommunicationsReceivedByMe(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));
        List<CommunicationRecipient> list = communicationRecipientRepository.findByUserIdOrderByLogCreatedAtDesc(
                user.getId(), PageRequest.of(0, RECEIVED_LIST_SIZE));
        return list.stream().map(this::toReceivedResponse).toList();
    }

    @Override
    public int getCommunicationsReceivedUnreadCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));
        return (int) communicationRecipientRepository.countByUserIdAndReadAtIsNull(user.getId());
    }

    @Override
    @Transactional
    public void markCommunicationReceivedAsRead(Integer recipientId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));
        CommunicationRecipient rec = communicationRecipientRepository.findById(recipientId)
                .orElseThrow(() -> new SewaException("Notification not found"));
        if (!rec.getUserId().equals(user.getId())) {
            throw new SewaException("Not allowed");
        }
        if (rec.getReadAt() == null) {
            rec.setReadAt(LocalDateTime.now());
            communicationRecipientRepository.save(rec);
        }
    }

    @Override
    @Transactional
    public void markAllCommunicationsReceivedAsRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SewaException("User not found"));
        communicationRecipientRepository.markAllAsReadByUserId(user.getId());
    }

    private CommunicationReceivedResponse toReceivedResponse(CommunicationRecipient rec) {
        CommunicationLog log = rec.getCommunicationLog();
        return CommunicationReceivedResponse.builder()
                .id(rec.getId())
                .subject(log.getSubject())
                .sentAt(log.getCreatedAt())
                .read(rec.getReadAt() != null)
                .build();
    }

    private List<Member> resolveRecipients(CommunicationRecipientRequest sel) {
        if (sel == null || sel.getBaseType() == null || sel.getBaseType().isBlank()) {
            throw new SewaException("Recipient selection baseType is required (ALL, BY_CHAPTER, BY_PAYMENT_STATUS, MANUAL).");
        }
        String base = sel.getBaseType().toUpperCase();
        List<Member> baseList;
        switch (base) {
            case "ALL" -> baseList = memberRepository.findActiveMembersWithEmail();
            case "BY_CHAPTER" -> {
                List<Integer> chapterIds = sel.getChapterIds();
                if (chapterIds == null || chapterIds.isEmpty()) {
                    throw new SewaException("BY_CHAPTER requires at least one chapterIds.");
                }
                baseList = memberRepository.findActiveMembersWithEmailByChapterIds(chapterIds);
            }
            case "BY_PAYMENT_STATUS" -> {
                String filter = sel.getPaymentFilter();
                if (!CommunicationRecipientRequest.PAYMENT_UNPAID_CURRENT_YEAR.equals(filter)) {
                    throw new SewaException("Unsupported paymentFilter. Use UNPAID_CURRENT_YEAR.");
                }
                String currentYear = getCurrentFinancialYear();
                Set<Integer> paidMemberIds = membershipFeeRepository
                        .findDistinctMemberIdsByFinancialYearAndPaymentStatus(currentYear, PaymentStatus.PAID);
                List<Member> allWithEmail = memberRepository.findActiveMembersWithEmail();
                baseList = allWithEmail.stream()
                        .filter(m -> !paidMemberIds.contains(m.getId()))
                        .toList();
            }
            case "MANUAL" -> {
                List<Integer> ids = sel.getMemberIds();
                if (ids == null || ids.isEmpty()) {
                    throw new SewaException("MANUAL requires at least one memberIds.");
                }
                baseList = memberRepository.findMembersWithEmailByIds(ids);
            }
            default -> throw new SewaException("Invalid baseType: " + base);
        }

        Set<Integer> ids = baseList.stream().map(Member::getId).collect(Collectors.toSet());
        if (sel.getIncludeMemberIds() != null && !sel.getIncludeMemberIds().isEmpty()) {
            List<Member> extra = memberRepository.findMembersWithEmailByIds(sel.getIncludeMemberIds());
            for (Member m : extra) {
                if (!ids.contains(m.getId())) {
                    ids.add(m.getId());
                    baseList = new ArrayList<>(baseList);
                    baseList.add(m);
                }
            }
        }
        if (sel.getExcludeMemberIds() != null && !sel.getExcludeMemberIds().isEmpty()) {
            Set<Integer> exclude = new HashSet<>(sel.getExcludeMemberIds());
            baseList = baseList.stream().filter(m -> !exclude.contains(m.getId())).toList();
        }
        return baseList;
    }

    private String getCurrentFinancialYear() {
        int year = Year.now().getValue();
        int month = java.time.LocalDate.now().getMonthValue();
        if (month >= 4) {
            return year + "-" + (year + 1);
        }
        return (year - 1) + "-" + year;
    }

    private String buildCriteriaSummary(CommunicationRecipientRequest sel) {
        String base = sel.getBaseType();
        if (base == null) return "unknown";
        return switch (base.toUpperCase()) {
            case "ALL" -> "All active members with email";
            case "BY_CHAPTER" -> "Chapters: " + (sel.getChapterIds() != null ? sel.getChapterIds() : "");
            case "BY_PAYMENT_STATUS" -> "Payment filter: " + sel.getPaymentFilter();
            case "MANUAL" -> "Manual: " + (sel.getMemberIds() != null ? sel.getMemberIds().size() + " IDs" : "0");
            default -> base;
        };
    }

    private CommunicationLogResponse toResponse(CommunicationLog entity) {
        LocalDateTime sentAt = entity.getCreatedAt();
        return CommunicationLogResponse.builder()
                .id(entity.getId())
                .sentByUserId(entity.getSentByUserId())
                .subject(entity.getSubject())
                .recipientCount(entity.getRecipientCount())
                .criteriaSummary(entity.getCriteriaSummary())
                .sentAt(sentAt)
                .build();
    }
}

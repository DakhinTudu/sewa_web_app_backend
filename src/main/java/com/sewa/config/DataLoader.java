package com.sewa.config;

import com.sewa.entity.*;
import com.sewa.entity.enums.*;
import com.sewa.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final StudentRepository studentRepository;
    private final ChapterRepository chapterRepository;
    private final ChapterMemberRepository chapterMemberRepository;
    private final ElectedRepresentativeRepository electedRepresentativeRepository;
    private final ContentRepository contentRepository;
    private final NoticeRepository noticeRepository;
    private final SewaCalendarRepository sewaCalendarRepository;
    private final MembershipFeeRepository membershipFeeRepository;
    private final InternalMessageRepository internalMessageRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting comprehensive data initialization...");
        initializePermissions();
        initializeRoles();
        initializeAdmin();
        initializeChapters();
        initializeMembersAndStudents();
        initializeElectedRepresentatives();
        initializeContent();
        initializeNotices();
        initializeCalendarEvents();
        initializeMembershipFees();
        // initializeMessages(); // Disabled due to database check constraint issues
        initializeSystemSettings();
        log.info("Data initialization completed successfully!");
    }

    private void initializePermissions() {
        if (permissionRepository.count() == 0) {
            String[] commonPermissions = {
                    "USER_LOGIN", "USER_REGISTER", "USER_PROFILE_VIEW", "USER_PROFILE_UPDATE",
                    "MEMBER_CREATE", "MEMBER_VIEW", "MEMBER_UPDATE", "MEMBER_APPROVE", "MEMBER_REJECT", "MEMBER_DELETE",
                    "MEMBER_LIST",
                    "STUDENT_CREATE", "STUDENT_VIEW", "STUDENT_UPDATE", "STUDENT_APPROVE", "STUDENT_DELETE",
                    "STUDENT_LIST",
                    "CHAPTER_CREATE", "CHAPTER_VIEW", "CHAPTER_UPDATE", "CHAPTER_DELETE", "CHAPTER_ASSIGN_MEMBER",
                    "CHAPTER_VIEW_MEMBERS",
                    "FEE_VIEW", "FEE_PAY", "FEE_VERIFY", "FEE_RECEIPT_GENERATE", "FEE_REPORT",
                    "CONTENT_CREATE", "CONTENT_VIEW", "CONTENT_UPDATE", "CONTENT_DELETE", "CONTENT_PUBLISH",
                    "CONTENT_ARCHIVE",
                    "AGM_CREATE", "AGM_VIEW", "AGM_UPDATE", "AGM_DELETE", "AGM_ATTENDANCE_MARK", "AGM_REPORT",
                    "NEWS_CREATE", "NEWS_VIEW", "NEWS_UPDATE", "NEWS_DELETE",
                    "REPORT_VIEW", "REPORT_EXPORT",
                    "MESSAGE_SEND", "MESSAGE_VIEW", "MESSAGE_DELETE", "DOCUMENT_CIRCULATE",
                    "SYSTEM_SETTINGS_VIEW", "SYSTEM_SETTINGS_UPDATE", "AUDIT_LOG_VIEW",
                    "ROLE_CREATE", "ROLE_UPDATE", "ROLE_DELETE", "PERMISSION_ASSIGN", "USER_ROLE_ASSIGN"
            };

            for (String code : commonPermissions) {
                permissionRepository.save(Permission.builder().permissionCode(code).build());
            }
            log.info("Permissions initialized: {} permissions created.", commonPermissions.length);
        }
    }

    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            Map<String, List<String>> roleMappings = new HashMap<>();

            // SUPER_ADMIN mapping - has all permissions
            roleMappings.put("ROLE_SUPER_ADMIN", permissionRepository.findAll().stream()
                    .map(Permission::getPermissionCode).collect(Collectors.toList()));

            // ADMIN mapping
            roleMappings.put("ROLE_ADMIN", Arrays.asList(
                    "MEMBER_CREATE", "MEMBER_VIEW", "MEMBER_UPDATE", "MEMBER_APPROVE", "MEMBER_REJECT", "MEMBER_DELETE",
                    "MEMBER_LIST",
                    "STUDENT_CREATE", "STUDENT_VIEW", "STUDENT_UPDATE", "STUDENT_APPROVE", "STUDENT_DELETE",
                    "STUDENT_LIST",
                    "CONTENT_CREATE", "CONTENT_VIEW", "CONTENT_UPDATE", "CONTENT_DELETE", "CONTENT_PUBLISH",
                    "CONTENT_ARCHIVE",
                    "AGM_CREATE", "AGM_VIEW", "AGM_UPDATE", "AGM_DELETE", "AGM_ATTENDANCE_MARK", "AGM_REPORT",
                    "CHAPTER_CREATE", "CHAPTER_VIEW", "CHAPTER_UPDATE", "CHAPTER_DELETE", "CHAPTER_ASSIGN_MEMBER",
                    "CHAPTER_VIEW_MEMBERS",
                    "REPORT_VIEW", "REPORT_EXPORT",
                    "FEE_VIEW", "FEE_VERIFY", "FEE_REPORT",
                    "MESSAGE_SEND", "MESSAGE_VIEW", "MESSAGE_DELETE", "DOCUMENT_CIRCULATE",
                    "SYSTEM_SETTINGS_VIEW", "AUDIT_LOG_VIEW"));

            // CHAPTER_ADMIN mapping
            roleMappings.put("ROLE_CHAPTER_ADMIN", Arrays.asList(
                    "MEMBER_VIEW", "MEMBER_UPDATE", "CHAPTER_VIEW", "CHAPTER_ASSIGN_MEMBER", "CONTENT_VIEW",
                    "MESSAGE_SEND", "MESSAGE_VIEW"));

            // MEMBER mapping
            roleMappings.put("ROLE_MEMBER", Arrays.asList(
                    "USER_PROFILE_VIEW", "USER_PROFILE_UPDATE", "CONTENT_VIEW", "AGM_VIEW", "FEE_VIEW", "FEE_PAY",
                    "MESSAGE_SEND", "MESSAGE_VIEW"));

            // STUDENT mapping
            roleMappings.put("ROLE_STUDENT", Arrays.asList(
                    "USER_PROFILE_VIEW", "CONTENT_VIEW", "MESSAGE_VIEW"));

            for (Map.Entry<String, List<String>> entry : roleMappings.entrySet()) {
                Set<Permission> perms = entry.getValue().stream()
                        .map(code -> permissionRepository.findByPermissionCode(code).orElse(null))
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());

                roleRepository.save(Role.builder()
                        .roleName(entry.getKey())
                        .permissions(perms)
                        .build());
            }
            log.info("Roles initialized: 5 roles with permissions created.");
        }
    }

    private void initializeAdmin() {
        Role superAdminRole = roleRepository.findByRoleName("ROLE_SUPER_ADMIN").orElse(null);
        if (superAdminRole == null)
            return;

        User superAdmin = userRepository.findByUsername("superadmin").orElse(null);

        if (superAdmin == null) {
            superAdmin = User.builder()
                    .username("superadmin")
                    .email("admin@sewa.org")
                    .password(passwordEncoder.encode("Admin@123"))
                    .active(true)
                    .roles(new HashSet<>(Collections.singletonList(superAdminRole)))
                    .build();
            userRepository.save(superAdmin);
            log.info("Default superadmin user initialized.");
        } else {
            if (superAdmin.getRoles().isEmpty() || superAdmin.getRoles().stream().noneMatch(r -> "ROLE_SUPER_ADMIN".equals(r.getRoleName()))) {
                superAdmin.getRoles().clear();
                superAdmin.getRoles().add(superAdminRole);
                userRepository.save(superAdmin);
                log.info("Superadmin roles restored/updated.");
            }
        }
    }

    private void initializeChapters() {
        if (chapterRepository.count() > 0) {
            log.info("Chapters already exist. Skipping initialization.");
            return;
        }

        String[] chapterNames = {
                "Delhi Engineering Chapter",
                "Mumbai Engineering Chapter",
                "Bangalore Engineering Chapter",
                "Hyderabad Engineering Chapter",
                "Kolkata Engineering Chapter",
                "Chennai Engineering Chapter",
                "Pune Engineering Chapter",
                "Ahmedabad Engineering Chapter"
        };

        String[] locations = {
                "New Delhi, India",
                "Mumbai, India",
                "Bangalore, India",
                "Hyderabad, India",
                "Kolkata, India",
                "Chennai, India",
                "Pune, India",
                "Ahmedabad, India"
        };

        for (int i = 0; i < chapterNames.length; i++) {
            Chapter chapter = Chapter.builder()
                    .chapterName(chapterNames[i])
                    .location(locations[i])
                    .chapterType(ChapterType.LOCAL)
                    .build();
            chapterRepository.save(chapter);
        }
        log.info("Chapters initialized: {} chapters created.", chapterNames.length);
    }

    private void initializeMembersAndStudents() {
        if (memberRepository.count() > 0) {
            log.info("Members already exist. Skipping initialization.");
            return;
        }

        Role memberRole = roleRepository.findByRoleName("ROLE_MEMBER").orElse(null);
        Role studentRole = roleRepository.findByRoleName("ROLE_STUDENT").orElse(null);

        if (memberRole == null || studentRole == null) {
            log.warn("Member or Student role not found. Skipping member/student initialization.");
            return;
        }

        List<Chapter> chapters = chapterRepository.findAll();
        int memberCounter = 1;

        // Create 8 members per chapter
        for (Chapter chapter : chapters) {
            for (int i = 1; i <= 8; i++) {
                String memberUsername = "member" + memberCounter;
                User memberUser = User.builder()
                        .username(memberUsername)
                        .email(memberUsername + "@sewa.org")
                        .password(passwordEncoder.encode("Member@123"))
                        .active(true)
                        .roles(new HashSet<>(Collections.singletonList(memberRole)))
                        .build();
                memberUser = userRepository.save(memberUser);

                Member member = Member.builder()
                        .user(memberUser)
                        .fullName("Member " + memberCounter)
                        .phone("9" + String.format("%09d", memberCounter))
                        .designation("Engineer")
                        .organization("TechCorp " + memberCounter)
                        .address("Address " + memberCounter + ", " + chapter.getLocation())
                        .gender(memberCounter % 2 == 0 ? Gender.FEMALE : Gender.MALE)
                        .membershipStatus(MembershipStatus.ACTIVE)
                        .membershipCode("SEWAM" + String.format("%05d", memberCounter))
                        .joinedDate(LocalDate.now().minusMonths(memberCounter))
                        .build();
                member = memberRepository.save(member);

                memberCounter++;
            }
        }

        // Create 5 students
        for (int i = 1; i <= 5; i++) {
            String studentUsername = "student" + i;
            User studentUser = User.builder()
                    .username(studentUsername)
                    .email(studentUsername + "@sewa.org")
                    .password(passwordEncoder.encode("Student@123"))
                    .active(true)
                    .roles(new HashSet<>(Collections.singletonList(studentRole)))
                    .build();
            studentUser = userRepository.save(studentUser);

            Student student = Student.builder()
                    .user(studentUser)
                    .fullName("Student " + i)
                    .phone("9" + String.format("%09d", 1000 + i))
                    .institute("Engineering Institute " + i)
                    .course("B.Tech Computer Science")
                    .status(MembershipStatus.ACTIVE)
                    .membershipCode("SEWAS" + String.format("%05d", i))
                    .build();
            studentRepository.save(student);
        }

        log.info("Members and Students initialized: {} members and 5 students created.",
                memberRepository.count(), studentRepository.count());
    }

    private void initializeElectedRepresentatives() {
        if (electedRepresentativeRepository.count() > 0) {
            log.info("Elected representatives already exist. Skipping initialization.");
            return;
        }

        List<Chapter> chapters = chapterRepository.findAll();
        List<Member> members = memberRepository.findAll();

        if (members.isEmpty()) {
            log.warn("No members found. Skipping elected representatives initialization.");
            return;
        }

        String[] roles = {"President", "Secretary", "Co-Coordinator"};
        LocalDate termStart = LocalDate.now().minusYears(1);
        LocalDate termEnd = LocalDate.now().plusYears(1);

        int memberIndex = 0;
        for (Chapter chapter : chapters) {
            for (String role : roles) {
                if (memberIndex < members.size()) {
                    Member member = members.get(memberIndex);
                    ElectedRepresentative rep = ElectedRepresentative.builder()
                            .member(member)
                            .roleName(role + " - " + chapter.getChapterName())
                            .termStart(termStart)
                            .termEnd(termEnd)
                            .active(true)
                            .build();
                    electedRepresentativeRepository.save(rep);
                    memberIndex++;
                }
            }
        }

        log.info("Elected representatives initialized: {} representatives created.",
                electedRepresentativeRepository.count());
    }

    private void initializeContent() {
        if (contentRepository.count() > 0) {
            log.info("Content already exists. Skipping initialization.");
            return;
        }

        String[] titles = {
                "Engineering Excellence Awards 2024",
                "Annual Welfare Report",
                "Scholarship Program Guidelines",
                "Professional Development Workshop",
                "Member Success Stories",
                "Industry Trends and Insights",
                "Career Advancement Strategies",
                "Networking Best Practices",
                "SEWA Member Benefits",
                "Technical Certification Pathways",
                "Mentorship Program Details",
                "Community Service Projects"
        };

        String[] descriptions = {
                "Recognition of outstanding engineering professionals",
                "Comprehensive overview of our welfare initiatives",
                "Detailed guidelines for scholarship applications",
                "Enhancing professional skills through workshops",
                "Inspiring stories from our community members",
                "Latest trends shaping the engineering industry",
                "Tips for advancing your engineering career",
                "Build valuable professional connections",
                "Discover exclusive member advantages",
                "Paths to industry-recognized certifications",
                "One-on-one guidance from experienced professionals",
                "Give back to the engineering community"
        };

        for (int i = 0; i < titles.length; i++) {
            Content content = Content.builder()
                    .title(titles[i])
                    .description(descriptions[i])
                    .contentType(i % 3 == 0 ? ContentType.NEWS : (i % 3 == 1 ? ContentType.EVENT : ContentType.PUBLICATION))
                    .published(true)
                    .build();
            contentRepository.save(content);
        }
        log.info("Content initialized: {} content items created.", titles.length);
    }

    private void initializeNotices() {
        if (noticeRepository.count() > 0) {
            log.info("Notices already exist. Skipping initialization.");
            return;
        }

        String[] noticeHeadings = {
                "AGM 2024 Announced",
                "Membership Renewal Deadline",
                "Fee Payment Portal Launch",
                "New Chapter Inaugurated",
                "Award Nominations Open",
                "Volunteer Opportunities Available",
                "Workshop Schedule Released",
                "System Maintenance Notice",
                "Important Policy Update",
                "Emergency Relief Program",
                "Student Scholarship Awards",
                "Member Directory Update",
                "Election Schedule Announced",
                "New Welfare Benefits Introduced",
                "Website Upgrade Completed"
        };

        String[] noticeDetails = {
                "The Annual General Meeting will be held on March 15, 2024.",
                "Please renew your membership by January 31, 2024.",
                "New payment portal is now live for fee payments.",
                "The new Goa chapter has been officially inaugurated.",
                "Nominations are open for the Engineering Excellence Awards.",
                "Join us in our community service initiatives.",
                "Check the calendar for upcoming technical workshops.",
                "Scheduled maintenance on February 10-12, 2024.",
                "Updates to membership policies are now in effect.",
                "Relief program for affected members has been launched.",
                "Congratulations to all scholarship recipients!",
                "Update your contact information in the member portal.",
                "Elections will be held in March 2024.",
                "New health insurance and wellness benefits are available.",
                "Our website has been redesigned for better user experience."
        };

        for (int i = 0; i < noticeHeadings.length; i++) {
            Notice notice = Notice.builder()
                    .title(noticeHeadings[i])
                    .content(noticeDetails[i])
                    .active(true)
                    .expiresAt(LocalDateTime.now().plusDays(30 - i))
                    .build();
            noticeRepository.save(notice);
        }
        log.info("Notices initialized: {} notices created.", noticeHeadings.length);
    }

    private void initializeCalendarEvents() {
        if (sewaCalendarRepository.count() > 0) {
            log.info("Calendar events already exist. Skipping initialization.");
            return;
        }

        String[] eventNames = {
                "General Body Meeting",
                "Technical Workshop on AI/ML",
                "Networking Breakfast",
                "Charity Drive",
                "Member Orientation",
                "Career Fair",
                "Annual Awards Ceremony",
                "Board Meeting",
                "Professional Development Seminar",
                "Chapter Meetup",
                "Student Mentoring Session",
                "Welfare Committee Meeting"
        };

        String[] locations = {
                "Delhi Headquarters",
                "Mumbai Conference Center",
                "Virtual Meeting",
                "Community Park",
                "Chapter Office",
                "Convention Hall",
                "Grand Ballroom",
                "Board Room",
                "Tech Hub",
                "Chapter Venue",
                "Online Platform",
                "Hybrid Mode"
        };

        CalendarEventType[] eventTypes = {
                CalendarEventType.MEETING,
                CalendarEventType.MEETING,
                CalendarEventType.MEETING,
                CalendarEventType.MEETING,
                CalendarEventType.MEETING,
                CalendarEventType.MEETING,
                CalendarEventType.MEETING,
                CalendarEventType.MEETING,
                CalendarEventType.MEETING,
                CalendarEventType.MEETING,
                CalendarEventType.MEETING,
                CalendarEventType.MEETING
        };

        for (int i = 0; i < eventNames.length; i++) {
            SewaCalendar event = new SewaCalendar();
            event.setTitle(eventNames[i]);
            event.setEventDate(LocalDate.now().plusDays(7 + i * 3));
            event.setDescription("Details for " + eventNames[i]);
            event.setEventType(eventTypes[i]);
            event.setVisibility(Visibility.PUBLIC);
            event.setCreatedAt(LocalDateTime.now());
            sewaCalendarRepository.save(event);
        }
        log.info("Calendar events initialized: {} events created.", eventNames.length);
    }

    private void initializeMembershipFees() {
        if (membershipFeeRepository.count() > 0) {
            log.info("Membership fees already exist. Skipping initialization.");
            return;
        }

        List<Member> members = memberRepository.findAll();
        if (members.isEmpty()) {
            log.warn("No members found. Skipping membership fees initialization.");
            return;
        }

        BigDecimal[] feeAmounts = {
                new BigDecimal("5000.00"),
                new BigDecimal("2500.00"),
                new BigDecimal("1000.00"),
                new BigDecimal("500.00")
        };

        int feeCounter = 0;
        for (Member member : members) {
            BigDecimal amount = feeAmounts[feeCounter % feeAmounts.length];
            PaymentStatus status = feeCounter % 4 == 0 ? PaymentStatus.PAID : (feeCounter % 4 == 1 ? PaymentStatus.PENDING : PaymentStatus.FAILED);

            MembershipFee fee = MembershipFee.builder()
                    .member(member)
                    .feeType("ANNUAL")
                    .amount(amount)
                    .paymentDate(status == PaymentStatus.PAID ? LocalDate.now().minusDays(feeCounter % 30) : null)
                    .paymentStatus(status)
                    .transactionId(status == PaymentStatus.PAID ? "TXN" + String.format("%06d", feeCounter) : null)
                    .financialYear("2025-2026")
                    .build();
            membershipFeeRepository.save(fee);
            feeCounter++;
        }
        log.info("Membership fees initialized: {} fee records created.", feeCounter);
    }

    private void initializeMessages() {
        if (internalMessageRepository.count() > 0) {
            log.info("Internal messages already exist. Skipping initialization.");
            return;
        }

        List<User> users = userRepository.findAll();
        if (users.size() < 2) {
            log.warn("Insufficient users for message initialization.");
            return;
        }

        String[] messageTexts = {
                "Welcome to SEWA! Glad to have you onboard.",
                "Please complete your profile to unlock all features.",
                "New member benefits are now available.",
                "Reminder: Membership fee is due next month.",
                "Great job on completing the workshop!",
                "Your scholarship application is under review.",
                "New job opportunities matching your profile.",
                "Networking event this weekend - hope to see you there!",
                "Certificate for professional development course attached.",
                "Thank you for volunteering in our community initiative.",
                "Event reminder: Technical workshop tomorrow at 2 PM.",
                "Your feedback helps us improve our services.",
                "Important: Update your contact information here.",
                "Congratulations on your promotion!",
                "Special offer: Premium membership discount available."
        };

        int messageCounter = 0;
        for (int i = 0; i < messageTexts.length; i++) {
            User sender = users.get(i % users.size());
            User recipient = users.get((i + 1) % users.size());

            if (!sender.getId().equals(recipient.getId())) {
                InternalMessage message = InternalMessage.builder()
                        .sender(sender)
                        .subject("Message " + (i + 1))
                        .content(messageTexts[i])
                        .priority(Priority.NORMAL)
                        .visibility(Visibility.PUBLIC)
                        .build();
                internalMessageRepository.save(message);
                messageCounter++;
            }
        }
        log.info("Internal messages initialized: {} messages created.", messageCounter);
    }

    private void initializeSystemSettings() {
        if (systemSettingRepository.count() > 0) {
            log.info("System settings already exist. Skipping initialization.");
            return;
        }

        Map<String, String> settings = new LinkedHashMap<>();
        settings.put("APP_NAME", "Santal Engineers Welfare Association");
        settings.put("APP_VERSION", "1.0.0");
        settings.put("APP_TIMEZONE", "IST");
        settings.put("ANNUAL_MEMBERSHIP_FEE", "5000");
        settings.put("SCHOLARSHIP_PERCENTAGE", "10");
        settings.put("MAX_UPLOAD_SIZE_MB", "10");
        settings.put("EMAIL_NOTIFICATIONS_ENABLED", "true");
        settings.put("SMS_NOTIFICATIONS_ENABLED", "false");
        settings.put("MAINTENANCE_MODE", "false");
        settings.put("DEFAULT_LANGUAGE", "en");

        for (Map.Entry<String, String> entry : settings.entrySet()) {
            SystemSetting setting = SystemSetting.builder()
                    .key(entry.getKey())
                    .value(entry.getValue())
                    .build();
            systemSettingRepository.save(setting);
        }
        log.info("System settings initialized: {} settings created.", settings.size());
    }
}

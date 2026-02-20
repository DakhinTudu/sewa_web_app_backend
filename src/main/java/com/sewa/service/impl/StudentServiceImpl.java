package com.sewa.service.impl;

import com.sewa.dto.response.StudentResponse;
import com.sewa.entity.Student;
import com.sewa.entity.User;
import com.sewa.entity.enums.MembershipStatus;
import com.sewa.exception.SewaException;
import com.sewa.repository.StudentRepository;
import com.sewa.repository.UserRepository;
import com.sewa.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final com.sewa.repository.EducationalLevelRepository educationalLevelRepository;

    @Override
    public Page<StudentResponse> getAllStudents(org.springframework.data.domain.Pageable pageable) {
        if (pageable == null) {
            throw new IllegalArgumentException("Pageable cannot be null");
        }
        return studentRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public StudentResponse getStudentById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new SewaException("Student not found"));
        return mapToResponse(student);
    }

    @Override
    public StudentResponse getStudentByCode(String code) {
        if (code == null) {
            throw new IllegalArgumentException("Code cannot be null");
        }
        Student student = studentRepository.findByMembershipCode(code)
                .orElseThrow(() -> new SewaException("Student not found with code: " + code));
        return mapToResponse(student);
    }

    @Override
    @Transactional
    public StudentResponse approveStudent(Integer studentId) {
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new SewaException("Student not found"));
        if (student.getMembershipCode() == null) {
            Long lastId = studentRepository.getLastStudentId();
            String code;
            long nextNum = (lastId != null ? lastId : 0) + 1;
            do {
                code = String.format("SEWAS%03d", nextNum++);
            } while (studentRepository.findByMembershipCode(code).isPresent());
            student.setMembershipCode(code);
        }
        student.setStatus(MembershipStatus.ACTIVE);
        User user = student.getUser();
        if (user != null) {
            user.setActive(true);
            userRepository.save(user);
        }
        return mapToResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public StudentResponse rejectStudent(Integer studentId) {
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new SewaException("Student not found"));
        student.setStatus(MembershipStatus.REJECTED);
        return mapToResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Integer id, StudentResponse request) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new SewaException("Student not found"));
        student.setFullName(request.getFullName());
        student.setInstitute(request.getInstitute());
        student.setCourse(request.getCourse());
        student.setPhone(request.getPhone());

        if (request.getEducationalLevel() != null) {
            student.setEducationalLevel(educationalLevelRepository.findByName(request.getEducationalLevel())
                    .orElseThrow(
                            () -> new SewaException("Educational Level not found: " + request.getEducationalLevel())));
        }

        return mapToResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public StudentResponse updateStudentStatus(Integer id, String status) {
        if (id == null || status == null) {
            throw new IllegalArgumentException("ID and status cannot be null");
        }
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new SewaException("Student not found"));
        student.setStatus(MembershipStatus.valueOf(status.toUpperCase()));
        return mapToResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public void deleteStudent(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new SewaException("Student not found"));
        student.setIsDeleted(true); // Soft delete
        studentRepository.save(student);
    }

    @Override
    public Page<StudentResponse> getPendingStudents(Pageable pageable) {
        return studentRepository.findByStatus(MembershipStatus.PENDING, pageable).map(this::mapToResponse);
    }

    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .username(student.getUser() != null ? student.getUser().getUsername() : null)
                .email(student.getUser() != null ? student.getUser().getEmail() : null)
                .fullName(student.getFullName())
                .membershipCode(student.getMembershipCode())
                .institute(student.getInstitute())
                .course(student.getCourse())
                .phone(student.getPhone())
                .educationalLevel(
                        student.getEducationalLevel() != null ? student.getEducationalLevel().getName() : null)
                .status(student.getStatus())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}

package com.sewa.service;

import com.sewa.dto.response.StudentResponse;
import com.sewa.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentService {
    Page<StudentResponse> getAllStudents(Pageable pageable);

    StudentResponse getStudentById(Integer id);

    StudentResponse getStudentByCode(String code);

    StudentResponse approveStudent(Integer studentId);

    StudentResponse rejectStudent(Integer studentId);

    StudentResponse updateStudent(Integer id, StudentResponse request);

    StudentResponse updateStudentStatus(Integer id, String status);

    void deleteStudent(Integer id);

    Page<StudentResponse> getPendingStudents(Pageable pageable);
}

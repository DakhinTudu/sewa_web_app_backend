package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.dto.PageDto;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.response.StudentResponse;
import com.sewa.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Student Management", description = "APIs for student member operations")
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('STUDENT_VIEW')")
    @Operation(summary = "Get student by ID")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Integer id) {
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(student, "Student fetched"));
    }

    @GetMapping("/code/{code}")
    @PreAuthorize("hasAuthority('STUDENT_VIEW')")
    @Operation(summary = "Get student by code", description = "Fetch a student's profile by their membership code")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentByCode(@PathVariable String code) {
        StudentResponse student = studentService.getStudentByCode(code);
        return ResponseEntity.ok(ApiResponseBuilder.success(student, "Student fetched successfully"));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('STUDENT_LIST')")
    @Operation(summary = "Get all students", description = "Fetch a paginated list of all students")
    public ResponseEntity<ApiResponse<PageDto<StudentResponse>>> getAllStudents(Pageable pageable) {
        return ResponseEntity.ok(ApiResponseBuilder.success(
                PageDto.from(studentService.getAllStudents(pageable)), "Students list fetched"));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('STUDENT_LIST')")
    @Operation(summary = "Get pending students")
    public ResponseEntity<ApiResponse<PageDto<StudentResponse>>> getPendingStudents(Pageable pageable) {
        return ResponseEntity.ok(ApiResponseBuilder.success(
                PageDto.from(studentService.getPendingStudents(pageable)), "Pending students fetched"));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('STUDENT_APPROVE')")
    @Operation(summary = "Approve student", description = "Approve a pending student and generate membership code")
    public ResponseEntity<ApiResponse<StudentResponse>> approveStudent(@PathVariable Integer id) {
        StudentResponse student = studentService.approveStudent(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(student, "Student approved"));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('STUDENT_REJECT')")
    @Operation(summary = "Reject student", description = "Reject a pending student registration")
    public ResponseEntity<ApiResponse<StudentResponse>> rejectStudent(@PathVariable Integer id) {
        StudentResponse student = studentService.rejectStudent(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(student, "Student rejected"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('STUDENT_UPDATE')")
    @Operation(summary = "Update student status")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStatus(@PathVariable Integer id,
            @RequestParam String status) {
        StudentResponse student = studentService.updateStudentStatus(id, status);
        return ResponseEntity.ok(ApiResponseBuilder.success(student, "Status updated"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('STUDENT_UPDATE')")
    @Operation(summary = "Update student details")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(@PathVariable Integer id,
            @RequestBody StudentResponse request) {
        StudentResponse student = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponseBuilder.success(student, "Student updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('STUDENT_DELETE')")
    @Operation(summary = "Soft delete student")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Integer id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Student soft-deleted"));
    }
}

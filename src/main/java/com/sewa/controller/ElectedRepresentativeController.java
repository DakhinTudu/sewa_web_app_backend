package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.entity.ElectedRepresentative;
import com.sewa.repository.ElectedRepresentativeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/representatives")
@RequiredArgsConstructor
@Tag(name = "Elected Representatives", description = "APIs for managing elected association representatives")
public class ElectedRepresentativeController {

    private final ElectedRepresentativeRepository representativeRepository;

    @GetMapping("/active")
    @Operation(summary = "Get active representatives", description = "Fetch a list of currently active elected representatives")
    public ResponseEntity<ApiResponse<List<ElectedRepresentative>>> getActiveReps() {
        List<ElectedRepresentative> reps = representativeRepository.findByActiveTrue();
        return ResponseEntity.ok(ApiResponseBuilder.success(reps, "Active representatives fetched"));
    }

    @PostMapping
    @Operation(summary = "Add representative", description = "Add a new elected representative record")
    public ResponseEntity<ApiResponse<ElectedRepresentative>> addRep(@RequestBody ElectedRepresentative rep) {
        ElectedRepresentative saved = representativeRepository.save(rep);
        return ResponseEntity.ok(ApiResponseBuilder.success(saved, "Representative added"));
    }
}

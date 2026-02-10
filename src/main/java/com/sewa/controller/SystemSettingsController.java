package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.entity.SystemSetting;
import com.sewa.repository.SystemSettingRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
@Tag(name = "System Settings", description = "APIs for managing application configuration")
public class SystemSettingsController {

    private final SystemSettingRepository settingRepository;

    @GetMapping
    @Operation(summary = "Get all settings", description = "Fetch all system configuration settings")
    public ResponseEntity<ApiResponse<List<SystemSetting>>> getAllSettings() {
        return ResponseEntity.ok(ApiResponseBuilder.success(settingRepository.findAll(), "Settings fetched"));
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update setting", description = "Update a system configuration setting (Admin only)")
    public ResponseEntity<ApiResponse<SystemSetting>> updateSetting(@PathVariable String key,
            @RequestBody SystemSetting setting) {
        setting.setKey(key);
        SystemSetting saved = settingRepository.save(setting);
        return ResponseEntity.ok(ApiResponseBuilder.success(saved, "Setting updated"));
    }
}

package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.dto.response.MasterDataResponse;
import com.sewa.dto.response.MasterItem;
import com.sewa.service.MasterDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/master")
@RequiredArgsConstructor
@Tag(name = "Master Data", description = "APIs for master data operations")
public class MasterDataController {

        private final MasterDataService masterDataService;

        @GetMapping
        @Operation(summary = "Get all master data", description = "Fetch all educational levels, working sectors, and genders")
        public ResponseEntity<ApiResponse<MasterDataResponse>> getAllMasterData() {
                MasterDataResponse response = MasterDataResponse.builder()
                                .educationalLevels(masterDataService.getAllEducationalLevels().stream()
                                                .map(item -> MasterItem.builder()
                                                                .id(item.getId())
                                                                .name(item.getName())
                                                                .description(item.getDescription())
                                                                .active(item.getActive())
                                                                .build())
                                                .collect(Collectors.toList()))
                                .workingSectors(masterDataService.getAllWorkingSectors().stream()
                                                .map(item -> MasterItem.builder()
                                                                .id(item.getId())
                                                                .name(item.getName())
                                                                .description(item.getDescription())
                                                                .active(item.getActive())
                                                                .build())
                                                .collect(Collectors.toList()))
                                .genders(masterDataService.getAllGenders().stream()
                                                .map(item -> MasterItem.builder()
                                                                .id(item.getId())
                                                                .name(item.getName())
                                                                // .description(item.getDescription()) // GenderMaster
                                                                // has no description
                                                                .active(item.getActive())
                                                                .build())
                                                .collect(Collectors.toList()))
                                .build();
                return ResponseEntity.ok(ApiResponseBuilder.success(response, "Master data fetched successfully"));
        }
}

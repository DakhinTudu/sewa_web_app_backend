package com.sewa.controller;

import com.sewa.common.dto.ApiResponse;
import com.sewa.common.util.ApiResponseBuilder;
import com.sewa.entity.SewaCalendar;
import com.sewa.service.CalendarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/calendar")
@RequiredArgsConstructor
@Tag(name = "Calendar Management", description = "APIs for managing association events and schedules")
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping("/events")
    @Operation(summary = "Get all events", description = "Fetch all scheduled association events")
    public ResponseEntity<ApiResponse<List<SewaCalendar>>> getAllEvents() {
        List<SewaCalendar> events = calendarService.getAllEvents();
        return ResponseEntity.ok(ApiResponseBuilder.success(events, "Calendar events fetched"));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('AGM_CREATE')")
    @Operation(summary = "Create new event")
    public ResponseEntity<ApiResponse<SewaCalendar>> createEvent(@RequestBody SewaCalendar event) {
        return ResponseEntity.ok(ApiResponseBuilder.success(calendarService.createEvent(event), "Event created"));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('AGM_UPDATE')")
    @Operation(summary = "Update event")
    public ResponseEntity<ApiResponse<SewaCalendar>> updateEvent(@PathVariable Integer id,
            @RequestBody SewaCalendar event) {
        return ResponseEntity.ok(ApiResponseBuilder.success(calendarService.updateEvent(id, event), "Event updated"));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('AGM_DELETE')")
    @Operation(summary = "Delete event")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Integer id) {
        calendarService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(null, "Event deleted"));
    }

    @GetMapping("/chapter/{id}")
    @Operation(summary = "Get chapter events", description = "Fetch scheduled events for a specific chapter")
    public ResponseEntity<ApiResponse<List<SewaCalendar>>> getChapterEvents(@PathVariable Integer id) {
        List<SewaCalendar> events = calendarService.getChapterEvents(id);
        return ResponseEntity.ok(ApiResponseBuilder.success(events, "Chapter events fetched"));
    }
}

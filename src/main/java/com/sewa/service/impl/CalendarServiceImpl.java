package com.sewa.service.impl;

import com.sewa.entity.SewaCalendar;
import com.sewa.repository.SewaCalendarRepository;
import com.sewa.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarServiceImpl implements CalendarService {

    private final SewaCalendarRepository calendarRepository;

    @Override
    public List<SewaCalendar> getAllEvents() {
        return calendarRepository.findAll();
    }

    @Override
    public List<SewaCalendar> getChapterEvents(Integer chapterId) {
        return calendarRepository.findByChapterId(chapterId);
    }

    @Override
    public SewaCalendar getEventById(Integer id) {
        return calendarRepository.findById(id)
                .orElseThrow(() -> new com.sewa.exception.SewaException("Event not found"));
    }

    @Override
    public SewaCalendar createEvent(SewaCalendar event) {
        event.setCreatedAt(java.time.LocalDateTime.now());
        return calendarRepository.save(event);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public SewaCalendar updateEvent(Integer id, SewaCalendar event) {
        SewaCalendar existing = getEventById(id);
        existing.setTitle(event.getTitle());
        existing.setDescription(event.getDescription());
        existing.setEventDate(event.getEventDate());
        existing.setEventType(event.getEventType());
        existing.setVisibility(event.getVisibility());
        existing.setChapter(event.getChapter());
        return calendarRepository.save(existing);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteEvent(Integer id) {
        SewaCalendar existing = getEventById(id);
        calendarRepository.delete(existing);
    }
}

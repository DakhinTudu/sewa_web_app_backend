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
        return null;
    }

    @Override
    public SewaCalendar createEvent(SewaCalendar event) {
        return calendarRepository.save(event);
    }

    @Override
    public SewaCalendar updateEvent(Integer id, SewaCalendar event) {
        return null;
    }

    @Override
    public void deleteEvent(Integer id) {

    }
}

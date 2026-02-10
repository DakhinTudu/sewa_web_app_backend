package com.sewa.service;

import com.sewa.entity.SewaCalendar;
import java.util.List;

public interface CalendarService {
    List<SewaCalendar> getAllEvents();

    List<SewaCalendar> getChapterEvents(Integer chapterId);

    SewaCalendar getEventById(Integer id);

    SewaCalendar createEvent(SewaCalendar event);

    SewaCalendar updateEvent(Integer id, SewaCalendar event);

    void deleteEvent(Integer id);
}

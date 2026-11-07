'use client'

import React, { useState, useEffect, useMemo } from 'react';
import CalendarGrid from './calendar-grid';
import TimeSlots from './time-slots';
import { AvailableDay } from './types';
import { useTranslations } from 'next-intl';

interface MeetingDatepickerProps {
  availableDays: AvailableDay[];
  onChange: (datetime: string) => void;
}

const DAYS_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
};

const MeetingDatepicker = ({
  availableDays,
  onChange,
}: MeetingDatepickerProps) => {
  const t = useTranslations()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneMonthFromNow = new Date(today);
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  const availableDayNumbers = useMemo(() => {
    return new Set(availableDays.map(d => DAYS_MAP[d.day]));
  }, [availableDays]);

  const availableHours = useMemo(() => {
    if (!selectedDate) return [];

    const dayName = Object.keys(DAYS_MAP).find(
      key => DAYS_MAP[key] === selectedDate.getDay()
    );

    const dayData = availableDays.find(d => d.day === dayName);

    return dayData?.hours
      .map((h: string) => parseInt(h.replace('HOUR_', '')))
      .sort((a: number, b: number) => a - b) || [];
  }, [selectedDate, availableDays]);

  const calendarDates = useMemo(() => {
    const dates: (Date | null)[] = [];
    const current = new Date(today);

    while (current <= oneMonthFromNow) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }, []);

  const isDateSelectable = (date: Date) => {
    const dayOfWeek = date.getDay();
    return availableDayNumbers.has(dayOfWeek);
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateSelectable(date)) return;

    setSelectedDate(date);
    setSelectedHour(null);
  };

  const handleHourSelect = (hour: number) => {
    if (!selectedDate) return;

    setSelectedHour(hour);

    const datetime = new Date(selectedDate);
    datetime.setHours(hour, 0, 0, 0);
    datetime.setHours(datetime.getHours() + 3);
    onChange(datetime.toISOString());
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{t("Select a Date & Time")}</h3>

      <CalendarGrid
        dates={calendarDates}
        selectedDate={selectedDate}
        isDateSelectable={isDateSelectable}
        onDateSelect={handleDateSelect}
      />

      {selectedDate && availableHours.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            {t('Available Times for')} {selectedDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })}
          </h4>
          <TimeSlots
            hours={availableHours}
            selectedHour={selectedHour}
            onHourSelect={handleHourSelect}
          />
        </div>
      )}
    </div>
  );
};

export default MeetingDatepicker;


'use client'

import CalendarHeader from './calendar-header';
import CalendarDate from './calendar-date';

interface CalendarGridProps {
  dates: (Date | null)[];
  selectedDate: Date | null;
  isDateSelectable: (date: Date) => boolean;
  onDateSelect: (date: Date) => void;
}

const CalendarGrid = ({
  dates,
  selectedDate,
  isDateSelectable,
  onDateSelect
}: CalendarGridProps) => {
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];

  if (dates.length > 0 && dates[0]) {
    const firstDayOfWeek = dates[0].getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
  }

  dates.forEach(date => {
    currentWeek.push(date);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return (
    <div>
      <CalendarHeader />
      <div className="space-y-2">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex gap-3">
            {week.map((date, dateIdx) => (
              <CalendarDate
                key={dateIdx}
                date={date}
                isSelected={
                  selectedDate && date
                    ? selectedDate.toDateString() === date.toDateString()
                    : false
                }
                isSelectable={date ? isDateSelectable(date) : false}
                onSelect={onDateSelect}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;

'use client'

import { useTranslations } from "next-intl";

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CalendarHeader = () => {
  const t = useTranslations()

  return (
    <div className="flex gap-3 mb-3">
      {WEEKDAYS.map(day => (
        <div
          key={day}
          className="w-12 h-8 flex items-center justify-center text-sm font-semibold text-gray-600"
        >
          {t(day)}
        </div>
      ))}
    </div>
  );
};

export default CalendarHeader;
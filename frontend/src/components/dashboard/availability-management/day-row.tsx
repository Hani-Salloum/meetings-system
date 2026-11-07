'use client'

import { useTranslations } from 'next-intl';
import HourCheckbox from './hour-checkbox';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface DayRowProps {
  day: string;
  disabled: boolean;
  isHourSelected: (day: string, hour: number) => boolean;
  onHourClick: (day: string, hour: number) => void;
}

const DayRow = ({ day, disabled, isHourSelected, onHourClick }: DayRowProps) => {
  const t = useTranslations()

  return (
    <div className="flex items-center mb-2">
      <div className="w-28 font-medium text-gray-700 text-sm capitalize">
        {t(day.charAt(0).toUpperCase() + day.slice(1).toLowerCase())}
      </div>
      {HOURS.map(hour => (
        <div key={hour} className="w-[54px] flex justify-center">
          <HourCheckbox
            disabled={disabled}
            isSelected={isHourSelected(day, hour)}
            onClick={() => onHourClick(day, hour)}
          />
        </div>
      ))}
    </div>
  );
};

export default DayRow;
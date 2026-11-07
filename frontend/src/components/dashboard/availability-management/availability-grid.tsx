'use client'

import GridHeader from './grid-header';
import DayRow from './day-row';

interface AvailabilityGridProps {
  days: string[];
  disabled: boolean;
  isHourSelected: (day: string, hour: number) => boolean;
  onHourClick: (day: string, hour: number) => void;
}

const AvailabilityGrid = ({
  days,
  disabled,
  isHourSelected,
  onHourClick
}: AvailabilityGridProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <GridHeader />
        {days.map(day => (
          <DayRow
            key={day}
            day={day}
            disabled={disabled}
            isHourSelected={isHourSelected}
            onHourClick={onHourClick}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailabilityGrid;
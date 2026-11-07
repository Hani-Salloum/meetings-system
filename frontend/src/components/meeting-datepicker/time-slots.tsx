'use client'

interface TimeSlotProps {
  hour: number;
  isSelected: boolean;
  onSelect: (hour: number) => void;
}

interface TimeSlotsProps {
  hours: number[];
  selectedHour: number | null;
  onHourSelect: (hour: number) => void;
}

const TimeSlot = ({ hour, isSelected, onSelect }: TimeSlotProps) => {
  const formatHour = (h: number) => {
    return `${h.toString().padStart(2, '0')}:00`;
  };

  return (
    <button
      onClick={() => onSelect(hour)}
      className={`
        px-6 py-3 rounded-lg text-sm font-medium transition-all duration-150
        ${isSelected
          ? 'bg-blue-600 text-white border-2 border-blue-600'
          : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:shadow-md'
        }
        cursor-pointer
      `}
    >
      {formatHour(hour)}
    </button>
  );
};

const TimeSlots = ({ hours, selectedHour, onHourSelect }: TimeSlotsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {hours.map(hour => (
        <TimeSlot
          key={hour}
          hour={hour}
          isSelected={selectedHour === hour}
          onSelect={onHourSelect}
        />
      ))}
    </div>
  );
};

export default TimeSlots;



'use client'

interface CalendarDateProps {
  date: Date | null;
  isSelected: boolean;
  isSelectable: boolean;
  onSelect: (date: Date) => void;
}

const CalendarDate = ({
  date,
  isSelected,
  isSelectable,
  onSelect
}: CalendarDateProps) => {
  if (!date) {
    return <div className="w-12 h-12" />;
  }

  return (
    <button
      onClick={() => isSelectable && onSelect(date)}
      disabled={!isSelectable}
      className={`
        w-12 h-12 rounded-lg text-sm font-medium transition-all duration-150
        ${isSelected
          ? 'bg-blue-600 text-white border-2 border-blue-600'
          : isSelectable
            ? 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
            : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
        }
      `}
    >
      {date.getDate()}
    </button>
  );
};

export default CalendarDate;


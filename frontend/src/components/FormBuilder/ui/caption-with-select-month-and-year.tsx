import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { CaptionProps, useNavigation } from "react-day-picker";

export default function CaptionWithSelectMonthAndYear({
  displayMonth,
}: CaptionProps & { onChange: (newDate: any) => void }) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const locale = useLocale();
  const localeDate = locale === "ar" ? "ar-SA" : "en-US";

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return format(date, "MMMM", {
      locale: localeDate === "ar-SA" ? arSA : undefined,
    });
  });

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className="rounded-full p-2 hover:bg-gray-100"
      >
        {locale === "ar" ? (
          <ChevronRight size={20} />
        ) : (
          <ChevronLeft size={20} />
        )}
      </button>

      <select
        value={month}
        onChange={(e) => {
          const newMonth = parseInt(e.target.value);
          const newDate = new Date(displayMonth);
          newDate.setMonth(newMonth);
          goToMonth(newDate);
        }}
        className="cursor-pointer border-none bg-transparent text-center focus:outline-none"
      >
        {months.map((monthName, index) => (
          <option key={index} value={index}>
            {monthName}
          </option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => {
          const newYear = parseInt(e.target.value);
          const newDate = new Date(displayMonth);
          newDate.setFullYear(newYear);
          goToMonth(newDate);
        }}
        className="cursor-pointer border-none bg-transparent text-center focus:outline-none"
      >
        {Array.from({ length: 200 }, (_, i) => year - 100 + i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <button
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className="rounded-full p-2 hover:bg-gray-100"
      >
        {locale === "ar" ? (
          <ChevronLeft size={20} />
        ) : (
          <ChevronRight size={20} />
        )}
      </button>
    </div>
  );
}

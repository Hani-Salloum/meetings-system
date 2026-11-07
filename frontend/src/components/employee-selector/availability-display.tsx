import { useMemo } from "react";

import { AvailabilityData, SelectedEmployee } from "./types";
import { useTranslations } from "next-intl";

interface AvailabilityDisplayProps {
  availabilityData: AvailabilityData[];
  selected: SelectedEmployee[];
}

const AvailabilityDisplay = ({
  availabilityData,
  selected,
}: AvailabilityDisplayProps) => {
  const t = useTranslations()

  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const availabilityIntersection = useMemo(() => {
    if (selected.length === 0) return {};

    const intersection: Record<string, Set<number>> = {};

    daysOfWeek.forEach((day) => {
      const availableHours = new Set<number>();

      const selectedUserAvailability = selected.map((s) => {
        const userDay = availabilityData.find(
          (a) => a.user_id === s.employee_id && a.week_day === day
        );
        return userDay
          ? userDay.day_parts.map((h) => parseInt(h.replace("HOUR_", "")))
          : [];
      });

      if (selectedUserAvailability.length > 0) {
        const firstUserHours = new Set(selectedUserAvailability[0]);
        firstUserHours.forEach((hour) => {
          const allHaveThisHour = selectedUserAvailability.every((userHours) =>
            userHours.includes(hour)
          );
          if (allHaveThisHour) {
            availableHours.add(hour);
          }
        });
      }

      intersection[day] = availableHours;
    });

    return intersection;
  }, [selected, availabilityData, daysOfWeek]);

  const getDayName = (day: string) => {
    const names: Record<string, string> = {
      MONDAY: "Monday",
      TUESDAY: "Tuesday",
      WEDNESDAY: "Wednesday",
      THURSDAY: "Thursday",
      FRIDAY: "Friday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday",
    };
    return names[day] || day;
  };
  return (
    <div className="bg-white p-4">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('Group Availability')}
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-green-500"></div>
            <span className="text-gray-600">{t('Available')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-red-300"></div>
            <span className="text-gray-600">{t('Unavailable')}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {daysOfWeek.map((day) => {
          const showDay =
            Array.from(availabilityIntersection[day] || []).length > 0;
          if (showDay) {
            return (
              <div key={day} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-3 font-semibold text-gray-700">
                  {t(getDayName(day))}
                </div>

                <div className="relative">
                  <div className="mb-2 flex">
                    <div className="w-16 text-xs text-gray-500">00:00</div>
                    <div className="flex flex-1 justify-end">
                      <div className="text-xs text-gray-500">23:00</div>
                    </div>
                  </div>

                  <div className="flex h-5 gap-[1.5px] overflow-hidden rounded bg-gray-100">
                    {hours.map((hour) => {
                      const isAvailable =
                        availabilityIntersection[day]?.has(hour);
                      return (
                        <div
                          key={hour}
                          className={`flex-1 transition-colors ${
                            isAvailable ? "bg-green-500" : "bg-red-300"
                          }`}
                          title={`${hour.toString().padStart(2, "0")}:00 - ${isAvailable ? "Available" : "Unavailable"}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          } else return null;
        })}
      </div>
    </div>
  );
};
export default AvailabilityDisplay;

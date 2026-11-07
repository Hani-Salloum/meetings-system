'use client'

import { useTranslations } from "next-intl";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const GridHeader = () => {
  const t = useTranslations()

  return (
    <div className="flex items-center mb-4">
      <div className="w-28 font-semibold text-gray-700 text-sm">{t('Day')}</div>
      {HOURS.map(hour => (
        <div key={hour} className="w-[54px] text-center text-sm font-medium text-gray-600">
          {hour.toString().padStart(2, '0')}:00
        </div>
      ))}
    </div>
  );
};

export default GridHeader;
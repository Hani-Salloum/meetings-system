
'use client'

import { useSimpleData } from "@/hooks/use-fetch-simple";
import StatCard from "./stat-card";
import { useTranslations } from "next-intl";

type StatsResponse = {
  meeting_count: number;
  pending_meeting_count: number;
  programmer_count: number;
};

const SystemStats = () => {
  const t = useTranslations()

  const { data } = useSimpleData<StatsResponse>({
    url: "/admin/statistics/",
    onSuccess: (data) => {
      console.log("Stats loaded:", data);
    },
  });

  return (
    <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6 mb-8">
      <StatCard
        color="red"
        title={t('Total Meetings')}
        number={data?.meeting_count || 0}
        icon="lucide:calendar-days"
      />
      <StatCard
        color="blue"
        title={t('Pending Requests')}
        number={data?.pending_meeting_count || 0}
        icon="lucide:notebook-pen"
      />
      <StatCard
        color="green"
        title={t('Total Employees')}
        number={data?.programmer_count || 0}
        icon="lucide:users"
      />
    </div>
  )
}

export default SystemStats
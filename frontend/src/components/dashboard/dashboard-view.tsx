"use client";

import { auth } from "@/configs/api";

import AvailabilityManagement from "./availability-management";
import SystemStats from "./system-stats";
import RecentMeetings from "./recent-meetings";
import { useTranslations } from "next-intl";
import { useUserStore } from "@/store/use-user-store";
import PERMS from "@/configs/all-permissions";
import PageTitle from "../shared/page-title";

const DashboardView = () => {
  const t = useTranslations()
  const userId = Number(localStorage.getItem(auth.user_id));
  const { hasPerm }  = useUserStore()

  return (
    <div className="pt-8">
      <PageTitle title="Admin Dashboard" description="Overview of your projects, meetings, and requests" />

      { hasPerm(PERMS.STATISTICS.READ) && <SystemStats />}

      <AvailabilityManagement id={userId} disabled={false} />

      { hasPerm(PERMS.MEETING_REQUESTS.READ_ALL) && <div className="mt-8 flex max-md:flex-col gap-4">
        <RecentMeetings title={t('Recent Requests')} status="requests" link="/dashboard/meeting-requests" />
        <RecentMeetings title={t('Recent Meetings')} status="meetings" link="/dashboard/meetings" />
      </div>}
    </div>
  );
};

export default DashboardView;

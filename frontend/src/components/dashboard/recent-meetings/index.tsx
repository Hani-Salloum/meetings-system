"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { usePaginatedData } from "@/hooks/use-fetch-paginated";
import { useSimpleData } from "@/hooks/use-fetch-simple";
import { cn } from "@/lib/utils";

interface Props {
  status: "requests" | "meetings";
  link: string;
  title: string;
}

type MeetingStatus = "SCHEDULED" | "REQUESTED" | "COMPLETED" | "REJECTED";

type Meeting = {
  id: number;
  client_profile_id: number;
  meeting_request_page_pathname: string;
  status: MeetingStatus;
  guest_attendees: string[];
  description: string;
  start_at: string;
  end_at: string;
  duration: number;
  scheduled_by_user_id: number;
  participant_employees: ParticipantEmployee[];
  clientProfile: ClientProfile;
};

type ParticipantEmployee = {
  id: number;
  required: boolean;
  name: string;
};

type ClientProfile = {
  id: number;
  name: string;
  country_code: string;
  phone: string;
  email: string;
};

const statusConfig: Record<
  MeetingStatus,
  { label: string; className: string }
> = {
  SCHEDULED: {
    label: "Scheduled",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  REQUESTED: {
    label: "Requested",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

const RecentMeetings = ({ status, link, title }: Props) => {
  const t = useTranslations();
  const router = useRouter();

  const pageSize = 2;
  const page = 1;

  const filters = [
    {
      id: "status",
      operator: status === "meetings" ? "ne" : "eq",
      value: "REQUESTED",
      type: "text",
    },
  ];

  const sort = [
    {
      id: "updated_at",
      desc: true,
    },
  ];

  const { data: meetings } = useSimpleData({
    url: "/admin/meeting-requests/",
    defaultParams: {
      page,
      pagesize: pageSize,
      filters: JSON.stringify(filters),
      sort: JSON.stringify(sort),
    },
  });

  const convertDate = (date: string) =>
    new Date(date)
      .toLocaleString("en-CA", { hour12: false })
      .replace(",", " at");

  const handleClick = (id: number) => {
    router.push(
      `/en/dashboard/${status === "meetings" ? "all-meetings" : "all-meeting-requests"}?filters=[{"id":"id","value":"${id}","type":"number","operator":"eq"}]`
    );
  };

  return (
    <div className="flex-1 rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-2xl font-bold text-foreground">{title}</h2>

      <div className="space-y-6">
        {meetings &&
          (meetings as any)?.data?.data?.map((meeting: Meeting) => (
            <div
              key={meeting.id}
              onClick={() => handleClick(meeting.id)}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-muted/50 p-4"
            >
              <div className="flex-1 space-y-1">
                <h3 className="mb-3 text-lg font-medium leading-relaxed text-foreground">
                  {meeting.description}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {convertDate(meeting.start_at)}
                </p>
              </div>

              <StatusBadge status={meeting.status} />
            </div>
          ))}
      </div>

      <Link
        href={`/en/${link}`}
        className="mt-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {t("View all meetings")} →
      </Link>
    </div>
  );
};

export default RecentMeetings;

function StatusBadge({ status }: { status: MeetingStatus }) {
  const t = useTranslations();
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1 text-sm font-medium",
        config.className
      )}
    >
      {t(config.label)}
    </span>
  );
}

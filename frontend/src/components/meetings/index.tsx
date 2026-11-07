"use client";

import { useRouter } from "next/navigation";
import { memo, useMemo } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { ColumnDef, Row, createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApproveRejectDialog } from "@/components/shared/approve-reject-dialog";
import PageTitle from "@/components/shared/page-title";
import { ActionButtonsType } from "@/components/table/types/table";
import TanstackTable from "@/components/tanstack-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PERMS from "@/configs/all-permissions";
import { Client } from "@/configs/api";
import { usePaginatedData } from "@/hooks/use-fetch-paginated";
import { useSimpleData } from "@/hooks/use-fetch-simple";
import { useUserStore } from "@/store/use-user-store";

import CreateMeeting from "./create-meeting";

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

interface Employee {
  id: number;
  required: boolean;
  name: string;
}

interface Meeting {
  id: number;
  client_profile_id: number;
  meeting_request_page_pathname: string;
  status: string;
  guest_attendees: string[];
  description: string;
  start_at: string;
  end_at: string;
  duration: number;
  scheduled_by_user_id: number;
  participant_employees: Employee[];
  clientProfile: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

interface Props {
  type?: "all" | "own";
}

const filters = [
  {
    id: "status",
    operator: "ne",
    value: "REQUESTED",
    type: "text",
  },
  {
    id: "status",
    operator: "ne",
    value: "REJECTED",
    type: "text",
  },
];

const MeetingsView = ({ type = "own" }: Props) => {
  const t = useTranslations();
  const { hasPerm } = useUserStore();
  const router = useRouter();

  if (!hasPerm(PERMS.MEETING_REQUESTS.READ_ALL) && type === "all") {
    router.replace("/en/not-authorized");

    return null;
  }

  const { data: availabilityData, isLoading: availabilityLoading } =
    useSimpleData({
      url: "/admin/availability/",
      defaultParams: { page: 1, pagesize: 5000 },
    });

  const { data: users, isLoading: usersLoading } = useSimpleData({
    url: "/admin/users/",
    defaultParams: { page: 1, pagesize: 1000 },
  });

  const { tableData, getData, loading, queryKey } = usePaginatedData<Meeting>({
    url:
      type === "all"
        ? "/admin/meeting-requests/"
        : "/admin/meeting-requests/own",
    tableId: "meetings-table",
    defaultParams: {
      filters: JSON.stringify(filters),
      pagesize: 10,
    },
    responseKeys: {
      totalPagesKey: "meta.totalPages",
      pageKey: "meta.page",
      totalKey: "meta.total",
      dataKey: "data.data",
    },
  });

  const columnHelper = createColumnHelper<Meeting>();

  const columns = useMemo<ColumnDef<Meeting, any>[]>(
    () => [
      columnHelper.display({
        id: "actions",
        cell: (props) => (
          <RowActions
            row={props.row}
            queryKey={queryKey as string[]}
            getData={getData}
          />
        ),
        headerName: t("Actions"),
      }),
      columnHelper.accessor("description", {
        headerName: t("Description"),
        size: 400,
      }),
      columnHelper.accessor("start_at", {
        headerName: t("Date"),
        cell: (info) => (
          <span className="mx-auto">
            {new Date(info.getValue()).toISOString().split("T")[0]}
          </span>
        ),
        type: "text",
      }),
      columnHelper.accessor("start_at", {
        headerName: t("Time"),
        cell: (info) => (
          <span className="mx-auto">
            {new Date(info.getValue()).toISOString().substring(11, 16)}
          </span>
        ),
        type: "text",
      }),
      columnHelper.accessor("duration", {
        headerName: t("Duration (in minutes)"),
      }),
      columnHelper.accessor("participant_employees", {
        headerName: t("Participants"),
        cell: (info) => {
          const employees = info.getValue();
          if (!employees || employees.length === 0) return <span>-</span>;

          return (
            <div className="flex flex-col gap-1">
              {employees.map((e: Employee) => (
                <Badge>
                  {e.name} {e.required && "*"}
                </Badge>
              ))}
            </div>
          );
        },
        type: "text",
      }),
      columnHelper.accessor("guest_attendees", {
        headerName: t("Guest"),
        cell: (info) => {
          const guests = info.getValue();
          if (!guests || guests.length === 0) return <span>-</span>;

          return (
            <div className="flex flex-col gap-1">
              {guests.map((g: string) => (
                <Badge variant={"secondary"}>{g}</Badge>
              ))}
            </div>
          );
        },
        type: "text",
      }),
      columnHelper.accessor("scheduled_by_user_id", {
        headerName: t("Approved By (Created By)"),
        cell: (info) => {
          if (
            usersLoading ||
            !(users as any)?.data ||
            (users as any)?.data.length === 0
          ) {
            return <span className="mx-auto">Loading...</span>;
          }
          const user = (users as any)?.data.find(
            (s: User) => Number(s.id) === Number(info.getValue())
          );
          if (!user) {
            return (
              <span className="mx-auto">
                Unknown User (ID: {info.getValue()})
              </span>
            );
          }
          return (
            <span className="mx-auto">
              {user.first_name} {user.last_name}
            </span>
          );
        },
        type: "number",
      }),
      columnHelper.accessor("clientProfile", {
        headerName: t("Requested By"),
        cell: (info) => (
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-[14px] font-semibold">{info.getValue().name}</p>
            <p className="text-[12px] font-light">{info.getValue().email}</p>
          </div>
        ),
        type: "number",
      }),
      columnHelper.accessor("status", {
        headerName: t("Status"),
        cell: (info) => (
          <Badge
            variant={
              info.getValue() === "SCHEDULED"
                ? "green"
                : info.getValue() === "REJECTED"
                  ? "destructive"
                  : "default"
            }
            color="primary"
          >
            {info.getValue()}
          </Badge>
        ),
        type: "text",
      }),

      columnHelper.accessor("created_at", {
        headerName: t("Created At"),
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        enableResizing: true,
        type: "date",
      }),
      columnHelper.accessor("updated_at", {
        headerName: t("Updated At"),
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        type: "date",
      }),
    ],
    [t, users, usersLoading, queryKey]
  );

  const actionButtons: ActionButtonsType[] = useMemo(
    () => [
      hasPerm(PERMS.MEETING_REQUESTS.READ_ALL)
        ? {
            title: "Add Meeting",
            type: "component",
            component: (
              <CreateMeeting
                users={(users as any)?.data || []}
                availabilityData={(availabilityData as any)?.data?.data}
                queryKey={queryKey as string[]}
                refetch={getData}
              />
            ),
          }
        : {
            title: t("Go to dashboard"),
            type: "link",
            href: "/dashboard",
          },
    ],
    [t, queryKey, getData]
  );

  const isAnyDependentLoading = usersLoading;

  return (
    <div className="mt-8">
      <PageTitle
        title={type == "all" ? "Meetings Management" : "Your Meetings"}
        description="Schedule and manage your meetings"
      />
      <TanstackTable
        key={isAnyDependentLoading ? "1" : "2"}
        id="meetings-table"
        data={tableData?.data || []}
        columns={columns}
        isLoading={loading}
        pageCount={tableData?.total_pages || 0}
        refetch={getData}
        queryKey={queryKey as string[]}
        enableCheckBox
        defaultFilterMode="all"
        ActionButtons={actionButtons}
      />
    </div>
  );
};

export default MeetingsView;

const RowActions = memo(
  ({
    row,
    queryKey,
    getData,
  }: {
    row: Row<Meeting>;
    queryKey: string[];
    getData: () => void;
  }) => {
    const meeting = row.original;
    const t = useTranslations();
    const { hasPerm } = useUserStore();

    const handleComplete = async () => {
      await Client.admin().put(
        `/admin/meeting-requests/${meeting.id}/complete`
      );
    };

    return (
      <div className="flex items-center justify-center gap-2 p-0">
        {hasPerm(PERMS.MEETING_REQUESTS.COMPLETE) &&
          meeting.status !== "COMPLETED" && (
            <ApproveRejectDialog
              submit={handleComplete}
              icon="bx:check-double"
              textColor="text-green-500"
              message={t("Complete This Meeting")}
              onSuccess={() => {
                getData();
                toast.success(t("Meeting completed successfully"));
              }}
            >
              <Button
                variant="default"
                size="icon"
                title="Complete"
                className="!text-green-500"
              >
                <Icon
                  color="pretty"
                  icon="bx:check-double"
                  className="!size-6 !text-green-500"
                  width={25}
                />
              </Button>
            </ApproveRejectDialog>
          )}
      </div>
    );
  }
);

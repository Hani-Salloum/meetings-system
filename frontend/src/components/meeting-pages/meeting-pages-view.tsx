"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useMemo } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { ColumnDef, Row, createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApproveRejectDialog } from "@/components/shared/approve-reject-dialog";
import { ActionButtonsType } from "@/components/table/types/table";
import TanstackTable from "@/components/tanstack-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PERMS from "@/configs/all-permissions";
import { Client, ImageBaseUrl } from "@/configs/api";
import { usePaginatedData } from "@/hooks/use-fetch-paginated";
import { useSimpleData } from "@/hooks/use-fetch-simple";
import { useUserStore } from "@/store/use-user-store";

import { AvailabilityData, User } from "../employee-selector/types";
import PageTitle from "../shared/page-title";
import AddUpdateMeetingPage from "./add-update-page";

interface Employee {
  employee_id: number;
  required: boolean;
}

interface Group {
  id: number;
  meeting_request_page_id: number;
  meetingMeetingParticipantGroupEmployees: Array<Employee>;
}

interface Service {
  id: number;
  en_name: string;
  ar_name: string;
}

interface MeetingPage {
  id: number;
  service_id: number;
  title: string;
  pathname: string;
  description: string;
  image: string;
  status: string;
  duration: number;
  maximum_attendees: number;
  meetingParticipantGroups: Array<Group>;
  created_at: string;
  updated_at: string;
}

const MeetingPagesView = () => {
  const t = useTranslations();
  const { hasPerm } = useUserStore();
  const router = useRouter();

  if (!hasPerm(PERMS.PROJECT_MEETING.READ_ALL)) {
    router.replace("/en/not-authorized");

    return null;
  }

  const { data: availabilityData, isLoading: availabilityLoading } =
    useSimpleData({
      url: "/admin/availability/",
      defaultParams: { page: 1, pagesize: 5000 },
    });

  const { data: services, isLoading: servicesLoading } = useSimpleData({
    url: "/admin/services/",
    defaultParams: { page: 1, pagesize: 1000 },
  });

  const { data: users, isLoading: usersLoading } = useSimpleData({
    url: "/admin/users/",
    defaultParams: { page: 1, pagesize: 1000 },
  });

  const { tableData, getData, loading, queryKey } =
    usePaginatedData<MeetingPage>({
      url: "/admin/project-meetings/",
      tableId: "meeting-pages-table",
      responseKeys: {
        totalPagesKey: "meta.totalPages",
        pageKey: "meta.page",
        totalKey: "meta.total",
        dataKey: "data.data.meeting_pages",
      },
    });

  const handleCopy = (pathname: string) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/en/register/${pathname}`;
    navigator.clipboard.writeText(fullUrl);
  };

  const columnHelper = createColumnHelper<MeetingPage>();

  const columns = useMemo<ColumnDef<MeetingPage, any>[]>(
    () => [
      columnHelper.display({
        id: "actions",
        cell: (props) => (
          <RowActions
            row={props.row}
            queryKey={queryKey as string[]}
            getData={getData}
            users={(users as any)?.data || []}
            services={(services as any)?.data || []}
            availabilityData={(availabilityData as any)?.data?.data || []}
          />
        ),
        headerName: t("Actions"),
      }),
      columnHelper.accessor("service_id", {
        headerName: t("Service Name"),
        cell: (info) => {
          if (
            servicesLoading ||
            !(services as any)?.data ||
            (services as any)?.data.length === 0
          ) {
            return <span className="mx-auto">Loading...</span>;
          }
          const service = (services as any)?.data.find(
            (s: Service) => Number(s.id) === Number(info.getValue())
          );
          if (!service) {
            return (
              <span className="mx-auto">
                Unknown Service (ID: {info.getValue()})
              </span>
            );
          }
          return <span className="mx-auto">{service.en_name}</span>;
        },
        type: "number",
      }),
      columnHelper.accessor("title", {
        headerName: t("Title"),
      }),
      columnHelper.accessor("description", {
        headerName: t("Description"),
        size: 400,
      }),
      columnHelper.accessor("pathname", {
        headerName: t("Link"),
        cell: (info) => (
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/en/register/${info.getValue() || ""}`}
              target="_blank"
            >
              <Button variant="ghost" size="icon" title="Open In a New Tab">
                <Icon icon="mdi:link" className="text-pretty" width={18} />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              title="Copy"
              onClick={() => handleCopy(info.getValue())}
            >
              <Icon icon="mdi:clipboard" className="text-pretty" width={18} />
            </Button>
          </div>
        ),
        type: "text",
      }),
      columnHelper.accessor("image", {
        headerName: t("Image"),
        cell: (info) => (
          <Image
            src={`${ImageBaseUrl}${info.getValue()}` || ""}
            alt="meeting page image"
            width={80}
            height={80}
            className="mx-auto rounded-xl"
          />
        ),
        type: "text",
      }),
      columnHelper.accessor("status", {
        headerName: t("Status"),
        cell: (info) => (
          <Badge
            variant={info.getValue() === "ACTIVE" ? "green" : "destructive"}
            color="primary"
          >
            {info.getValue()}
          </Badge>
        ),
        type: "text",
      }),
      columnHelper.accessor("duration", {
        headerName: t("Duration (in minutes)"),
      }),

      columnHelper.accessor("maximum_attendees", {
        headerName: t("Maximum Attendees"),
      }),
      columnHelper.accessor("meetingParticipantGroups", {
        headerName: t("Participants"),
        cell: (info) => {
          if (
            usersLoading ||
            !(users as any)?.data ||
            (users as any)?.data.length === 0
          ) {
            return <span className="mx-auto">Loading...</span>;
          }
          const groups = info.getValue();
          if (!groups || groups.length === 0) return <span>-</span>;

          return (
            <div className="flex flex-col gap-1">
              {groups.map((group: Group, idx: number) => (
                <div key={group.id} className="text-sm">
                  <span className="font-semibold">Group {idx + 1}: </span>
                  {group.meetingMeetingParticipantGroupEmployees.map(
                    (emp, empIdx) => {
                      const user = (users as any)?.data.find(
                        (u: User) => Number(u.id) === Number(emp.employee_id)
                      );
                      return (
                        <span key={emp.employee_id}>
                          {empIdx > 0 && ", "}
                          {user
                            ? `${user.first_name} ${user.last_name}`
                            : `Unknown User (ID: ${emp.employee_id})`}
                          {emp.required && " *"}
                        </span>
                      );
                    }
                  )}
                </div>
              ))}
            </div>
          );
        },
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
    [t, users, usersLoading, services, servicesLoading]
  );

  const actionButtons: ActionButtonsType[] = useMemo(
    () => [
      hasPerm(PERMS.PROJECT_MEETING.CREATE)
        ? {
            title: "Add Meeting Page",
            type: "component",
            component: (
              <AddUpdateMeetingPage
                queryKey={queryKey as string[]}
                refetch={getData}
                users={(users as any)?.data || []}
                availabilityData={(availabilityData as any)?.data?.data || []}
              />
            ),
          }
        : {
            title: t("Go to dashboard"),
            type: "link",
            href: "/dashboard",
          },
    ],
    [t, queryKey, getData, availabilityLoading, usersLoading]
  );

  const isAnyDependentLoading = servicesLoading || usersLoading;

  return (
    <div className="mt-8">
      <PageTitle
        title="Meeting Pages Management"
        description="Manage your pages, employees, and meeting settings"
      />
      <TanstackTable
        key={isAnyDependentLoading ? "1" : "2"}
        id="meeting-pages-table"
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

export default MeetingPagesView;

const RowActions = memo(
  ({
    row,
    queryKey,
    getData,
    users,
    availabilityData,
    services,
  }: {
    row: Row<MeetingPage>;
    queryKey: string[];
    getData: () => void;
    users: User[];
    availabilityData: AvailabilityData[];
    services: Service[];
  }) => {
    const t = useTranslations();
    const { hasPerm } = useUserStore();

    const page = row.original;
    const selectedService = services.find((s) => s.id == page.service_id);

    const handleDelete = async () => {
      await Client.admin().delete(`/admin/project-meetings/${page.id}`);
    };

    return (
      <div className="flex items-center justify-center gap-2 p-0">
        {hasPerm(PERMS.PROJECT_MEETING.UPDATE) && (
          <AddUpdateMeetingPage
            record={{
              ...page,
              service_id: {
                value: selectedService?.id || 0,
                label: selectedService?.en_name || "",
              },
            }}
            users={users}
            availabilityData={availabilityData}
            queryKey={queryKey}
            isUpdate={true}
            refetch={getData}
          />
        )}
        {hasPerm(PERMS.PROJECT_MEETING.DELETE) && (
          <ApproveRejectDialog
            submit={handleDelete}
            icon="fluent:delete-16-regular"
            message={t("Delete This Meeting Page")}
            onSuccess={() => {
              getData();
              toast.success(t("Meeting Page deleted successfully"));
            }}
          >
            <Button variant="ghost" size="icon" title="Delete">
              <Icon icon="mdi:delete" className="text-destructive" width={18} />
            </Button>
          </ApproveRejectDialog>
        )}
      </div>
    );
  }
);

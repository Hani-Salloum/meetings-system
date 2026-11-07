"use client";

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
import { Client } from "@/configs/api";
import { usePaginatedData } from "@/hooks/use-fetch-paginated";

import AddUpdateUser from "./components/add-update-user";

interface User {
  id: number;
  name: string;
  email: string;
  confirmed_email: boolean;
  email_confirmation_code: string | null;
  active: boolean;
  available: boolean;
  language: string;
  created_at: string;
  updated_at: string;
}

const VisitorsDashboardPage = () => {
  const t = useTranslations();

  const { tableData, getData, loading, queryKey } = usePaginatedData<User>({
    url: "admin/users/",
    tableId: "users-table",
    responseKeys: {
      totalPagesKey: "meta.totalPages",
      pageKey: "meta.page",
      totalKey: "meta.total",
      dataKey: "data",
    },
  });

  const columnHelper = createColumnHelper<User>();

  const options = useMemo(
    () => [
      {
        label: t("English"),
        value: "EN",
        keywords: [
          "EN",
          "English",
          t("English"),
          "en",
          "eng",
          "english language",
          t("English Language"),
          "انجليزي",
          "انجليزية",
        ],
      },
      {
        label: t("Arabic"),
        value: "AR",
        keywords: [
          "AR",
          "Arabic",
          t("Arabic"),
          "ar",
          "arabic",
          "عربي",
          "عربية",
          "arabic language",
          t("Arabic Language"),
        ],
      },
    ],
    []
  );

  const columns = useMemo<ColumnDef<User, any>[]>(
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
      columnHelper.accessor("id", {
        headerName: t("ID"),
        type: "number",
      }),
      columnHelper.accessor("name", {
        headerName: t("Name"),
      }),
      columnHelper.accessor("email", {
        headerName: t("Email"),
        cell: (info) => info.getValue(),
        size: 200,
        enableColumnFilter: true,
      }),
      columnHelper.accessor("confirmed_email", {
        headerName: t("Email Confirmed"),
        cell: (info) => (
          <Badge>{info.getValue() ? t("Confirmed") : t("Not Confirmed")}</Badge>
        ),
        type: "boolean",
      }),
      columnHelper.accessor("active", {
        headerName: t("Active"),
        cell: (info) => (
          <Badge>{info.getValue() ? t("Active") : t("Inactive")}</Badge>
        ),
        type: "boolean",
      }),
      columnHelper.accessor("available", {
        headerName: t("Available"),
        cell: (info) => (
          <Badge>{info.getValue() ? t("Available") : t("Unavailable")}</Badge>
        ),
        type: "boolean",
      }),
      columnHelper.accessor("language", {
        headerName: t("Language"),
        cell: (info) => info.getValue(),
        type: "select",
        options,
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
    [t]
  );

  const actionButtons: ActionButtonsType[] = useMemo(
    () => [
      {
        title: "Add User",
        type: "component",
        component: (
          <AddUpdateUser queryKey={queryKey as string[]} refetch={getData} />
        ),
      },
      {
        title: t("Go to dashboard"),
        type: "link",
        href: "/dashboard",
      },
      {
        title: t("Click me"),
        type: "button",
        onClick: () => console.log("Clicked me"),
      },
    ],
    []
  );

  return (
    <div className="mt-8">
      <TanstackTable
        id="users-table"
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

export default VisitorsDashboardPage;

const RowActions = memo(
  ({
    row,
    queryKey,
    getData,
  }: {
    row: Row<User>;
    queryKey: string[];
    getData: () => void;
  }) => {
    const user = row.original;
    const t = useTranslations();

    const handleDelete = async () => {
      await Client.admin().delete(`/api/users?id=${user.id}`);
    };

    return (
      <div className="flex items-center justify-center gap-2 p-0">
        <AddUpdateUser
          record={user}
          queryKey={queryKey}
          isUpdate={true}
          refetch={getData}
        />
        <ApproveRejectDialog
          submit={handleDelete}
          icon="fluent:delete-16-regular"
          message={t("Delete This User")}
          onSuccess={() => {
            getData();
            toast.success(t("User deleted successfully"));
          }}
        >
          <Button variant="ghost" size="icon" title="Delete">
            <Icon icon="mdi:delete" className="text-destructive" width={18} />
          </Button>
        </ApproveRejectDialog>
      </div>
    );
  }
);

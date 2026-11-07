"use client";

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
import { Client } from "@/configs/api";
import { usePaginatedData } from "@/hooks/use-fetch-paginated";
import { useUserStore } from "@/store/use-user-store";

import AddUpdateUser from "./add-update-user";

interface User {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  user_types: {
    id: number;
    name: string;
  }[];
}

const UserManagementView = () => {
  const t = useTranslations();
  const { hasPerm } = useUserStore();
  const router = useRouter();

  if (!hasPerm(PERMS.USER.READ_ALL)) {
    router.replace("/en/not-authorized");

    return null;
  }

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
      columnHelper.accessor("first_name", {
        headerName: t("First Name"),
      }),
      columnHelper.accessor("last_name", {
        headerName: t("Last Name"),
      }),
      columnHelper.accessor("email", {
        headerName: t("Email"),
        cell: (info) => info.getValue(),
        size: 200,
        enableColumnFilter: true,
      }),
      columnHelper.accessor("user_types", {
        headerName: t("Type"),
        cell: (info) => info.getValue()?.[0]?.name || "Unknown",
      }),
      columnHelper.accessor("id", {
        headerName: t("Availability"),
        cell: (info) => (
          <Link
            target="_blank"
            href={`/en/dashboard/user-management/availability/${info.getValue()}`}
            className="text-blue-600"
          >
            {t("Show Availabilty")}
          </Link>
        ),
        enableColumnFilter: false,
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
      hasPerm(PERMS.USER.CREATE)
        ? {
            title: "Add User",
            type: "component",
            component: (
              <AddUpdateUser
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

export default UserManagementView;

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
    const t = useTranslations();
    const { hasPerm } = useUserStore();

    const user = row.original;

    const handleDelete = async () => {
      await Client.admin().delete(`/admin/users/${user.id}`);
    };

    return (
      <div className="flex items-center justify-center gap-2 p-0">
        {hasPerm(PERMS.USER.UPDATE) && (
          <AddUpdateUser
            record={{
              ...user,
              user_types: {
                value: user.user_types?.[0]?.id.toString() || "0",
                label: user.user_types?.[0]?.name || "",
              },
            }}
            queryKey={queryKey}
            isUpdate={true}
            refetch={getData}
          />
        )}
        {hasPerm(PERMS.USER.DELETE) && (
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
        )}
      </div>
    );
  }
);

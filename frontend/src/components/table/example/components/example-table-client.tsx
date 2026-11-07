"use client";

/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef, Row } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

// import BackButton from "@/components/shared/back-button";
// import { DeleteDialog } from "@/components/shared/delete-dialog";
import { Locale } from "@/i18n/routing";

import { ENUMS, enumToFilterOptions } from "../../configs/enums";
import { formatDate } from "../../lib/utils-table";
import { Table } from "../../table";
import {
  ActionButtonsType,
  DataTableAdvancedFilterField,
} from "../../types/table";

interface ExampleTableClientProps {
  locale: Locale;
  data: any;
  pageCount: number;
}

export default function ExampleTableClient({
  locale,
  data,
  pageCount,
}: ExampleTableClientProps) {
  const t = useTranslations();

  const ActionButtons: ActionButtonsType[] = [
    {
      title: t("AddExample"),
      type: "component",
      component: <></>,
    },
    {
      title: t("AddExample"),
      type: "link",
      href: "/auth/register",
    },
    {
      title: t("AddExample"),
      type: "button",
      onClick: () => console.log("clicked"),
    },
  ];

  const onDelete = async (id: number) => {
    return;
  };

  const ActionsFn = ({ row }: { row: Row<any> }) => {
    return (
      <div className="flex h-full w-full items-center justify-center gap-4">
        {/* <DeleteDialog
          data={[row.original]}
          onDelete={async () => await onDelete(Number(row.id))}
          icon="fluent:delete-16-regular"
        /> */}
      </div>
    );
  };

  const custom_data = data.map((item: any) => ({
    ...item,
    user_type_name: item.type.type_name,
  }));

  const columns: ColumnDef<any>[] = [
    {
      id: "id",
      minSize: 100,
      type: "number",
    },
    {
      id: "name",
      minSize: 150,
      filterKey: "first_name",
      headerName: "Example Name",
      enableColumnFilter: false,
      accessorFn: (value) => `${value?.first_name} ${value?.last_name}`,
    },
    {
      id: "email",
      minSize: 150,
    },
    {
      id: "created_at",
      minSize: 150,
      type: "date",
      accessorFn: (value) => formatDate(value.created_at),
    },
    {
      minSize: 150,
      id: "user_type_name",
      headerName: "User Type Name",
      filterKey: "type.type_name",
    },
    {
      id: "is_active",
      minSize: 150,
      headerName: "Is Active",
      type: "boolean",
    },
    {
      accessorKey: "gender",
      size: 200,
      headerName: "Gender",
      type: "multi-select",
      accessorFn: (value) => t(value.gender),
      options: enumToFilterOptions(ENUMS.GENDER, (value) => t(value)),
    },
    {
      id: "address[].address",
      minSize: 150,
      headerName: "Address",
      accessorFn: (value) =>
        value.address.map((item: any) => item.address).join(", "),
    },
    {
      id: "address[].sub_address[].address",
      minSize: 150,
      headerName: "Sub Address",
      accessorFn: (value) =>
        value.address
          .map((item: any) =>
            item.sub_address.map((subItem: any) => subItem.address).join(", ")
          )
          .join(", "),
    },
    {
      id: "actions",
      minSize: 40,
      cell: ActionsFn,
    },
  ];

  const advancedFilterFields: DataTableAdvancedFilterField<any>[] = [
    {
      id: "first_name",
      label: t("First Name"),
      type: "text",
    },
    {
      id: "last_name",
      label: t("Last Name"),
      type: "text",
    },
  ];

  return (
    <>
      <div className="mb-8 flex items-center justify-between border-b border-primary pb-4">
        <h3 className="text-md font-bold text-primary">
          {t("links_navigation.Example")}
        </h3>{" "}
        {/* <BackButton /> */}
      </div>
      <Table<any>
        data={custom_data ?? []}
        pageCount={pageCount}
        ActionButtons={ActionButtons}
        getColumns={() => columns}
        advancedFilterFields={advancedFilterFields}
      />
    </>
  );
}

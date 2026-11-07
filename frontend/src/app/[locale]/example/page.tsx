"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { Label } from "@/components/FormBuilder/ui/label";
import { useConfirmDialog } from "@/components/dialog";
import { BaseDialog, useBaseDialog } from "@/components/dialog/base";
import { FormDialogCompleteExample } from "@/components/dialog/form-dialog-example";
import { ViewDialogExample } from "@/components/dialog/view-dialog/example";
import { Table, TableSearchParams } from "@/components/table/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import decorateToaster from "@/utils/decorate-toaster";

export default function Create() {
  const [tableData, setTableData] = useState<any[]>([]);
  const params: { locale: string } = useParams();
  const { open, close, isOpen } = useBaseDialog("example-dialog");
  const confirm = useConfirmDialog();

  const handleDelete = async (id: number, name: string) => {
    const confirmed = await confirm({
      title: "تأكيد الحذف",
      message: `هل أنت متأكد من حذف ${name}؟`,
      type: "danger",
      confirmText: "حذف",
      cancelText: "إلغاء",
      onConfirm: async () => {
        // هنا يتم تنفيذ عملية الحذف
        const promise = new Promise<void>((resolver) => {
          setTimeout(() => {
            resolver();
          }, 1000);
        });
        await decorateToaster(promise);
        // يمكن إضافة API call هنا
      },
    });

    if (confirmed) {
      console.log("تم تأكيد الحذف");
    }
  };

  const getData = async (searchParams: TableSearchParams<any>) => {
    const action = async () => {
      // const response = await Client.admin().get("data-fetching-api", {
      //   params: searchParams
      // });
      // return response;
      console.log(searchParams);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fakeData;
    };
    decorateToaster(action(), {
      successMessage: false,
      loadingMessage: false,
      errorMessage: "Failed to fetch data",
      afterSuccess(response) {
        setTableData(response);
      },
    });
  };

  return (
    <>
      <FormDialogCompleteExample />
      <div className="mx-10 border-t border-gray-200 pb-10 pt-10">
        <h1 className="mb-4 text-2xl font-bold">
          {"مثال على الديالوغ المعاينة"}
        </h1>
        <ViewDialogExample />
      </div>
      <BaseDialog
        isOpen={isOpen}
        onClose={close}
        title="Example Dialog"
        actionButtons={
          <>
            <Button>{"Cancel"}</Button>
            <Button>{"Save"}</Button>
          </>
        }
      >
        <div className="mb-12 space-y-4">
          <Label>{"Name"}</Label>
          <Input
            type="text"
            placeholder="Name"
            className="w-full ring-1 ring-gray-300"
          />
          <Label>{"Email"}</Label>
          <Input
            type="email"
            placeholder="Email"
            className="w-full ring-1 ring-gray-300"
          />
          <Label>{"Status"}</Label>
          <Input
            type="text"
            placeholder="Status"
            className="w-full ring-1 ring-gray-300"
          />
        </div>
      </BaseDialog>
      <div className="mx-10 border-t border-gray-200 pt-10">
        <h1 className="mb-4 text-2xl font-bold">{"مثال على الجدول"}</h1>
        <Table
          getColumns={() => [
            { accessorKey: "id", header: "#" },
            { accessorKey: "name", header: "Name" },
            { accessorKey: "email", header: "Email" },
            { accessorKey: "status", header: "Status" },
            {
              accessorKey: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDelete(row.original.id, row.original.name)
                    }
                  >
                    {"حذف"}
                  </Button>
                </div>
              ),
            },
          ]}
          data={tableData}
          refetch={getData}
          pageCount={1}
          ActionButtons={[
            {
              title: "Add",
              type: "button",
              onClick: open,
            },
          ]}
        />
      </div>
    </>
  );
}

const fakeData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "Active",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    status: "Pending",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    status: "Active",
  },
  {
    id: 6,
    name: "Diana Davis",
    email: "diana@example.com",
    status: "Inactive",
  },
  {
    id: 7,
    name: "Edward Miller",
    email: "edward@example.com",
    status: "Active",
  },
  {
    id: 8,
    name: "Fiona Garcia",
    email: "fiona@example.com",
    status: "Pending",
  },
];

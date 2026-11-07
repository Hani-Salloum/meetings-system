"use client";

import { useState } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import InputField from "@/components/FormBuilder/FormFields/input-field";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import { FormDialog, useFormDialog } from "@/components/dialog/form-dialog";
import { Button } from "@/components/ui/button";
import { useCrudMutation } from "@/hooks/use-crud-mutation";

import DateTimeField from "../FormBuilder/FormFields/date-time-field";
import ListInputField from "../FormBuilder/FormFields/list-input-field";
import EmployeeSelector from "../employee-selector";
import {
  AvailabilityData,
  SelectedEmployee,
  User,
} from "../employee-selector/types";

interface Employee {
  id: number;
  name?: string;
  required: boolean;
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

const handleError = (error: any, variables: any, t: any) => {
  const data = error.response?.data as
    | { data?: Record<string, string | string[]> }
    | undefined;
  if (data?.data && typeof data.data === "object") {
    const messages: string[] = [];
    Object.values(data.data).forEach((val) => {
      if (Array.isArray(val)) {
        messages.push(...val);
      } else if (typeof val === "string") {
        messages.push(val);
      }
    });
    if (messages.length > 0) {
      toast.error(messages.map((ele) => t(ele)).join(" "));
    }
  } else {
    toast.error(t("An unknown error occurred"));
  }
  console.log("error is ", error, variables);
};

function CreateMeetingFromRequest({
  record,
  queryKey,
  isUpdate = false,
  users = [],
  availabilityData = [],
}: {
  record: Meeting;
  refetch: () => void;
  isUpdate?: boolean;
  queryKey: string[];
  users: User[];
  availabilityData: AvailabilityData[];
}) {
  const t = useTranslations();
  const [participants, setParticipants] = useState<SelectedEmployee[]>([]);

  const groupFields = prepareFields({
    participant_employees: {
      yup: Yup.array().required(t("This field is required")),
      type: "custom",
      component: () => (
        <div className="col-span-12">
          <EmployeeSelector
            users={users}
            availabilityData={availabilityData}
            initialSelected={participants}
            onChange={setParticipants}
          />
        </div>
      ),
      componentProps: {},
    },
    guest_attendees: {
      yup: Yup.array().of(Yup.string()),
      type: "list-input",
      component: ListInputField,
      componentProps: {
        label: t("Guest Attendees"),
        placeholder: t("Enter guest name or email..."),
        buttonText: t("Add"),
        containerClassName: "col-span-12",
        maxItems: 15,
      },
    },
    description: {
      yup: Yup.string().required(t("This field is required")),
      type: "input",
      component: InputField,
      componentProps: {
        type: "textarea",
        label: t("Description"),
        placeholder: t("Enter meeting description"),
        containerClassName: "col-span-12",
        rows: 4,
      },
    },
    duration: {
      yup: Yup.number().required(t("This field is required")).min(1),
      type: "number",
      component: InputField,
      componentProps: {
        type: "number",
        label: t("Duration (in minutes)"),
        placeholder: t("Enter duration"),
        containerClassName: "col-span-12",
        prefix: <Icon icon="mdi:clock-outline" className="text-gray-600" />,
      },
    },
    starts_at: {
      yup: Yup.string().required(t("This field is required")),
      type: "datetime",
      component: DateTimeField,
      componentProps: {
        label: t("Date & Time"),
        placeholder: t("Change meeting time if you want"),
        containerClassName: "col-span-12",
      },
    },
  });

  const editMutation = useCrudMutation<any>({
    url: `/admin/meeting-requests/${record?.id}/accept`,
    method: "put",
    successMessage: t("Meeting created successfully"),
    errorMessage: t("Failed to create meeting"),
    invalidateQueries: queryKey,
    optimisticUpdate: {
      queryKey,
      updater: (oldData: any, updatedItem: any) => {
        if (!oldData || !oldData.data) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((item: any) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        };
      },
    },
    onError: (error, variables) => handleError(error, variables, t),
  });

  const editDialog = useFormDialog(groupFields, {
    size: "xl",
    defaultValues: {
      description: "",
      starts_at: record?.start_at || "",
      guest_attendees: [],
      participant_employees: [],
      duration: 60,
    },
    onSubmit: async (data: any) => {
      if (!record) return;

      const payload = {
        id: record.id,
        start_at: data.starts_at ?? record.start_at,
        description: data.description ?? record.description,
        duration: Number(data.duration) ?? Number(record.duration),
        guest_attendees: data.guest_attendees ?? record.guest_attendees,
        participant_employees:
          participants.map((e) => ({
            id: e.employee_id,
            required: e.required,
          })) || [],
      };

      await editMutation.mutateAsync(payload);
    },
    title: t("Create Meeting From Request"),
    submitText: t("Save"),
    cancelText: t("Cancel"),
    formOptions: {
      mode: "onBlur",
      shouldFocusError: true,
    },
  });

  return (
    <div>
      <>
        <Button
          variant="ghost"
          onClick={() => {
            const transformedRecord = {
              ...record,
            };
            setParticipants(
              record?.participant_employees.map((e) => ({
                employee_id: e.id,
                required: e.required,
              })) || []
            );
            editDialog.openEdit(transformedRecord as any);
          }}
          title="Create Meeting"
        >
          <Icon icon={"mdi:like-outline"} className="text-green-500" />
        </Button>
        <FormDialog
          {...editDialog.dialogProps}
          formClassName="grid grid-cols-12 gap-4"
          afterForm={
            <div>
              {t("Current Meeting time")}:{" "}
              {new Date(record?.start_at).toISOString().split("T")[0]}{" "}
              {new Date(record?.start_at).toISOString().substring(11, 16)}
            </div>
          }
        />
      </>
    </div>
  );
}

export default CreateMeetingFromRequest;

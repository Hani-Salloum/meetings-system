"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import InputField from "@/components/FormBuilder/FormFields/input-field";
import AutocompleteFieldServer from "../FormBuilder/FormFields/autocomplete-field-server";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import { FormDialog, useFormDialog } from "@/components/dialog/form-dialog";
import { Button } from "@/components/ui/button";
import ShinyButton from "@/components/ui/shiny-button";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import EmployeeSelectorGroups from "../employee-selector/employee-selector-groups";
import { Group, User, AvailabilityData } from "../employee-selector/types";
import { Client } from "@/configs/api";
import AutocompleteField from "../FormBuilder/FormFields/autocomplete-field";
import { useState } from "react";
import { uploadImage } from "@/requests/upload";
import FileUploadField from "../FormBuilder/FormFields/file-upload-field";

interface MeetingPage {
  id: number;
  service_id: {
    value: number
    label: string
  };
  title: string;
  pathname: string;
  description: string;
  image: string;
  status: string;
  duration: number;
  maximum_attendees: number;
  created_at: string;
  updated_at: string;
  meetingParticipantGroups?: any[];
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

function AddUpdateMeetingPage({
  record,
  queryKey,
  isUpdate = false,
  users = [],
  availabilityData = [],
}: {
  record?: MeetingPage;
  refetch: () => void;
  isUpdate?: boolean;
  queryKey: string[];
  users: User[];
  availabilityData: AvailabilityData[];
}) {
  const t = useTranslations();
  const [participantGroups, setParticipantGroups] = useState<Group[]>([
    { employees: [] }
  ]);

  const transformToGroups = (meetingParticipantGroups?: any[]): Group[] => {
    if (!meetingParticipantGroups || meetingParticipantGroups.length === 0) {
      return [{ employees: [] }];
    }

    return meetingParticipantGroups.map((group) => ({
      employees: group.meetingMeetingParticipantGroupEmployees.map((emp: any) => ({
        employee_id: emp.employee_id,
        required: emp.required,
      })),
    }));
  };

  const groupFields = prepareFields({
    service_id: {
      yup: Yup.number().required(t("This field is required")),
      type: "autocomplete-server",
      component: AutocompleteFieldServer,
      componentProps: {
        label: t("Service"),
        placeholder: t("Select service"),
        serverAction: async (value: string) => {
          return (
            await Client.admin().get('/admin/services/', {
              params: {
                page: 1,
                pageSize: 1000,
                search: value ?? undefined
              }
            })
          ).data.data
        },
        getOptions: (response) => {
          return response.map((item: any) => ({
            value: item.id.toString(),
            label: item.en_name || item.ar_name
          }))
        }
      },
    },
    title: {
      yup: Yup.string().required(t("This field is required")),
      type: "input",
      component: InputField,
      componentProps: {
        label: t("Title"),
        placeholder: t("Enter page title"),
        containerClassName: "col-span-12",
        prefix: <Icon icon="mdi:text" className="text-gray-600" />,
      },
    },
    pathname: {
      yup: Yup.string().required(t("This field is required")),
      type: "input",
      component: InputField,
      componentProps: {
        label: t("Path Name"),
        placeholder: t("Enter URL path (e.g., web-development)"),
        containerClassName: "col-span-12",
        prefix: <Icon icon="mdi:link" className="text-gray-600" />,
      },
    },
    description: {
      yup: Yup.string().required(t("This field is required")),
      type: "input",
      component: InputField,
      componentProps: {
        type: 'textarea',
        label: t("Description"),
        placeholder: t("Enter page description"),
        containerClassName: "col-span-12",
        rows: 4,
      },
    },
    status: {
      yup: Yup.string().required(t("This field is required")),
      type: "autocomplete",
      component: AutocompleteField,
      componentProps: {
        label: t("Status"),
        placeholder: t("Select status"),
        containerClassName: "col-span-12",
        options: [
          { value: "ACTIVE", label: t("Active") },
          { value: "INACTIVE", label: t("Inactive") },
        ],
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
    maximum_attendees: {
      yup: Yup.number().required(t("This field is required")).min(1),
      type: "number",
      component: InputField,
      componentProps: {
        type: "number",
        label: t("Maximum Attendees"),
        placeholder: t("Enter max attendees"),
        containerClassName: "col-span-12",
        prefix: <Icon icon="mdi:account-group" className="text-gray-600" />,
      },
    },
    image: {
      yup: Yup.mixed().required(t("This field is required")),
      type: "file",
      component: FileUploadField,
      componentProps: {
        label: t("Meeting Image"),
        containerClassName: "col-span-12",
        accept: "image/*",
        multiple: false,
      },
    },
    participant_groups: {
      yup: Yup.array().required(t("This field is required")),
      type: "custom",
      component: () => (
        <div className="col-span-12">
            <EmployeeSelectorGroups
            users={users}
            availabilityData={availabilityData}
            initialSelected={participantGroups}
            onChange={setParticipantGroups}
          />
        </div>
      ),
      componentProps: {},
    },
  });

  const addMutation = useCrudMutation<any>({
    url: "/admin/project-meetings/",
    method: "post",
    invalidateQueries: queryKey,
    optimisticUpdate: {
      queryKey,
      updater: (oldData: any, newItem: any) => {
        if (!oldData || !oldData.data) return oldData;

        const updatedData = [newItem, ...oldData.data];

        return {
          ...oldData,
          data: updatedData,
          total: oldData.total + 1,
        };
      },
    },
    onError: (error, variables) => handleError(error, variables, t),
  });

  const editMutation = useCrudMutation<any>({
    url: `/admin/project-meetings/${record?.id}`,
    method: "put",
    successMessage: t("Meeting page updated successfully"),
    errorMessage: t("Failed to update meeting page"),
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

  const addDialog = useFormDialog(groupFields, {
    size: "xl",
    defaultValues: {
      service_id: 0,
      title: "",
      pathname: "",
      description: "",
      status: "ACTIVE",
      duration: 60,
      maximum_attendees: 5,
    },
    onSubmit: async (data: any) => {
      let imagePath = data.image;

      if (data.image instanceof File) {
        imagePath = await uploadImage(data.image);
      }

      const payload = {
        service_id: Number(data.service_id.value),
        title: data.title,
        pathname: data.pathname,
        description: data.description,
        status: data.status,
        duration: Number(data.duration),
        maximum_attendees: Number(data.maximum_attendees),
        image: imagePath,
        participant_groups: participantGroups,
      };

      await addMutation.mutateAsync(payload);
    },
    title: t("Add New Meeting Page"),
    submitText: t("Save"),
    cancelText: t("Cancel"),
    formOptions: {
      mode: "onBlur",
      shouldFocusError: true,
    },
  });

  const editDialog = useFormDialog(groupFields, {
    size: "xl",
    defaultValues: {
      service_id: 0,
      title: "",
      pathname: "",
      description: "",
      status: "ACTIVE",
      duration: 60,
      maximum_attendees: 5,
    },
    onSubmit: async (data: any) => {
      if (!record) return;

      let imagePath = data.image;

    if (data.image instanceof File) {
      imagePath = await uploadImage(data.image);
    }

      const payload = {
        id: record.id,
        service_id: Number(data.service_id.value) ?? Number(record.service_id.value),
        title: data.title ?? record.title,
        pathname: data.pathname ?? record.pathname,
        description: data.description ?? record.description,
        status: data.status ?? record.status,
        duration: data.duration ?? record.duration,
        maximum_attendees: data.maximum_attendees ?? record.maximum_attendees,
        image: imagePath,
        participant_groups: participantGroups,
      };

      await editMutation.mutateAsync(payload);
    },
    title: t("Edit Meeting Page"),
    submitText: t("Save"),
    cancelText: t("Cancel"),
    formOptions: {
      mode: "onBlur",
      shouldFocusError: true,
    },
  });

  return (
    <div>
      {!isUpdate ? (
        <>
          <ShinyButton
            className="w-full rounded-[8px] bg-primary text-primary-foreground shadow-lg sm:rounded-lg"
            onClick={() => {
              setParticipantGroups([{ employees: [] }]);
              addDialog.openAdd();
            }}
          >
            {t("Add New")}
          </ShinyButton>
          <FormDialog
            {...addDialog.dialogProps}
            formClassName="grid grid-cols-12 gap-4"
          />
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            onClick={() => {
              const transformedRecord = {
                ...record,
              };
              setParticipantGroups(transformToGroups(record?.meetingParticipantGroups));
              editDialog.openEdit(transformedRecord as any);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <FormDialog
            {...editDialog.dialogProps}
            formClassName="grid grid-cols-12 gap-4"
          />
        </>
      )}
    </div>
  );
}

export default AddUpdateMeetingPage;
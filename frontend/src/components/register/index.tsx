"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import InputField from "@/components/FormBuilder/FormFields/input-field";
import FormBuilder from "@/components/FormBuilder/form-builder";
import useFormBuilder from "@/components/FormBuilder/hooks/use-form-builder";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import { Button } from "@/components/ui/button";
import { Client } from "@/configs/api";
import decorateToaster from "@/utils/decorate-toaster";

import ListInputField from "../FormBuilder/FormFields/list-input-field";
import PhoneNumberInputField from "../FormBuilder/FormFields/phone-number-input-field";
import MeetingDatepicker from "../meeting-datepicker";
import { AvailableDay } from "../meeting-datepicker/types";
import MeetingPageData from "./MeetingPageData";

interface Props {
  pageData: {
    title: string;
    pathname: string;
    description: string;
    image?: string;
    duration: number;
    maximum_attendees: number;
    groupCommonAvailabilities: AvailableDay[];
  };
}

export default function RegisterForMeeting({ pageData }: Props) {
  const t = useTranslations();

  const { title, pathname, description, duration, maximum_attendees, image } =
    pageData;
  const [isLoading, setIsLoading] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [dateError, setDateError] = useState(false);

  const fields = prepareFields({
    name: {
      yup: Yup.string().required(t("This field is required")),
      type: "input",
      component: InputField,
      componentProps: {
        label: t("Full Name"),
        containerClassName: "col-span-12",
      },
    },
    email: {
      yup: Yup.string()
        .email(t("Invalid email format"))
        .required(t("This field is required")),
      type: "email",
      component: InputField,
      componentProps: {
        type: "email",
        label: t("Email"),
        containerClassName: "col-span-12",
      },
    },
    phone: {
      yup: Yup.string()
        .required(t("This field is required"))
        .min(10, t("Phone number must be at least 10 digits"))
        .matches(/^[0-9+\s()-]+$/, t("Invalid phone number format")),
      type: "input",
      component: PhoneNumberInputField,
      componentProps: {
        label: t("Phone Number"),
        containerClassName: "col-span-12",
      },
    },
    guest_attendees: {
      yup: Yup.array()
        .of(Yup.string())
        .max(
          pageData.maximum_attendees,
          t(`Maximum ${pageData.maximum_attendees} attendees allowed`)
        ),
      type: "list-input",
      component: ListInputField,
      componentProps: {
        label: t("Attendees"),
        placeholder: t("Enter guest name or email..."),
        buttonText: t("Add"),
        containerClassName: "col-span-12",
        maxItems: pageData.maximum_attendees,
      },
    },
    description: {
      yup: Yup.string()
        .required(t("This field is required"))
        .min(10, t("Description must be at least 10 characters"))
        .max(500, t("Description must not exceed 500 characters")),
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
  });

  const formHooks = useFormBuilder(fields, {
    defaultValues: {
      name: "",
      email: "",
      description: "",
      guest_attendees: [],
      phone: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: any) => {
    if (!preferredDate || preferredDate.length === 0) {
      setDateError(true);

      return;
    }

    setDateError(false);
    setIsLoading(true);
    const payload = {
      ...data,
      preferred_date: preferredDate,
      pathname: pageData.pathname,
      country_code: "string",
    };

    await decorateToaster(
      Client.noAuth.post("/customer/meeting-request", payload),
      {
        successMessage: t("Meeting request submitted successfully!"),
        errorMessage: t("Failed to submit meeting request"),
        afterSuccess: () => {
          formHooks.reset();
          setPreferredDate("");
        },
        afterFinally: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4">
        <MeetingPageData
          {...{
            title,
            description,
            pathname,
            image,
            maximum_attendees,
            duration,
          }}
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <FormBuilder
          fields={fields}
          FormHooks={formHooks}
          containerClassName="col-span-12"
        />
      </div>

      <div className="col-span-12 mt-4 flex justify-start">
        <MeetingDatepicker
          availableDays={pageData.groupCommonAvailabilities}
          onChange={(val) => setPreferredDate(val)}
        />
        {dateError && (
          <p className="mt-2 justify-self-start text-sm text-red-500">
            The date and time are required
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={formHooks.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? t("Submitting...") : t("Submit")}
        </Button>
      </div>
    </div>
  );
}

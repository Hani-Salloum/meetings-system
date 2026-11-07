"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

import AutocompleteField from "@/components/FormBuilder/FormFields/autocomplete-field";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import { FormDialog, useFormDialog } from "@/components/dialog/form-dialog";
import ShinyButton from "@/components/ui/shiny-button";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme-store";

function Settings({ className }: { className?: string }) {
  const t = useTranslations();

  const { primaryColor, setPrimaryColor } = useThemeStore();

  const fields = prepareFields({
    color: {
      yup: Yup.string().required(t("This field is required")),
      type: "autocomplete",
      component: AutocompleteField,
      componentProps: {
        label: t("Appearance Settings"),
        placeholder: t("Choose the primary color"),
        options: [
          {
            label: "Slate Blue",
            value: "231 30% 31%",
          },
          {
            label: "Vivid Tangerine",
            value: "18 90% 62%",
          },
          {
            label: "Brilliant Azure",
            value: "210 100% 60%",
          },
          {
            label: "Royal Purple",
            value: "267 45% 45%",
          },
        ].map((deg) => ({
          label: t(deg.label),
          value: deg.value,
        })),
      },
    },
  });

  const fromDialog = useFormDialog(fields, {
    size: "md",
    defaultValues: {
      color: primaryColor,
    },
    onSubmit: async (data: any) => {
      setPrimaryColor(data.color);
    },
    title: t("Appearance Settings"),
    submitText: t("Save"),
    cancelText: t("Cancel"),
    formOptions: {
      mode: "onBlur",
      shouldFocusError: true,
    },
  });

  return (
    <div className={cn("", className)}>
      <ShinyButton
        onClick={() => fromDialog.openAdd()}
        className="flex items-center justify-center bg-card px-4 py-2.5"
      >
        <Icon
          icon="carbon:settings"
          width="22"
          height="22"
          className="font-bold text-primary-foreground"
        />
      </ShinyButton>
      <FormDialog
        {...fromDialog.dialogProps}
        formClassName="grid grid-cols-12 gap-4"
      />
    </div>
  );
}

export default Settings;

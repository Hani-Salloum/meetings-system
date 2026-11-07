"use client";

import { useTranslations } from "next-intl";

import type { Locale } from "@/i18n/routing";

export default function RegisterStepper({
  currentStep,
}: {
  currentStep: number;
  locale: Locale;
}) {
  const t = useTranslations();
  const steps = [
    { label: t("Register.Step1"), number: 1 },
    { label: t("Register.Step2"), number: 2 },
    { label: t("Register.Step3"), number: 3 },
  ];

  return (
    <div className="mx-6 mb-8">
      {/* Progress Bar */}
      <div className="mb-4 flex items-center justify-between">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="ml-12 mr-12 flex items-center justify-center"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                idx <= currentStep
                  ? "bg-custom_2-primary text-white"
                  : "bg-white/20 text-white/60"
              }`}
            >
              {s.number}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-16 transition-all ${idx < currentStep ? "bg-custom_2-primary" : "bg-white/20"}`}
              />
            )}
          </div>
        ))}
      </div>
      {/* Step Labels */}
      <div className="flex justify-between text-xs">
        {steps.map((s, idx) => (
          <span
            key={idx}
            className={`transition-colors ${idx === currentStep ? "text-white/50" : "text-white/60"}`}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

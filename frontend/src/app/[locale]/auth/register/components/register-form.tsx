"use client";

import React, { createContext, useContext, useState } from "react";

interface RegisterData {
  step1: any;
  step2: any;
  emailForVerification?: string;
}
interface RegisterContextType {
  data: RegisterData;
  setStep1: (data: any) => void;
  setStep2: (data: any) => void;
  setEmailForVerification: (email: string) => void;
}
const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<RegisterData>({ step1: {}, step2: {} });
  const setStep1 = (step1: any) => setData((d) => ({ ...d, step1 }));
  const setStep2 = (step2: any) => setData((d) => ({ ...d, step2 }));
  const setEmailForVerification = (email: string) =>
    setData((d) => ({ ...d, emailForVerification: email }));
  return (
    <RegisterContext.Provider
      value={{ data, setStep1, setStep2, setEmailForVerification }}
    >
      {children}
    </RegisterContext.Provider>
  );
}
export function useRegisterContext() {
  const ctx = useContext(RegisterContext);
  if (!ctx)
    throw new Error("useRegisterContext must be used within RegisterProvider");
  return ctx;
}

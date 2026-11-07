"use client";

import React from "react";

import { Locale } from "@/i18n/routing";

import LoginForm from "./login-form";
import LoginOTP from "./login-otp";

// { locale }: { locale: Locale }

export default function LoginController() {
  const [loginInfo, setLoginInfo] = React.useState<{
    email?: string;
    password?: string;
  } | null>(null);

  if (loginInfo) {
    return <LoginOTP loginInfo={loginInfo} />;
  }

  return <LoginForm setLoginInfo={setLoginInfo} />;
}

"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { auth } from "@/configs/api";
import { useRouter } from "@/i18n/routing";

export default function LoginOTP({
  loginInfo,
}: {
  loginInfo: { email?: string; phone?: string };
}) {
  const tAuth = useTranslations("Auth");
  const [otpValue, setOtpValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerActive(false);
            // TODO: Add logic to execute after 3 minutes
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const maskPhoneNumber = (phone: string) => {
    if (!phone) return "892***212";
    if (phone.length <= 4) return phone;

    const lastFour = phone.slice(-4);
    const maskedPart = "*".repeat(phone.length - 4);
    return `${maskedPart}${lastFour}`;
  };

  const handleVerifyPhone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // TODO: remove this fake data
      const response = {
        data: {
          access_token: "1234567890",
        },
      };
      // const response = await Client.noAuth.post("check_code_api", {
      //   email: loginInfo.email,
      //   code: otpValue,
      // });
      const { access_token } = response.data;
      localStorage.setItem(auth.admin, access_token);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <p className="mb-16 text-2xl text-custom-primary-accent">
        {tAuth("EnterVerificationCode")}
      </p>
      <form onSubmit={handleVerifyPhone}>
        <div className="w-full space-y-6">
          {/* Phone Number Display */}
          <div className="flex justify-center">
            <div className="text-center">
              <p className="mb-1 text-sm text-gray-600">
                {tAuth("CodeSentToYourNumber")}
              </p>
              <p className="text-lg font-semibold text-custom-primary-accent">
                {maskPhoneNumber(loginInfo.phone || "")}
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex justify-center">
            <div className="text-center">
              <p
                className={`text-lg font-semibold ${timeLeft <= 30 ? "text-red-500" : "text-custom-primary-accent"}`}
              >
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>

          {/* OTP Input */}
          <div className="flex items-center justify-center">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Verify Button */}
          <div className="flex justify-center pt-8">
            <Button
              // onClick={handleVerifyPhone}
              disabled={otpValue.length !== 6}
              className="w-full max-w-xs"
              type="submit"
            >
              {tAuth("VerifyPhone")}
            </Button>
          </div>
          {/* Resend Button */}
          <div className="flex -translate-y-4 justify-center">
            <Button
              // onClick={handleResendCode}
              disabled={timeLeft > 0}
              variant="link"
              className="w-full max-w-xs tracking-[.5em] text-black"
            >
              {tAuth("ResendCode")}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

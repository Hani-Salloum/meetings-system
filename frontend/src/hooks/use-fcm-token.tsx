"use client";

import { Fragment, useState } from "react";

import { getMessaging, getToken } from "firebase/messaging";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import firebaseApp from "@/configs/firebase";

const VAPID_KEY =
  "BBg79zVSGWd3oJlc3jDprE0HFHHCH07nhbNHo2sdGdPn-H6AWdKs35J9uMyPdg55YW58s_JWEMLDk87Vi_2YPD4";

const useFcmToken = () => {
  const t = useTranslations();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [resolveDialog, setResolveDialog] = useState<
    ((token: string | undefined) => void) | null
  >(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const retrieveToken = async () => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      !isSubscribing
    ) {
      setIsSubscribing(true);
      const messaging = getMessaging(firebaseApp);
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        try {
          const currentToken = await getToken(messaging, {
            vapidKey: VAPID_KEY,
          });
          setIsSubscribing(false);
          return currentToken;
        } catch (error: any) {
          toast.error(
            t(
              "problem in generating device specific token with firebase, please connect support for more details about ho to fix that"
            )
          );
          console.log(error);
        }
      }
    } else {
      toast.error(
        t(
          "Notification is not supported in this browser, please update to the latest version or change to another browser if it don't works"
        )
      );
    }
    setIsSubscribing(false);
  };

  const handleNotificationPermission = async () => {
    const token = await retrieveToken();
    if (!token) return await handleOnErrorInRetrieval();
    else return token;
  };

  const handleOnErrorInRetrieval = async () => {
    if (resolveDialog) {
      return await retrieveToken();
    } else {
      await new Promise<string | undefined>((resolve) => {
        setResolveDialog(() => resolve);
        setOpenDialog(true);
      });
    }
  };

  const NotificationDialog = () =>
    !openDialog ? (
      ""
    ) : (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded bg-white p-8 shadow">
          {isSubscribing ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <Fragment>
              <p className="mb-4">{t("Please allow notifications")}</p>
              <p className="mb-4">
                {t("You can learn how to do this")}{" "}
                <a
                  className="text-blue-900 underline"
                  href="https://support.google.com/chrome/answer/6180214?hl=en"
                >
                  {t("here")}
                </a>
              </p>
              <p className="mb-4">
                {t(
                  "If you don't allow notifications, you will not receive immediate notifications, and you might miss important updates"
                )}
              </p>
              <div className="flex gap-4">
                <button
                  className="rounded bg-primary px-4 py-2 text-white"
                  onClick={async () => {
                    const token = await handleOnErrorInRetrieval();
                    if (token && resolveDialog) {
                      resolveDialog(token);
                      setOpenDialog(false);
                    } else {
                      toast.error(
                        t("Please allow notifications first then try again")
                      );
                    }
                  }}
                >
                  {t("Retry if you allowed notifications")}
                </button>
                <button
                  className="rounded bg-gray-400 px-4 py-2 text-white"
                  disabled={isSubscribing}
                  onClick={() => {
                    setOpenDialog(false);
                    resolveDialog?.(undefined);
                  }}
                >
                  {t("Continue without notifications")}
                </button>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    );

  return {
    NotificationDialog,
    handleNotificationPermission,
  };
};

export default useFcmToken;

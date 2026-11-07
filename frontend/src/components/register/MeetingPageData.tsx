import Image from "next/image";

import { Clock, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { ImageBaseUrl } from "@/configs/api";

interface MeetingPageDataProps {
  pathname?: string;
  description?: string;
  maximum_attendees?: number;
  duration?: number;
  image?: string;
}

export default function MeetingPageData({
  pathname = "",
  description = "",
  maximum_attendees,
  duration,
  image,
}: MeetingPageDataProps) {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        {t("Book Meeting for")}{" "}
        <span className="capitalize">"{pathname.split("-").join(" ")}"</span>
      </h1>

      <div className="overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-sm">
        <div className="p-8">
          <div className="flex gap-6">
            {image && (
              <div className="flex-shrink-1">
                <div className="relative h-[200px] w-[300px] overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                  <Image
                    src={ImageBaseUrl + image}
                    alt={pathname}
                    className="h-full w-full object-cover"
                    fill
                    objectFit="cover"
                  />
                </div>
              </div>
            )}

            <div className="flex-2">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                {t("Service Details")}
              </h2>

              <p className="mb-6 text-base leading-relaxed text-gray-700">
                {description}
              </p>

              <div className="flex items-center gap-8 text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">
                    <span className="font-medium">
                      {t("Maximum Attendees")}:
                    </span>{" "}
                    {maximum_attendees}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">
                    <span className="font-medium">
                      {t("Duration (in minutes)")}:
                    </span>{" "}
                    {duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

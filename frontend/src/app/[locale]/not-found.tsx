import { Metadata } from "next";
import Image from "next/image";

import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Not Found",
  },
};

async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="relative h-64 w-full">
        <Image src="/not-found.jpg" alt="Truck" fill />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-xl px-4 pb-8 pt-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("Title")}
          </h1>

          <p className="mt-4 text-gray-500">{t("Description")}</p>

          <a
            href="/"
            className="focus:ring-3 focus:outline-hidden mt-6 inline-block rounded-sm bg-custom-primary-accent px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {t("Button")}
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

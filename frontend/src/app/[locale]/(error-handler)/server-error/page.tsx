import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default async function NotAuthorized() {
  const t = await getTranslations();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-primary">
      <div className="rounded-full bg-primary-foreground p-16 text-center">
        <h1 className="text-8xl font-bold text-primary md:text-[150px]">
          {500}
        </h1>
        <p className="mt-8 text-lg text-primary">
          {t("An unexpected error occurred")}
        </p>
        <div className="mt-4">
          <Button variant="default" size="lg">
            <Link href="/dashboard">{t("Return to home")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

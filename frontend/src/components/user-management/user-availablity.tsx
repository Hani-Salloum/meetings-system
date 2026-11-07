"use client";

import { useTranslations } from "next-intl";
import { useUserStore } from "@/store/use-user-store";
import PERMS from "@/configs/all-permissions";
import PageTitle from "../shared/page-title";
import { useRouter } from "next/navigation";
import AvailabilityManagement from "../dashboard/availability-management";

const UserAvailability = ({ id }: { id: string }) => {
  const t = useTranslations()
  const { hasPerm }  = useUserStore()
  const router = useRouter()

  if (!hasPerm(PERMS.AVAILABILITY.READ_ALL)) {
    router.replace('/en/not-authorized')

    return null
  }

  return (
    <div className="pt-8">
      <PageTitle title="User Availability" description="Overview of the user availabilty time" />
      <AvailabilityManagement id={Number(id)} disabled={false} />
    </div>
  );
};

export default UserAvailability;

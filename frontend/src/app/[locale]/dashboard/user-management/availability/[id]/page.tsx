import UserAvailability from "@/components/user-management/user-availablity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Availability",
};

interface Props {
  params: Promise<{ id: string }>;
}

async function Page({ params }: Props) {
  const { id } = await params

  return <div className="pt-8">
    <UserAvailability id={id} />
  </div>;
}

export default Page;

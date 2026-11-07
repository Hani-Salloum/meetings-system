import DashboardView from "@/components/dashboard/dashboard-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function Page() {
  return <div className="pt-8">
    <DashboardView />
  </div>;
}

export default Page;

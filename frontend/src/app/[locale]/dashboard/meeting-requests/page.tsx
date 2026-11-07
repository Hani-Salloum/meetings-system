import MeetingRequestsView from "@/components/meeting-requests";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Meeting Requests",
};

export default async function MeetingRequstsManagements() {
  return (
    <>
      <MeetingRequestsView type="own" />
    </>
  )
}

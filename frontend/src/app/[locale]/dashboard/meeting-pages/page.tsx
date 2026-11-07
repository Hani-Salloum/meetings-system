import MeetingPagesView from "@/components/meeting-pages/meeting-pages-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meeting Pages",
};

export default async function MeetingPagesManagements() {
  return (
    <>
      <MeetingPagesView />
    </>
  )
}
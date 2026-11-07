import MeetingsView from "@/components/meetings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetings",
};

export default async function MeetingsManagements() {
  return (
    <>
      <MeetingsView type="all" />
    </>
  )
}

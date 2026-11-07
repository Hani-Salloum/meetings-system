import MeetingsView from "@/components/meetings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Meetings",
};

export default async function MeetingsManagements() {
  return (
    <>
      <MeetingsView type="own" />
    </>
  )
}

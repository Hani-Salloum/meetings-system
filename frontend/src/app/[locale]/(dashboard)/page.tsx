"use client";

import AvailabilityManagement from "@/components/dashboard/availability-management";

// import MeetingDatepicker from "@/components/meeting-datepicker";
// import { AvailableDay } from "@/components/meeting-datepicker/types";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Dashboard",
// };

function Page() {
  // const availabilityData: AvailableDay[] = [
  //   {
  //     day: "MONDAY",
  //     hours: [
  //       "HOUR_9",
  //       "HOUR_10",
  //       "HOUR_11",
  //       "HOUR_14",
  //       "HOUR_15",
  //       "HOUR_16"
  //     ]
  //   },
  //   {
  //     day: "TUESDAY",
  //     hours: [
  //       "HOUR_10",
  //       "HOUR_11",
  //       "HOUR_14",
  //       "HOUR_15",
  //       "HOUR_16"
  //     ]
  //   },
  //   // {
  //   //   day: "WEDNESDAY",
  //   //   hours: [
  //   //     "HOUR_10",
  //   //     "HOUR_11",
  //   //     "HOUR_14",
  //   //     "HOUR_15",
  //   //     "HOUR_16",
  //   //     "HOUR_17"
  //   //   ]
  //   // },
  //   {
  //     day: "THURSDAY",
  //     hours: [
  //       "HOUR_10",
  //       "HOUR_11",
  //       "HOUR_14",
  //       "HOUR_15",
  //       "HOUR_16"
  //     ]
  //   },
  //   {
  //     day: "FRIDAY",
  //     hours: [
  //       "HOUR_10",
  //       "HOUR_11",
  //       "HOUR_14",
  //       "HOUR_15"
  //     ]
  //   }
  // ];

  return (
    <div>
      <AvailabilityManagement id={12} disabled={false} />
      <div className="my-8" />
      {/* <MeetingDatepicker
      availableDays={availabilityData}
      onChange={(datetime) => console.log(datetime)}
    /> */}
    </div>
  );
}

export default Page;

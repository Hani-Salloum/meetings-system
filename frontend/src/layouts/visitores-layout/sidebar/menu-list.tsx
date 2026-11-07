import PERMS from "@/configs/all-permissions";
import { Layout } from "@/types/layout";

export function GetMenuList(): Layout.Group[] {

  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Home",
          icon: "fluent:home-more-32-filled",
        },
        {
          href: "/dashboard/user-management",
          label: "Users Management",
          icon: "tabler:users",
          actions: [PERMS.USER.READ_ALL]
        },
        {
          href: "/dashboard/meeting-pages",
          label: "Meeting Pages",
          icon: "streamline-plump:browser-website-1-remix",
          actions: [PERMS.PROJECT_MEETING.READ_ALL],
        },
        {
          href: "/dashboard/all-meetings",
          label: "All Meetings",
          icon: "streamline-ultimate:team-meeting",
          actions: [PERMS.MEETING_REQUESTS.READ_ALL],
        },
        {
          href: "/dashboard/meetings",
          label: "Your Meetings",
          icon: "streamline-ultimate:team-meeting",
          actions: [PERMS.MEETING_REQUESTS.READ_OWN]
        },
        {
          href: "/dashboard/all-meeting-requests",
          label: "All Meeting Requests",
          icon: "hugeicons:question",
          actions: [PERMS.MEETING_REQUESTS.READ_ALL],
        },
        {
          href: "/dashboard/meeting-requests",
          label: "Your Meeting Requests",
          icon: "hugeicons:question",
          actions: [PERMS.MEETING_REQUESTS.READ_OWN],
        },
      ],
    },
    // {
    //   groupLabel: "Settings",
    //   menus: [
    //     {
    //       href: "/guest-dashboard/match-tickets",
    //       label: "Match Tickets",
    //       icon: "icon-park-outline:ticket",
    //       actions: ["Match ticket"],
    //     },
    //     {
    //       href: "/guest-dashboard/travel-tickets",
    //       label: "Travel Tickets",
    //       icon: "mdi:flight-takeoff",
    //       actions: ["Airline ticket"],
    //     },
    //     {
    //       href: "/visitors-dashboard",
    //       label: "Hotel Booking",
    //       icon: "fluent:calendar-todo-32-light",
    //       actions: ["Book a hotel"],
    //     },
    //     {
    //       href: "/guest-dashboard/visa",
    //       label: "Visa",
    //       icon: "flowbite:visa-solid",
    //       actions: ["Visa Service"],
    //     },
    //     {
    //       href: "/guest-dashboard/payments",
    //       label: "Payments",
    //       icon: "ic:round-payments",
    //       actions: ["all"],
    //     },
    //     {
    //       href: "/guest-dashboard/services",
    //       label: "Services",
    //       icon: "mdi:briefcase-outline",
    //       actions: ["additional services"],
    //     },
    //      {
    //       href: "",
    //       label: "Posts",
    //       icon: "mdi:account-settings",
    //       submenus: [
    //         {
    //           href: "/account",
    //           label: "All Posts",
    //         },
    //         {
    //           href: "/posts/new",
    //           label: "New Post",
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];
}

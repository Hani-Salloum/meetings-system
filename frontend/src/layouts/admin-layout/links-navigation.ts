import PERMS from "@/configs/all-permissions";
import { LinksType } from "@/types";

export const links_navigation = (): LinksType[] => [
  {
    id: "users",
    title: "Users",
    icon: "mdi:user",
    url: "/users",
    action: [PERMS.USER.READ],
  },
];

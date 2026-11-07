import UserManagementView from "@/components/user-management";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
};


export default async function UsersManagement() {
  return (
    <>
      <UserManagementView />
    </>
  )
}
"use client";

import { useCallback, useEffect, useState } from "react";

import ClientLoading from "@/components/shared/client-loading";
import { auth, Client } from "@/configs/api";
import { useRouter } from "@/i18n/routing";
import { useUserStore } from "@/store/use-user-store";
import decorateToaster from "@/utils/decorate-toaster";

const fakeUserData = {
  id: 1,
  email: "admin@example.com",
  user_type: [
    {
      id: 1,
      name: "Admin",
      permissions: [
        {
          code: "user:read",
          name: "Read Users",
          description: "Can view user information",
        },
        {
          code: "user:create",
          name: "Create Users",
          description: "Can create new users",
        },
        {
          code: "user:update",
          name: "Update Users",
          description: "Can update user information",
        },
        {
          code: "user:delete",
          name: "Delete Users",
          description: "Can delete users",
        },
      ],
    },
  ],
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setUser, setPermissions } = useUserStore();

  const me = useCallback(async () => {
    // TODO: remove this fake data
    const action = async () => {
      const res = await Client.admin().get('/auth/me/');
      console.log(res.data)
      return {
        data: res.data as User,
      };
    };
    await decorateToaster(action(), {
      afterSuccess: (response) => {
        setUser(response.data);
        setPermissions(
          (response.data as User).user_types
            .map((type) => type.permissions.map((perm) => perm.code))
            .flat()
        );
        setIsLoading(false);
      },
      disabled: true,
    });
  }, [setUser, setPermissions]);

  useEffect(() => {
    const token = localStorage.getItem(auth.admin);
    if (!token) {
      router.push("/auth/login");
    } else me();
  }, [me, router]);

  if (isLoading) {
    return <ClientLoading />;
  }
  return children;
}

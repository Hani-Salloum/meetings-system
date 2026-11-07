import { create } from "zustand";

interface UserStore {
  user: User | null;
  permissions: string[];
  setUser: (user: User) => void;
  setPermissions: (permissions: string[]) => void;
  clearUser: () => void;
  // Admin permissions methods
  hasPerm: (action: string) => boolean;
  hasAnyPerm: (actions: string[]) => boolean;
  hasAllPerm: (actions: string[]) => boolean;
  isPermitted: (actions: string | string[]) => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  permissions: [],
  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  clearUser: () => set({ user: null, permissions: [] }),

  // Admin permissions methods
  hasPerm: (action: string) => {
    const { permissions } = get();
    return permissions.includes(action);
  },

  hasAnyPerm: (actions: string[]) => {
    const { permissions } = get();
    return actions.some((perm) => permissions.includes(perm)) || false;
  },

  hasAllPerm: (actions: string[]) => {
    const { permissions } = get();
    return actions.every((perm) => permissions.includes(perm)) || false;
  },

  isPermitted: (actions: string | string[]) => {
    const { permissions } = get();
    if (typeof actions === "string") {
      return permissions.includes(actions);
    }
    return actions.some((perm) => permissions.includes(perm)) || false;
  },
}));

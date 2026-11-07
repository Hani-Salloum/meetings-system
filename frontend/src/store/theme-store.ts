import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeState = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

export const useThemeStore = create(
  persist<ThemeState>(
    (set, get) => ({
      primaryColor: "#3699FF40",
      setPrimaryColor: (color) => {
        set({ primaryColor: color });

        const darkRoot = document.querySelector(".dark") as HTMLElement;
        if (darkRoot) {
          darkRoot.style.setProperty("--accent", color);
          darkRoot.style.setProperty("--primary", color);
          darkRoot.style.setProperty("--popover", color);
          darkRoot.style.setProperty("--muted-foreground", color);
        }else{
          const root = document.documentElement;
          root.style.setProperty("--primary-foreground", color);
          root.style.setProperty("--muted-foreground", color);
          root.style.setProperty("--accent", color);
          root.style.setProperty("--popover-foreground", color);
        }

      },
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

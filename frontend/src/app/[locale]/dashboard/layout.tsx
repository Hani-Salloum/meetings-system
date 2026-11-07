import { Metadata } from "next";

import { ProgressBar, ProgressBarProvider } from "react-transition-progress";

import { Toaster } from "@/components/ui/sonner";
import BottomNavigationBar from "@/layouts/visitores-layout/bottom-navigation-bar";
import { GradientBlobs } from "@/layouts/visitores-layout/gradient-blobs";
import ContainerBody from "@/layouts/visitores-layout/header/container-body";
import LanguageButton from "@/layouts/visitores-layout/header/language-button";
import Notification from "@/layouts/visitores-layout/header/notification";
import PageTitle from "@/layouts/visitores-layout/header/page-title";
import SearchInput from "@/layouts/visitores-layout/header/search-input";
import Settings from "@/layouts/visitores-layout/header/settings";
import ThemeToggler from "@/layouts/visitores-layout/header/theme-toggler";
import { UserNav } from "@/layouts/visitores-layout/header/user-nav";
import Sidebar from "@/layouts/visitores-layout/sidebar";
import ReactQueryProvider from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import AuthGuard from "@/components/guards/auth-guard";

export const metadata: Metadata = {
  description: "Meeting Dashboard",
  generator: "Next.js",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  icons: [
    { rel: "apple-touch-icon", url: "/icons/logo_sm.png" },
    { rel: "icon", url: "/icons/logo_sm.png" },
    { rel: "favicon", url: "/icons/logo_sm.png" },
  ],
};

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function layout({ children }: { children: React.ReactNode }) {
  // await delay(12000);

  return (
    <div>
      <AuthGuard>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ProgressBarProvider>
              <ProgressBar className="fixed top-0 z-[1111111] h-1 w-full bg-primary-foreground shadow-lg shadow-primary-foreground/20" />
              <div className="min-h-screen bg-background p-2 sm:p-6">
                <div className="relative z-10 gap-1 sm:gap-6">
                  <Sidebar />

                  <ContainerBody className="w-full">
                    <div className="flex items-center justify-between">
                      <PageTitle />
                      <div className="flex items-center gap-2">
                        <div className="hidden items-center gap-2 sm:flex">
                          {/* <SearchInput /> */}
                          {/* <Settings /> */}
                          {/* <Notification /> */}
                          <LanguageButton />
                          <ThemeToggler />
                        </div>
                        <UserNav />
                      </div>
                    </div>
                    <div className="">{children}</div>
                    <Toaster
                      toastOptions={{
                        classNames: {
                          loading:
                            "bg-primary text-white text-base font-bold p-4 rounded-lg shadow-lg border-none",
                          error:
                            "bg-destructive text-white text-base font-bold p-4 rounded-lg shadow-lg border-none",
                          success:
                            "bg-primary text-white text-base font-bold p-4 rounded-lg shadow-lg border-none",
                        },
                      }}
                    />
                  </ContainerBody>
                </div>
                <GradientBlobs />
              </div>
              <BottomNavigationBar />
            </ProgressBarProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </AuthGuard>
    </div>
  );
}

export default layout;

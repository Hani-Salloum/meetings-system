import LanguageSwitcherSelect from "@/components/shared/language-switcher-select";
import { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import ControlSidebarButton from "./control-sidebar-button";
import ProfileClient from "./profile-client";
import SidebarContainer from "./sidetop-container";

type TopbarType = {
  locale: Locale;
};

const Topbar = ({ locale }: TopbarType) => {
  return (
    <SidebarContainer locale={locale}>
      <div className="flex items-center justify-between">
        <div className={cn("w-full flex-[50%]", "flex items-center gap-3")}>
          <ControlSidebarButton />

          {/* <PageTitle locale={locale} /> */}
        </div>
        <div className="flex flex-[50%] flex-row items-center justify-end gap-4">
          {/* <Buttons /> */}

          <LanguageSwitcherSelect label={locale} defaultValue={locale} />

          <div className="h-10 w-[1px] rounded-xl bg-primary" />

          {/* {isPermitted([
            PERMS.NOTIFICATIONS.READ,
            PERMS.NOTIFICATIONS_COMPANY.READ,
          ]) && <NotificationServer locale={locale} />} */}

          <ProfileClient />
        </div>
      </div>
    </SidebarContainer>
  );
};

export default Topbar;

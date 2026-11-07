import { memo } from "react";

import ProgressLink from "@/components/shared/progress-link";
import ShinyButton from "@/components/ui/shiny-button";

import { ActionButtonsType } from "../types/table";

function AdditionalButtons({
  ActionButtons,
}: {
  ActionButtons: ActionButtonsType[];
}) {
  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      {ActionButtons?.map((button, index) => (
        <div key={`${button.type}_${index}`} className="w-full sm:w-auto">
          {button.type === "link" ? (
            <ProgressLink href={button.href as any}>
              <ShinyButton className="w-full rounded-[8px] bg-primary text-primary-foreground shadow-md hover:shadow-lg sm:w-auto sm:rounded-md">
                <span className="text-sm font-normal">
                  <p>{button.title}</p>
                </span>
              </ShinyButton>
            </ProgressLink>
          ) : button.type === "component" ? (
            button.component
          ) : (
            <ShinyButton
              className="w-full rounded-[8px] bg-primary text-primary-foreground shadow-md hover:shadow-lg sm:w-auto sm:rounded-md"
              onClick={button.onClick}
            >
              <span className="text-sm font-normal">
                <p>{button.title}</p>
              </span>
            </ShinyButton>
          )}
        </div>
      ))}
    </div>
  );
}

export default memo(AdditionalButtons);

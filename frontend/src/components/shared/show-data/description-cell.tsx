import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const DescriptionCell = ({
  text,
  maxLetters = 30,
}: {
  text: string;
  maxLetters?: number;
}) => {
  const t = useTranslations();

  if (!text) return null;

  const shortText = text.length > maxLetters ? `${text.slice(0, maxLetters)}...` : text;

  if (text.length <= 30) {
    return <span>{text}</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          {shortText} <span className="text-primary">{t("Show More")}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="overflow-hidden p-0 text-white sm:text-center">
          <DialogTitle className="rounded-t-md bg-primary p-4">
            {t("description")}
          </DialogTitle>
          <DialogDescription className="my-4 p-4 text-base text-[#2F363D]">
            {text}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

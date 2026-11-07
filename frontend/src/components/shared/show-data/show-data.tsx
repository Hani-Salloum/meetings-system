import Image from "next/image";

import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageBaseUrl } from "@/configs/api";
import { cn } from "@/lib/utils";

export default function ShowData({
  buttonType,
  title,
  icon,
  values,
  fields,
  fullWidth = true,
  CustomButton,
}: {
  buttonType: "Icon" | "Button";
  icon: React.ReactNode;
  title: string;
  values: any;
  fields: FieldsDetails;
  fullWidth?: boolean;
  CustomButton?: React.FC<{ onClick: () => void }>;
}) {
  const t = useTranslations();

  const locale = useLocale();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {CustomButton ? (
          <CustomButton onClick={() => null} />
        ) : (
          <Button variant="ghost" className="relative rounded-full">
            {buttonType === "Icon" ? icon : t("open")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="border-none p-0"
        style={
          // maxHeight: "90vh",
          // maxWidth: "95vw",
          fullWidth
            ? {
                height: "100vh",
                minWidth: "100vw",
              }
            : {}
        }
      >
        <DialogHeader className="bg-primary p-4">
          <DialogTitle className="text-md mb-2 text-center font-semibold text-white md:text-lg">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto">
          {fields?.map((section, index) => (
            <div key={index} className="p-4">
              {section.section && (
                <div className="px-4 pt-4">
                  <p>{t(section.section)}</p>
                  <div className="h-[1px] w-full bg-gray-300" />
                </div>
              )}
              <div
                className={cn(
                  `mt-5 ${locale === "en" ? "border-l-4 pl-2" : "border-r-4 pr-2"} border-primary`,
                  `mt-5 ${locale === "en" ? "border-l-4 pl-2" : "border-r-4 pr-2"} border-primary`,
                  "grid grid-cols-12 gap-4"
                )}
              >
                {section?.items?.map((item, itemIndex) =>
                  item.hidden ? (
                    ""
                  ) : (
                    <InfoItem
                      key={itemIndex}
                      className={item.className}
                      values={values}
                      item={item}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const InfoItem = ({
  item,
  values,
  className,
}: {
  item: FieldsDetailsElement;
  values: any;
  className: string;
}) => {
  const { type, name, label, CustomButton, CustomComponent } = item;

  const t = useTranslations();

  const locale = useLocale();

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const val = () => {
    const value = getNestedValue(values, name);
    if (type !== "boolean" && Number(value) !== 0 && !value) return;
    if (item.renderData !== undefined) return item.renderData(value);
    switch (type) {
      case "boolean":
        return value === true ? t("Yes") : t("No");
      case "date":
        return format(new Date(value), "dd-MM-yyyy");
      case "list":
        return value instanceof Array ? value.toString() : "";
      case "button":
        if (!CustomButton) return "";
        return CustomButton();
      case "component":
        if (!CustomComponent) return "";
        return CustomComponent();

      case "image":
        const images = Array.isArray(value) ? value : [value];

        return (
          <div className="flex w-full flex-wrap justify-center gap-2">
            {images.map((img, index) =>
              img ? (
                <a
                  key={index}
                  href={`${ImageBaseUrl}/${img}`}
                  target="_blank"
                  className="flex items-center justify-center"
                >
                  <Image
                    src={`${ImageBaseUrl}/${img}`}
                    alt="Image not available"
                    className="w-32 object-cover"
                    width={300}
                    height={300}
                  />
                </a>
              ) : (
                t("There is no")
              )
            )}
          </div>
        );
      default:
        return value;
    }
  };

  return (
    <div className={cn("shadow-sm", className)}>
      <div
        className={`flex h-full items-center border border-gray-300 bg-gray-100 ${className || ""}`}
      >
        <div className="flex h-full items-center border-r border-gray-300 bg-white p-2 text-gray-600">
          <p className="text-nowrap">{t(label)}</p>
        </div>
        <div className="w-full min-w-[100px] p-2"> {val()}</div>
      </div>
    </div>
  );
};

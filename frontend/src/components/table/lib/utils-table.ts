import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

export const momentFormatted = (date: Date, locale: string, t: any) => {
  const duration = moment.duration(moment().diff(moment(date)));
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  if (hours === 0 && minutes === 0) {
    return t("now");
  } else if (hours === 0) {
    return locale === "ar"
      ? `منذ ${minutes} دقيقة`
      : `since ${minutes} minutes`;
  } else if (minutes === 0) {
    return locale === "ar" ? `منذ ${hours} ساعة` : `since ${hours} hours`;
  }

  return locale === "ar"
    ? `منذ ${hours} ساعة و ${minutes} دقيقة`
    : `since ${hours} hours and ${minutes} minutes`;
};

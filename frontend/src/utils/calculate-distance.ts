import { useTranslations } from "next-intl";

// Helper function to calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Helper function to convert degrees to radians
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function fixDistanceNaming(
  distance: number,
  t: ReturnType<typeof useTranslations>
): string {
  if (distance < 1) {
    return `${distance * 1000} ${t("unit.m")}`;
  }
  return `${distance} ${t("unit.km")}`;
}

export function fixDurationNaming(
  duration: number,
  t: ReturnType<typeof useTranslations>
): string {
  if (duration < 60) {
    return `${duration} ${t("unit.min")}`;
  }
  return `${Math.floor(duration / 60)} ${t("unit.hours")} ${
    duration % 60 > 0 ? `+ ${duration % 60} ${t("unit.min")}` : ""
  }`;
}

"use client";

import { useState } from "react";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useLocale, useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

import { env } from "@/env/client";
import { cn } from "@/lib/utils";

type MapPickerProps = {
  name: string;
  control: any;
  label?: string;
  required?: boolean;
  height?: string;
  hidden?: boolean;
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 24.72169,
  lng: 46.75702,
};

const GoogleMapPicker = ({
  name,
  control,
  label,
  required = false,
  hidden = false,
  height = "400px",
}: MapPickerProps) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const t = useTranslations();
  const locale = useLocale();
  if (!env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    console.error(
      "Google Maps API Key is not set, you need to set correct one in the .env file by name NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
    );
  }
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places", "routes"],
    language: locale,
    id: "google-map-script",
  });

  return (
    isLoaded && (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          const handleMapClick = (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              const coords = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              };
              setMapCenter(coords);
              field.onChange(coords);
            }
          };

          return (
            <div className={cn("col-span-12 p-2", { hidden: hidden })}>
              {label && (
                <label className="mb-3 block text-base font-medium text-gray-700">
                  {label}
                  {required && <span className="ml-1 text-red-500">{"*"}</span>}
                </label>
              )}
              <GoogleMap
                mapContainerStyle={{ ...containerStyle, height }}
                center={field.value || mapCenter}
                zoom={7}
                onClick={handleMapClick}
                options={{
                  fullscreenControl: false,
                  streetViewControl: false,
                  clickableIcons: false,
                  gestureHandling: "cooperative",
                }}
              >
                {field.value && <Marker position={field.value} />}
              </GoogleMap>

              {field.value?.lat && (
                <div className="mt-2 bg-gray-100 p-2 text-sm">
                  {t("Location")}
                  {":"} {field.value?.lat?.toFixed(5)}
                  {","} {field.value?.lng?.toFixed(5)}
                </div>
              )}

              {error && (
                <span className="mt-1 text-sm text-red-500">
                  {error.message}
                </span>
              )}
            </div>
          );
        }}
      />
    )
  );
};

export default GoogleMapPicker;

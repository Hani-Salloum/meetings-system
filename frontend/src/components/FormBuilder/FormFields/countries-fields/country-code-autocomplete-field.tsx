import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

import { CountryCodeAutocompleteFieldProps } from "../../types/all-fields";

export default function CountryCodeAutocompleteField<T>(
  props: CountryCodeAutocompleteFieldProps<T>
) {
  const CountryData = dynamic(() => import("./country-render"), {
    ssr: false,
    loading: () => (
      <div
        className={props.containerClassName}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "8px",
        }}
      >
        <Skeleton className="h-10 w-full" />
      </div>
    ),
  });
  return <CountryData {...props} />;
}

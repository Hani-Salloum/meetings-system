import { useCallback, useEffect, useState } from "react";

import { AutocompleteFieldServerProps } from "../types/all-fields";
import { useDebounce } from "../utils/use-debounce";
import AutocompleteFieldRefactored from "./autocomplete-field-v2";

/**
 * @description This is a server side autocomplete field that takes a server action and a function to get the options from the result of the server action.
 */
const AutocompleteFieldServer = <T,>(
  props: AutocompleteFieldServerProps<T>
) => {
  const { serverAction, getOptions, onChange, ...rest } = props;
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [error, setError] = useState(false);
  const serverSearch = useCallback(
    async (value: string) => {
      try {
        setLoading(true);
        const response = await serverAction(value);
        setError(false);
        return getOptions(response);
      } catch (error) {
        console.log(error);
        setError(true);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [serverAction, getOptions]
  );

  useEffect(() => {
    serverSearch(debouncedValue).then((options) => {
      if (selectedOptions.length > 0) {
        const selectedOptionsValues = selectedOptions.map(
          (option) => option.value
        );
        const optionsExcludingSelected = options.filter(
          (option) => !selectedOptionsValues.includes(option.value)
        );
        setOptions([...selectedOptions, ...optionsExcludingSelected]);
      } else {
        setOptions(options);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <AutocompleteFieldRefactored
      {...rest}
      serverSearch={(e) => setSearchValue(e)}
      onChange={(e) => {
        setSelectedOptions(
          options.filter((option) => {
            if (Array.isArray(e)) {
              return e.some(
                (selected_option) => selected_option.value === option.value
              );
            } else {
              return e.value === option.value;
            }
          })
        );
        onChange?.(e);
      }}
      loading={loading}
      getOptionsError={error}
      options={options}
    />
  );
};

export default AutocompleteFieldServer;

import { useCallback, useState } from "react";

import { AutocompleteFieldOneTimeFetchProps } from "../types/all-fields";
import AutocompleteFieldRefactored from "./autocomplete-field-v2";

/**
 * @description This is a server side autocomplete field that takes a server action and a function to get the options from the result of the server action.
 */
const AutocompleteFieldOneTimeFetch = <T,>(
  props: AutocompleteFieldOneTimeFetchProps<T>
) => {
  const { oneTimeFetchAction, getOptions, ...rest } = props;
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    props.options || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const oneTimeFetch = useCallback(
    async (force = false) => {
      try {
        if (loaded && !force) return;
        setLoading(true);
        const response = await oneTimeFetchAction();
        setOptions([...(props.options || []), ...getOptions(response)]);
        setLoaded(true);
        setError(false);
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [loaded, oneTimeFetchAction, props.options, getOptions]
  );

  return (
    <AutocompleteFieldRefactored
      {...rest}
      oneTimeFetch={oneTimeFetch}
      loading={loading}
      getOptionsError={error}
      options={options}
    />
  );
};

export default AutocompleteFieldOneTimeFetch;

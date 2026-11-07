import { useCallback, useRef, useState } from "react";

import { AutocompleteFieldOneTimeFetchProps } from "../types/all-fields";
import AutocompleteFieldRefactored from "./autocomplete-field-v2";

/**
 * @description This is a server side autocomplete field that takes a server action and a function to get the options from the result of the server action.
 */
const AutocompleteFieldDependenciesFetch = <T,>(
  props: AutocompleteFieldOneTimeFetchProps<T> & {
    dependencies: number[];
  }
) => {
  const { oneTimeFetchAction, getOptions, dependencies = [], ...rest } = props;
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const lastDependenciesRef = useRef<any[] | undefined>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const haveDependenciesChanged = () => {
    return (
      !lastDependenciesRef.current ||
      lastDependenciesRef.current.length !== dependencies.length ||
      !lastDependenciesRef.current.every((val, index) => val === dependencies[index])
    );
  };  


  const oneTimeFetch = useCallback(async () => {
    console.log("dependencies", dependencies);
    

    if (!haveDependenciesChanged() && loaded) return;

    try {
      setLoading(true);
      const response = await oneTimeFetchAction();

      setOptions(getOptions(response));
      setError(false);
      setLoaded(true);
      lastDependenciesRef.current = dependencies;
    } catch(error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }


  }, [dependencies, getOptions, haveDependenciesChanged, loaded, oneTimeFetchAction]);

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

export default AutocompleteFieldDependenciesFetch;

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

type SimpleDataOptions<T> = {
  url: string;
  defaultParams?: Record<string, any>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
};

export function useSimpleData<T>(options: SimpleDataOptions<T>) {
  const queryClient = useQueryClient();

  const {
    url,
    defaultParams = {},
    enabled = true,
    staleTime = 5 * 60 * 1000,
    gcTime = 10 * 60 * 1000,
    refetchOnWindowFocus = false,
    onSuccess,
    onError,
  } = options;

  const queryKey = ["simple-data", url, defaultParams];

  const fetchData = useCallback(async (): Promise<T> => {
    const res = await import("@/configs/api").then((mod) =>
      mod.Client.admin().get(url, { params: defaultParams })
    );
    return res.data;
  }, [url, defaultParams]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchData,
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
  });

  // Callbacks
  if (data && onSuccess) onSuccess(data);
  if (error && onError) onError(error);

  const forceRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    data,
    isLoading,
    error,
    refetch,
    forceRefresh,
  };
}
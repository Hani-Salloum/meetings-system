"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTableSettings } from "@/components/tanstack-table/store/table-settings-store";
import {
  HandlePathData,
  extractPaginationData,
} from "@/utils/data-path-handler";

type Options<T> = {
  url: string;
  defaultParams?: Record<string, any>;
  responseKeys?: {
    dataKey?: string;
    totalKey?: string;
    pageKey?: string;
    totalPagesKey?: string;
  };
  errorMessage?: string;
  onSuccess?: (data: TableData<T>) => void;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (error: any) => void;
  filterKey?: string;
  searchKey?: string;
  filterTransformer?: (filter: string) => any;
  // React Query v5 specific options
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  retry?: number | boolean;
  refetchInterval?: number;
  refetchIntervalInBackground?: boolean;
  tableId: string;
};

export type TableData<T> = {
  page: number;
  pagesize: number;
  total: number;
  total_pages: number;
  data: T[];
};

// Function to validate filters - only include filters with non-empty values
export const validateFilters = (filtersString: string) => {
  if (!filtersString) return null;

  try {
    const filtersArray = JSON.parse(filtersString);
    if (!Array.isArray(filtersArray)) return null;

    // Filter out items where value is empty, null, or undefined
    const validFilters = filtersArray.filter((filter) => {
      if (!filter) return false;

      // Handle isBetween operator - value should be an array with 2 non-empty values
      if (filter.operator === "isBetween") {
        if (!Array.isArray(filter.value)) return false;
        if (filter.value.length !== 2) return false;

        // Check if both values are not empty
        return filter.value.every(
          (val: any) =>
            val !== null &&
            val !== undefined &&
            val !== "" &&
            String(val).trim() !== ""
        );
      }

      // Handle regular filters - value should not be empty
      return (
        filter.value !== null &&
        filter.value !== undefined &&
        filter.value !== "" &&
        String(filter.value).trim() !== ""
      );
    });

    // Return null if no valid filters, otherwise return the filtered array
    return validFilters.length > 0 ? validFilters : null;
  } catch (error) {
    console.warn("Invalid filters format:", error);
    return null;
  }
};

export function usePaginatedData<T>(options: Options<T>) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const tableSettings = useTableSettings(
    (state) => state.tables?.[options.tableId]
  );
  const defaultPageSize = tableSettings?.pageSize;
  const sorting = tableSettings?.sorting;

  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(defaultPageSize || searchParams.get("pagesize"));
  const sort = sorting || searchParams.get("sort") || "";
  const filters = searchParams.get("filters") || "";
  const search = searchParams.get("search") || "";
  const joinOperator = searchParams.get("joinOperator") || "";

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const {
    url,
    defaultParams = {},
    responseKeys = {},
    errorMessage = "An Error",
    enabled = true,
    staleTime = 0 * 30 * 1000,
    gcTime = 5 * 60 * 1000,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    retry = 3,
    refetchInterval = 2 * 60 * 1000,
    refetchIntervalInBackground = true,
  } = options;

  const {
    dataKey = "data.data",
    totalKey = "data.total",
    totalPagesKey = "data.last_page",
    pageKey = "current_page",
  } = responseKeys;

  const queryKey = useMemo(() => {
    const validFilters = validateFilters(filters);
    return [
      "paginated-data",
      url,
      page,
      pageSize,
      sort,
      validFilters ? JSON.stringify(validFilters) : null,
      search,
      joinOperator,
      defaultParams,
      options.filterKey,
      options.searchKey,
    ];
  }, [
    url,
    page,
    pageSize,
    sort,
    filters,
    search,
    joinOperator,
    defaultParams,
    options.filterKey,
    options.searchKey,
  ]);

  const fetchData = useCallback(async (): Promise<TableData<T>> => {
    const currentOptions = optionsRef.current;

    const params: Record<string, any> = {
      page,
      pagesize: pageSize,
      ...defaultParams,
    };

    if (search) {
      params["search"] = search;
    }

    if (sort) {
      params["sort"] = JSON.stringify(sort);
    }

    if (joinOperator) {
      params["joinOperator"] = joinOperator;
    }

    const validFilters = validateFilters(filters);

    if (validFilters && currentOptions.filterKey) {
      params[currentOptions.filterKey] = currentOptions.filterTransformer
        ? currentOptions.filterTransformer(JSON.stringify(validFilters))
        : JSON.stringify(validFilters);
    } else if (validFilters) {
      params["filters"] = JSON.stringify(validFilters);
    }

    if (currentOptions.searchKey) {
      params[currentOptions.searchKey] = search;
    }

    const res = await import("@/configs/api").then((mod) =>
      mod.Client.admin().get(url, { params })
    );

    const response = res.data;
    const paginationData = extractPaginationData(response, {
      pageKey,
      totalKey,
      totalPagesKey,
    });

    const newData: TableData<T> = {
      page: paginationData.page,
      pagesize: pageSize,
      total: paginationData.total,
      total_pages: paginationData.totalPages,
      data: HandlePathData({ dataKey, response }),
    };

    return newData;
  }, [
    url,
    page,
    pageSize,
    sort,
    filters,
    search,
    joinOperator,
    defaultParams,
    dataKey,
    totalKey,
    pageKey,
    totalPagesKey,
  ]);

  const {
    data: tableData,
    isLoading: loading,
    error,
    refetch,
    isFetching,
    isRefetching,
    dataUpdatedAt,
    isStale,
  } = useQuery({
    queryKey,
    queryFn: fetchData,
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect: true,
    refetchInterval,
    refetchIntervalInBackground,
    retry,
    retryOnMount: true,
  });

  useEffect(() => {
    if (tableData && optionsRef.current.onSuccess) {
      optionsRef.current.onSuccess(tableData);
    }
  }, [tableData]);

  useEffect(() => {
    if (error && optionsRef.current.onError) {
      optionsRef.current.onError(error);
    } else if (error) {
      console.error(errorMessage, error);
    }
  }, [error, errorMessage]);

  const currentLoading = loading || isFetching;
  useEffect(() => {
    if (optionsRef.current.onLoadingChange) {
      optionsRef.current.onLoadingChange(currentLoading);
    }
  }, [currentLoading]);

  const invalidateDataMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["paginated-data", url],
      });
    },
  });

  // Manual refetch function
  const getData = useCallback(
    async (searchParams: Record<string, any> = {}) => {
      if (Object.keys(searchParams).length > 0) {
        await queryClient.invalidateQueries({ queryKey });
      }
      return refetch();
    },
    [refetch, queryClient, queryKey]
  );

  const forceRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["paginated-data", url],
    });
  }, [queryClient, url]);

  const invalidateAfterMutation = useCallback(async () => {
    await invalidateDataMutation.mutateAsync();
  }, [invalidateDataMutation]);

  return {
    page,
    sort,
    filters,
    tableData: tableData || {
      page: 1,
      pagesize: 10,
      total: 0,
      total_pages: 0,
      data: [],
    },
    getData,
    loading: currentLoading,
    pageSize,
    error,
    refetch,
    forceRefresh,
    invalidateAfterMutation,
    isFetching,
    isRefetching,
    isStale,
    dataUpdatedAt,
    queryKey,
  };
}

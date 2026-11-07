import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { Client } from "@/configs/api";

interface MutationOptions<TData = any, TVariables = any> {
  url: string;
  method?: "post" | "put" | "patch" | "delete";
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: AxiosError, variables: TVariables) => void;
  onSettled?: (
    data: TData | undefined,
    error: AxiosError | null,
    variables: TVariables
  ) => void;
  // Error handling
  showErrorToast?: boolean;
  errorMessage?: string;
  // Success handling
  showSuccessToast?: boolean;
  successMessage?: string;
  // Invalidate queries after mutation
  invalidateQueries?: string[];
}

export function useMutationQuery<TData = any, TVariables = any>({
  url,
  method = "post",
  onSuccess,
  onError,
  onSettled,
  showErrorToast = false,
  errorMessage,
  showSuccessToast = false,
  successMessage,
  invalidateQueries,
}: MutationOptions<TData, TVariables>): UseMutationResult<
  TData,
  Error,
  TVariables
> {
  const mutationFn = async (variables: TVariables): Promise<any> => {
    const client = Client.admin();
    const config: any = {};

    // POST, PUT, PATCH, DELETE requests should use request body
    config.data = variables;

    const response = await client[method](url, config.data);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (showSuccessToast) {
        toast.success(successMessage || "Operation completed successfully");
      }
      onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      if (showErrorToast) {
        const errorMsg =
          errorMessage ||
          ((error as AxiosError)?.response?.data as any)?.message ||
          "An error occurred";
        toast.error(errorMsg);
      }
      onError?.(error as AxiosError, variables);
    },
    onSettled: (data, error, variables) => {
      onSettled?.(data, error as AxiosError | null, variables);
    },
  });

  return mutation;
}

// Convenience hooks for specific HTTP methods
export function usePost<TData = any, TVariables = any>(
  url: string,
  options?: Omit<MutationOptions<TData, TVariables>, "url" | "method">
) {
  return useMutationQuery({ url, method: "post", ...options });
}

export function usePut<TData = any, TVariables = any>(
  url: string,
  options?: Omit<MutationOptions<TData, TVariables>, "url" | "method">
) {
  return useMutationQuery({ url, method: "put", ...options });
}

export function usePatch<TData = any, TVariables = any>(
  url: string,
  options?: Omit<MutationOptions<TData, TVariables>, "url" | "method">
) {
  return useMutationQuery({ url, method: "patch", ...options });
}

export function useDelete<TData = any, TVariables = any>({
  url,
  options,
}: {
  url: string;
  options?: Omit<MutationOptions<TData, TVariables>, "url" | "method">;
}) {
  return useMutationQuery({ url, method: "delete", ...options });
}

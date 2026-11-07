import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocale } from "next-intl";
import { toast } from "sonner";

import { Client } from "@/configs/api";

type Method = "post" | "put" | "patch" | "delete";

interface OptimisticUpdateConfig<TVariables> {
  queryKey: any[];
  updater: (oldData: any, variables: TVariables) => any;
}

interface CrudMutationOptions<TData = any, TVariables = any> {
  url: string;
  method: Method;
  optimisticUpdate?: OptimisticUpdateConfig<TVariables>;
  invalidateQueries?: string[];
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: AxiosError, variables: TVariables) => void;
}

export function useCrudMutation<TData = any, TVariables = any>({
  url,
  method,
  optimisticUpdate,
  invalidateQueries = [],
  successMessage,
  errorMessage,
  onSuccess,
  onError,
}: CrudMutationOptions<TData, TVariables>): UseMutationResult<
  TData,
  AxiosError,
  TVariables
> {
  const queryClient = useQueryClient();
  const locale = useLocale();

  const mutationFn = async (variables: TVariables): Promise<TData> => {
    const config = { headers: { "Accept-Language": locale } };

    if (method === "delete") {
      const res = await Client.admin()[method](url, {
        params: { id: variables },
      });
      return res.data;
    } else {
      const res = await Client.admin()[method](url, variables, config);
      return res.data;
    }
  };

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      if (optimisticUpdate) {
        console.log("optimisticUpdate", optimisticUpdate);

        await queryClient.cancelQueries({
          queryKey: optimisticUpdate.queryKey,
        });
        const previousData = queryClient.getQueryData(
          optimisticUpdate.queryKey
        );

        console.log("previousData", previousData);

        queryClient.setQueryData(optimisticUpdate.queryKey, (oldData: any) =>
          optimisticUpdate.updater(oldData, variables)
        );
        return { previousData };
      }
    },
    onError: (error, variables, context) => {
      if (optimisticUpdate && context?.previousData) {
        queryClient.setQueryData(
          optimisticUpdate.queryKey,
          context.previousData
        );
      }
      toast.error(errorMessage || "An error occurred");
      onError?.(error, variables);
    },
    onSuccess: (data, variables) => {
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });
      toast.success(successMessage || "Operation completed successfully");
      onSuccess?.(data, variables);
    },
  });
}

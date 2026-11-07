import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";

export const useFormHandler = ({
  actionFunction,
  formHooks,
  onSuccess,
  onError,
}: {
  actionFunction: (prevState: any, formData: any) => Promise<any>;
  formHooks: any;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}) => {
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async (prevState: any, formData: any) =>
      await actionFunction(prevState, formData),
    { success: false, message: "", isSend: false }
  );

  const handleSubmit = async (data: any) => {
    await startTransition(async () => {
      await action(data);
    });
  };

  useEffect(() => {
    if (state) {
      if (state?.success) {
        onSuccess?.();
        formHooks.reset({});
        router.refresh();
      } else if (state?.success === false && state?.isSend) {
        onError?.(state?.message || "An error occurred");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return { state, handleSubmit, isPending };
};

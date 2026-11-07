import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState, useTransition } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import { Trash } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { z } from "zod";

import { Table } from "@/components/table/table";
import { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import {
  TableDialogFieldProps,
  TableDialogField_GetColumns,
  handleGetDataType,
} from "../../types/all-fields";
import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";

const valueSchema = z
  .object({
    title: z.string(),
    subtitle: z.string().optional(),
    id: z.number().or(z.string()),
    meta: z.any().optional(),
  })
  .array();
export type TableDialogFieldValuesType = z.infer<typeof valueSchema>;

export default function TableDialogField<T>({
  control,
  name,
  containerClassName,
  errorClassName,
  label,
  labelClassName,
  onChange: customOnChange,
  required,
  handleGetData,
  getColumns,
  CustomActions,
  CustomTitle,
}: TableDialogFieldProps<T>) {
  const t = useTranslations();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const parsedValue = valueSchema.safeParse(value).data || [];

        const handleDelete = (index: number) => {
          const newValue = parsedValue.filter((item, i) => i !== index);
          onChange(newValue);
          customOnChange?.(newValue);
        };

        const handleAdd = (item: TableDialogFieldValuesType[number]) => {
          const newValue = [...parsedValue, item];
          onChange(newValue);
          customOnChange?.(newValue);
        };

        return (
          <div className={cn("col-span-12", containerClassName)}>
            <div
              className={cn("rounded-md border p-2", {
                "border-red-500": !!error,
                "border-gray-300": !error,
              })}
            >
              {error && (
                <span
                  className={cn(
                    "-bottom-6 text-sm text-red-500",
                    errorClassName
                  )}
                >
                  {error.message}
                </span>
              )}
              <div className="flex flex-row justify-between border-b border-gray-300 py-2">
                <label
                  htmlFor={name}
                  className={cn(
                    "mb-1 block text-base font-medium text-gray-700",
                    labelClassName
                  )}
                >
                  {label || name}
                  {required && <span className="ml-1 text-red-500">{"*"}</span>}
                </label>
                <FieldDialog
                  selectedRows={parsedValue}
                  handleAdd={handleAdd}
                  handleDelete={handleDelete}
                  handleGetData={handleGetData}
                  getColumns={getColumns}
                />
              </div>
              <div className="h-96 overflow-y-scroll">
                {!parsedValue.length && (
                  <div className="col-span-2 flex h-96 items-center justify-center">
                    <p>{t("there is no selected values")}</p>
                  </div>
                )}
                {parsedValue.map((item, index) => {
                  return (
                    <div
                      className={cn("flex items-center justify-stretch", {
                        "border-b border-gray-100":
                          index !== parsedValue.length - 1,
                      })}
                      key={item.id}
                    >
                      <div className="flex flex-1 gap-3 p-4">
                        <span className="text-sm text-gray-300">{`${index + 1} . `}</span>
                        <div>
                          <p>{item.title}</p>
                          {CustomTitle ? (
                            <CustomTitle item={item} />
                          ) : (
                            <p className="text-xs text-gray-600">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        {CustomActions && (
                          <CustomActions
                            onChange={onChange}
                            item={item}
                            parsedValue={parsedValue}
                            index={index}
                          />
                        )}
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          onClick={() => handleDelete(index)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

function FieldDialog({
  handleAdd,
  handleDelete,
  selectedRows,
  handleGetData,
  getColumns,
}: {
  handleAdd: (item: TableDialogFieldValuesType[number]) => void;
  handleDelete: (index: number) => void;
  selectedRows: TableDialogFieldValuesType;
  handleGetData: handleGetDataType;
  getColumns: TableDialogField_GetColumns;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, startTransition] = useTransition();
  const locale = useLocale() as Locale;

  useEffect(() => {
    startTransition(() => {
      handleGetData({ setData, setPageCount, searchParams });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <Fragment>
      <Button
        variant="outline"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {t("Add")}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-4xl px-4 py-2">
          <div className="mt-0 flex justify-start border-b border-gray-300 pb-4 pt-0">
            <DialogTitle className="text-lg font-semibold">
              {t("Add")}
            </DialogTitle>
          </div>
          <div className="w-full overflow-hidden p-2">
            <Table<any>
              data={data}
              isLoading={isLoading}
              pageCount={pageCount}
              getColumns={getColumns({ handleAdd, handleDelete, selectedRows })}
              refetch={() => {
                startTransition(() => {
                  handleGetData({ setData, setPageCount, searchParams });
                });
              }}
              shallow
            />
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

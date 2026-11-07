import { Locale } from "@/i18n/routing";
import { GetSchema } from "@/lib/validations";
import { createQueryParams } from "@/components/table/utils/query-params";

import ExampleTableClient from "./example-table-client";
import { getExampleData } from "./get-example-data";

interface ExampleTableServerProps {
  locale: Locale;
  search: GetSchema;
}

export default async function ExampleTableServer({
  locale,
  search,
}: ExampleTableServerProps) {
  const _params: { [key: string]: any } = createQueryParams(search);

  const response = await getExampleData({ _params });

  return (
    <ExampleTableClient
      locale={locale}
      data={response}
      pageCount={response?.length}
    />
  );
}

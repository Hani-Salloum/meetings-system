import { OptionalGetSchema } from "../../lib/validations";

export const getExampleData = async ({
  _params,
}: {
  _params?: OptionalGetSchema;
}) => {
  console.log(_params);

  return [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      is_active: true,
      email: "john.doe@example.com",
      phone: "+1234567890",
      gender: "MALE",
      type: {
        id: 1,
        type_name: "Type1",
        type_description: "Type1 Description",
      },
      created_at: "2021-01-01",
      address: [
        {
          id: 1,
          address: "Addr1",
          sub_address: [
            {
              id: 1,
              address: "SubAddr1",
            },
            {
              id: 2,
              address: "SubAddr2",
            },
          ],
        },
        {
          id: 2,
          address: "Addr2",
          sub_address: [
            {
              id: 1,
              address: "SubAddr1",
            },
            {
              id: 2,
              address: "SubAddr2",
            },
          ],
        },
      ],
    },
  ];
};

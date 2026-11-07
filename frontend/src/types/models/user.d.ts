interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_types: {
    id: number;
    name: string;
    permissions: {
      id: number;
      en_name: string;
      code: string;
    }[];
  }[];
}

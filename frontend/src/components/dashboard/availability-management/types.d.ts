export interface EmployeeAvailability {
  id: number;
  week_day: string;
  day_parts: string[];
  created_at: string;
  updated_at: string;
}

export interface UserData {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    language: string;
  };
  employeesAvailability: EmployeeAvailability[];
}
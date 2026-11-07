export interface User {
  id: number;
  first_name: string;
  last_name: string;
}

export interface AvailabilityData {
  id: number;
  user_id: number;
  week_day: string;
  day_parts: string[];
  created_at: string;
  updated_at: string;
}

export interface SelectedEmployee {
  employee_id: number;
  required: boolean;
}

export interface Group {
  employees: SelectedEmployee[];
}
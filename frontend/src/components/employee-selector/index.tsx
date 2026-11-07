"use client";

import React, { useState } from "react";

import AvailabilityDisplay from "./availability-display";
import SearchEmployees from "./search-with-tags";
import { AvailabilityData, Group, SelectedEmployee, User } from "./types";

interface EmployeeSelectorProps {
  users: User[];
  availabilityData: AvailabilityData[];
  initialSelected: SelectedEmployee[];
  readOnly?: boolean;
  onChange: (selected: SelectedEmployee[]) => void;
}

const EmployeeSelector = ({
  users,
  availabilityData,
  initialSelected,
  readOnly = false,
  onChange,
}: EmployeeSelectorProps) => {
  const [selected, setSelected] = useState<SelectedEmployee[]>(
    initialSelected || []
  );

  const handleChangeEmployeeSelection = (val: SelectedEmployee[]) => {
    setSelected(val);
    onChange(val);
  };

  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white py-4 px-6">
      <SearchEmployees
        users={users}
        initialSelected={initialSelected}
        onChangeSelection={handleChangeEmployeeSelection}
        readOnly={readOnly}
      />

      <AvailabilityDisplay
        selected={selected}
        availabilityData={availabilityData}
      />
    </div>
  );
};

export default EmployeeSelector;

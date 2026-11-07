import { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import EmployeeSelector from ".";
import { AvailabilityData, Group, SelectedEmployee, User } from "./types";

interface EmployeeSelectorGroupsProps {
  users: User[];
  availabilityData: AvailabilityData[];
  initialSelected?: Group[];
  readOnly?: boolean;
  onChange: (groups: Group[]) => void;
}

export default function EmployeeSelectorGroups({
  users,
  availabilityData,
  initialSelected = [{ employees: [] }],
  readOnly,
  onChange,
}: EmployeeSelectorGroupsProps) {
  const t = useTranslations();

  const [groups, setGroups] = useState<Group[]>(
    initialSelected || [{ employees: [] }]
  );

  const addGroup = () => {
    const newGroup: Group = {
      employees: [],
    };
    const newGroups = [...groups, newGroup]
    setGroups(newGroups);
    onChange(newGroups);
  };

  const removeGroup = (index: number) => {
    if (groups.length === 1) return;
    const newGroups = groups.filter((_, i) => i !== index)
    setGroups(newGroups);
    onChange(newGroups)
  };

  const handleGroupChange = (index: number, selected: SelectedEmployee[]) => {
    const newGroups = groups.map((g, i) =>
      i === index ? { ...g, employees: selected } : g
    );
    setGroups(newGroups);
    onChange(newGroups)
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-bold">{t("Employee Groups")}</h1>
        <button
          onClick={addGroup}
          className="rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          + {t("Add Group")}
        </button>
      </div>
      {groups.map((group, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-white py-4 shadow-md"
        >
          <div className="mb-0 flex items-center justify-between">
            <h2 className="px-4 text-xl font-semibold text-gray-800">
              {t("Group")} {index + 1}
            </h2>
            <button
              onClick={() => removeGroup(index)}
              disabled={groups.length === 1}
              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
              title="Remove group"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <EmployeeSelector
            readOnly={readOnly}
            users={users}
            availabilityData={availabilityData}
            initialSelected={group.employees}
            onChange={(selected) => handleGroupChange(index, selected)}
          />
        </div>
      ))}
    </div>
  );
}

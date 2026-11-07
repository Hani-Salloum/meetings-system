import { useMemo, useState } from "react";
import { Search, Star, X } from "lucide-react";
import { SelectedEmployee, User } from "./types";
import { useTranslations } from "next-intl";

interface SearchEmployeesProps {
  readOnly?: boolean;
  initialSelected?: SelectedEmployee[];
  users: User[];
  onChangeSelection: (selected: SelectedEmployee[]) => void;
}

const SearchEmployees = ({
  users,
  readOnly,
  onChangeSelection,
  initialSelected,
}: SearchEmployeesProps) => {
  const t = useTranslations()

  const [selected, setSelected] = useState<SelectedEmployee[]>(
    initialSelected || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const availableUsers = useMemo(() => {
    const selectedIds = selected.map((s) => s.employee_id);
    return users.filter((u) => !selectedIds.includes(u.id));
  }, [users, selected]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return availableUsers;
    const query = searchQuery.toLowerCase();
    return availableUsers.filter((u) =>
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(query)
    );
  }, [availableUsers, searchQuery]);

  const selectedUsers = useMemo(() => {
    return selected.map((s) => ({
      ...s,
      user: users.find((u) => u.id === s.employee_id)!,
    }));
  }, [selected, users]);

  const addUser = (userId: number) => {
    const newSelected = [...selected, { employee_id: userId, required: false }];
    setSelected(newSelected);
    onChangeSelection(newSelected);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const removeUser = (userId: number) => {
    if (selected.length === 1) return;
    const newSelected = selected.filter((s) => s.employee_id !== userId);
    setSelected(newSelected);
    onChangeSelection(newSelected);
  };

  const toggleRequired = (userId: number) => {
    const newSelected = selected.map((s) =>
      s.employee_id === userId ? { ...s, required: !s.required } : s
    );
    setSelected(newSelected);
    onChangeSelection(newSelected);
  };
  return (
    <div className="border-b border-b-[#444] bg-white px-4 pb-4">
      <div className="relative">
        {!readOnly && (
          <div className="flex items-center gap-2 rounded-lg border-2 border-gray-300 px-3 py-2 transition-colors focus-within:border-blue-500">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("Search employees")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              className="flex-1 !bg-white text-sm outline-none"
            />
          </div>
        )}

        {isSearchOpen && filteredUsers.length > 0 && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsSearchOpen(false)}
            />
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => addUser(user.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white">
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.first_name} {user.last_name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <div className="mb-2 text-xs font-semibold text-gray-500">
          SELECTED ({selected.length})
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map(({ employee_id, required, user }) => (
            <div
              key={employee_id}
              className="flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 py-1.5 pl-3 pr-2"
            >
              <span className="text-sm font-medium text-gray-700">
                {user.first_name} {user.last_name}
              </span>
              <button
                onClick={() => !readOnly && toggleRequired(employee_id)}
                className={`rounded-full p-1 transition-colors ${
                  required
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                }`}
                title={required ? "Required" : "Mark as required"}
              >
                <Star
                  className="h-3 w-3"
                  fill={required ? "currentColor" : "none"}
                />
              </button>
              {!readOnly && (
                <button
                  onClick={() => removeUser(employee_id)}
                  disabled={selected.length === 1}
                  className="rounded-full p-1 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchEmployees;

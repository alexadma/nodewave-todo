"use client";

import { Search } from "lucide-react";
import { TodoFilters as Filters } from "@/types/todo.types";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function TodoFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-1 gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-300 focus:bg-white transition-colors"
        />
      </div>
      <Select
        value={filters.isDone === true ? "done" : filters.isDone === false ? "pending" : "all"}
        onValueChange={(v) =>
          onChange({
            ...filters,
            isDone: v === "all" ? "" : v === "done" ? true : false,
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-32 text-sm bg-gray-50 border-gray-200">
          <SelectValue placeholder="All status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
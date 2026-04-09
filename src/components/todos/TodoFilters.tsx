"use client";

import { TodoFilters as Filters } from "@/types/todo.types";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function TodoFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input
        placeholder="Cari todo..."
        value={filters.search ?? ""}
        onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
        className="sm:max-w-xs"
      />
      <Select
        value={filters.status ?? ""}
        onValueChange={(v) =>
          onChange({ ...filters, status: v as Filters["status"], page: 1 })
        }
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Semua</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="done">Selesai</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
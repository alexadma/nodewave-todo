"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { todoService } from "@/services/todo.service";
import { TodoCard } from "@/components/todos/TodoCard";
import { TodoFilters } from "@/components/todos/TodoFilters";
import { CreateTodoDialog } from "@/components/todos/CreateTodoDialog";
import { Calendar } from "@/components/todos/Calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TodoFilters as TF } from "@/types/todo.types";
import { Plus, ClipboardList, X } from "lucide-react";
import { Todo } from "@/types/todo.types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function TodosPage() {
  const [filters, setFilters] = useState<TF>({ page: 1, limit: 10 });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";
  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  // Merge date filter into filters
  const effectiveFilters = {
    ...filters,
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["todos", effectiveFilters, isAdmin],
    queryFn: () => isAdmin
      ? todoService.getAllAdmin(effectiveFilters)
      : todoService.getAll(effectiveFilters),
  });

  const doneCount = data?.entries.filter((t: Todo) => t.isDone).length ?? 0;
  const totalCount = data?.entries.length ?? 0;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isAdmin
            ? "Viewing all todos as admin"
            : doneCount === totalCount && totalCount > 0
              ? "All tasks done! Great work today."
              : `You have ${totalCount - doneCount} task${totalCount - doneCount !== 1 ? "s" : ""} remaining`}
        </p>
      </div>

      {/* Calendar */}
      <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />

      {/* Progress bar */}
      {!isAdmin && totalCount > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progress today</span>
            <span>{doneCount} / {totalCount} done</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Active date filter indicator */}
      {selectedDate && (
        <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 rounded-lg px-3 py-2">
          <span className="font-medium">
            Filter: {format(selectedDate, "d MMMM yyyy", { locale: id })}
          </span>
          <button
            onClick={() => setSelectedDate(null)}
            className="ml-auto p-0.5 rounded hover:bg-indigo-100 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        <TodoFilters filters={filters} onChange={setFilters} />
        {!isAdmin && (
          <CreateTodoDialog />
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : data?.entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ClipboardList className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">No tasks yet</p>
          <p className="text-sm text-gray-400 mt-1">
            {selectedDate
              ? "Tidak ada task pada tanggal ini"
              : "Start by adding your first task"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {data?.entries.map((todo: Todo) => (
            <TodoCard key={todo.id} todo={todo} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPage > 1 && (
        <div className="flex justify-center items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === 1}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-400">
            {filters.page} / {data.totalPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === data.totalPage}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
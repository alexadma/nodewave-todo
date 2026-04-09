"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { TodoCard } from "@/components/todos/TodoCard";
import { TodoFilters } from "@/components/todos/TodoFilters";
import { CreateTodoDialog } from "@/components/todos/CreateTodoDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TodoFilters as TF } from "@/types/todo.types";

export default function TodosPage() {
  const [filters, setFilters] = useState<TF>({ page: 1, limit: 10 });
  const { data, isLoading } = useTodos(filters);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <CreateTodoDialog />
      </div>

      <TodoFilters filters={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : data?.entries.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">
          Belum ada todo. Mulai tambahkan!
        </p>
      ) : (
        <div className="space-y-3">
          {data?.entries.map((todo) => <TodoCard key={todo.id} todo={todo} />)}
        </div>
      )}

      {data && data.totalPage > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === 1}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
          >
            Sebelumnya
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Halaman {filters.page} / {data.totalPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === data.totalPage}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  );
}
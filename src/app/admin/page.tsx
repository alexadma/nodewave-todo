"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { TodoFilters } from "@/components/todos/TodoFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TodoFilters as TF, TodoListResponse } from "@/types/todo.types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { todoService } from "@/services/todo.service";

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [filters, setFilters] = useState<TF>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useQuery<TodoListResponse>({
    queryKey: ["admin-todos", filters],
    queryFn: () => todoService.getAllAdmin(filters),
  });

  // ✅ Proteksi admin
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/todos");
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold">Admin — Semua Todo</h1>

      {/* Filters */}
      <TodoFilters filters={filters} onChange={setFilters} />

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : data?.entries.length === 0 ? (
        // ✅ Empty state
        <div className="text-center py-16 text-gray-400">
          Tidak ada data todo
        </div>
      ) : (
        // ✅ Table
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Judul</th>
                <th className="text-left p-3 font-medium">User</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Dibuat</th>
              </tr>
            </thead>

            <tbody>
              {data.entries.map((todo) => (
                <tr
                  key={todo.id}
                  className="border-t hover:bg-muted/50 transition"
                >
                  <td className="p-3">{todo.item}</td>

                  <td className="p-3 text-muted-foreground">
                    {todo.user?.fullName ?? todo.userId ?? "-"}
                  </td>

                  <td className="p-3">
                    <Badge
                      variant={todo.isDone ? "secondary" : "default"}
                    >
                      {todo.isDone ? "Selesai" : "Pending"}
                    </Badge>
                  </td>

                  <td className="p-3 text-muted-foreground">
                    {format(
                      new Date(todo.createdAt),
                      "dd MMM yyyy",
                      { locale: id }
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
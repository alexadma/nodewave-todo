"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTodos } from "@/hooks/useTodos";
import { TodoFilters } from "@/components/todos/TodoFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TodoFilters as TF } from "@/types/todo.types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [filters, setFilters] = useState<TF>({ page: 1, limit: 10 });
  const { data, isLoading } = useTodos(filters);

  useEffect(() => {
    if (!user || user.role !== "admin") router.push("/todos");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin — Semua Todo</h1>

      <TodoFilters filters={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
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
              {data?.data.map((todo) => (
                <tr key={todo.id} className="border-t hover:bg-muted/50">
                  <td className="p-3">{todo.title}</td>
                  <td className="p-3 text-muted-foreground">{todo.userId}</td>
                  <td className="p-3">
                    <Badge variant={todo.status === "done" ? "secondary" : "default"}>
                      {todo.status === "done" ? "Selesai" : "Pending"}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {format(new Date(todo.createdAt), "dd MMM yyyy", { locale: id })}
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
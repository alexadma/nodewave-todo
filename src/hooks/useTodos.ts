import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { todoService } from "@/services/todo.service";
import { TodoFilters } from "@/types/todo.types";

export const TODO_KEYS = {
  all: ["todos"] as const,
  list: (filters: TodoFilters) => [...TODO_KEYS.all, filters] as const,
};

// ✅ GET TODOS
export const useTodos = (filters: TodoFilters = {}) =>
  useQuery({
    queryKey: TODO_KEYS.list(filters),
    queryFn: () => todoService.getAll(filters),
  });

// ✅ CREATE
export const useCreateTodo = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: todoService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TODO_KEYS.all });
      toast.success("Todo berhasil dibuat!");
    },
    onError: () => toast.error("Gagal membuat todo"),
  });
};

// ✅ TOGGLE (OPTIMISTIC UPDATE)
export const useToggleTodo = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      todoService.toggleStatus(id, isDone),

    onMutate: async ({ id, isDone }) => {
      await qc.cancelQueries({ queryKey: TODO_KEYS.all });

      const previous = qc.getQueriesData({ queryKey: TODO_KEYS.all });

      qc.setQueriesData({ queryKey: TODO_KEYS.all }, (old: any) => {
        if (!old?.entries) return old;

        return {
          ...old,
          entries: old.entries.map((t: any) =>
            t.id === id ? { ...t, isDone } : t
          ),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
      toast.error("Gagal update status");
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TODO_KEYS.all });
    },
  });
};

// ✅ DELETE
export const useDeleteTodo = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: todoService.deleteTodo, // ✅ FIXED
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TODO_KEYS.all });
      toast.success("Todo dihapus");
    },
    onError: () => toast.error("Gagal menghapus todo"),
  });
};
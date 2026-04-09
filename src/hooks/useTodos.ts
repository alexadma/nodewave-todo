import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { todoService } from "@/services/todo.service";
import { TodoFilters } from "@/types/todo.types";

export const TODO_KEYS = {
  all: ["todos"] as const,
  list: (filters: TodoFilters) => [...TODO_KEYS.all, filters] as const,
};

export const useTodos = (filters: TodoFilters = {}) =>
  useQuery({
    queryKey: TODO_KEYS.list(filters),
    queryFn: () => todoService.getAll(filters),
  });

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

export const useToggleTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      todoService.toggleStatus(id, isDone),
    onSuccess: () => qc.invalidateQueries({ queryKey: TODO_KEYS.all }),
    onError: () => toast.error("Gagal mengubah status"),
  });
};

export const useDeleteTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: todoService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TODO_KEYS.all });
      toast.success("Todo dihapus");
    },
    onError: () => toast.error("Gagal menghapus todo"),
  });
};
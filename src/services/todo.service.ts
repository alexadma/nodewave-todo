import { axiosInstance } from "@/lib/axios";
import { Todo, TodoListResponse, CreateTodoPayload, TodoFilters } from "@/types/todo.types";

export const todoService = {
  getAll: async (filters: TodoFilters = {}): Promise<TodoListResponse> => {
    const { data } = await axiosInstance.get("/todos", { params: filters });
    return data.content;
  },

  create: async (payload: CreateTodoPayload): Promise<Todo> => {
    const { data } = await axiosInstance.post("/todos", payload);
    return data.content;
  },

  toggleStatus: async (id: string, isDone: boolean): Promise<Todo> => {
    const { data } = await axiosInstance.patch(`/todos/${id}`, { isDone });
    return data.content;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/todos/${id}`);
  },

  getAllAdmin: async (filters: TodoFilters = {}): Promise<TodoListResponse> => {
    const { data } = await axiosInstance.get("/admin/todos", { params: filters });
    return data.content;
  },
};
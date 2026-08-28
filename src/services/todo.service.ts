import { axiosInstance } from "@/lib/axios";
import { TodoFilters, TodoListResponse, Todo, CreateTodoPayload } from "@/types/todo.types";

export interface TodoDateInfo {
  total: number;
  done: number;
}

export interface TodoDatesResponse {
  dates: Record<string, TodoDateInfo>;
}

export const todoService = {
  // ✅ GET TODOS
  getAll: async (filters: TodoFilters = {}): Promise<TodoListResponse> => {
    const { data } = await axiosInstance.get("/todos", {
      params: filters,
    });

    return {
      ...data.content,
      entries: data.content.entries.map((t: any) => ({
        ...t,
        isDone: t.is_done,
      })),
    };
  },

  // ✅ CREATE
  create: async (payload: CreateTodoPayload): Promise<Todo> => {
    const { data } = await axiosInstance.post("/todos", payload);

    return {
      ...data.content,
      isDone: data.content.is_done,
    };
  },

  // ✅ TOGGLE
  toggleStatus: async (id: string, isDone: boolean): Promise<Todo> => {
    const { data } = await axiosInstance.put(`/todos/${id}`, {
      is_done: isDone,
    });

    return {
      ...data.content,
      isDone: data.content.is_done,
    };
  },

  // ✅ DELETE (FIXED NAME)
  deleteTodo: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/todos/${id}`);
  },

  // ✅ ADMIN
  getAllAdmin: async (filters: TodoFilters = {}): Promise<TodoListResponse> => {
    const { data } = await axiosInstance.get("/todos", {
      params: { ...filters, all: true },
    });

    return {
      ...data.content,
      entries: data.content.entries.map((t: any) => ({
        ...t,
        isDone: t.is_done,
      })),
    };
  },

  // ✅ GET DATES (for calendar dots)
  getDates: async (month: string, all = false): Promise<TodoDatesResponse> => {
    const { data } = await axiosInstance.get("/todos/dates", {
      params: { month, all },
    });
    return data;
  },
};
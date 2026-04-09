export type TodoStatus = "pending" | "done";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoListResponse {
  data: Todo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
}

export interface TodoFilters {
  status?: TodoStatus | "";
  search?: string;
  page?: number;
  limit?: number;
}
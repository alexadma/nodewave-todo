export interface Todo {
  id: string;
  item: string;        // bukan title
  userId: string;
  isDone: boolean;     // bukan status
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface TodoListResponse {
  entries: Todo[];
  totalData: number;
  totalPage: number;
}

export interface CreateTodoPayload {
  item: string;        // bukan title
}

export interface TodoFilters {
  isDone?: boolean | "";
  search?: string;
  page?: number;
  limit?: number;
}
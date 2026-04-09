import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(100),
  description: z.string().max(500).optional(),
});

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>;
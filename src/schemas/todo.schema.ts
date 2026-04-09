import { z } from "zod";

export const createTodoSchema = z.object({
  item: z.string().min(1, "Todo wajib diisi").max(200),
});

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>;
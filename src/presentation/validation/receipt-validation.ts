import { z } from "zod";

export const receiptScheme = z.object({
  name: z.string(),
  groceries: z.array(z.object({
    id: z.string(),
    quantity: z.number()
  })),
});
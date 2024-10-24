import { z } from "zod";

// Validasi untuk schedule yang akan divalidasi
export const scheduleScheme = z.object({
  name: z.string(),
  receipts: z.array(z.string()),
});

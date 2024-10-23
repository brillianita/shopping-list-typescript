import {z} from "zod";

export const groceryScheme = z.object({
  name: z.string(),
  unit:z.string(),
  price: z.number()
});
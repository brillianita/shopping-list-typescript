import {z} from "zod";

export const groceryCreateScheme = z.object({
  name: z.string(),
  unit:z.string(),
  price: z.number()
})
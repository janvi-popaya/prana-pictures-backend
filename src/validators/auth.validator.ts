import * as z from "zod";

export const loginSchema = z.strictObject({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(8).max(128),
});

import { z } from "zod";

export const publicTokenSchema = z.object({
  token: z.string().min(10),
});

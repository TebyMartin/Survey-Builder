import { z } from "zod";

export const assignUsersSchema = z.object({
  surveyId: z.string().uuid(),
  userIds: z.array(z.string().uuid()).min(1),
});

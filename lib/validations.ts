import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be atleast 5 characters" })
    .max(130),

  description: z.string().min(100, {
    message: "Description too short, add atleast 100 characters",
  }),

  tags: z
    .array(z.string().min(1).max(15))
    .min(1, { message: "Add a minimum of 1 tag related to the question" })
    .max(3),
});

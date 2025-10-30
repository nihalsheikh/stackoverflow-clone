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

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const ProfileSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters").max(50),
  username: z.string().min(5, "Username must be at least 5 characters").max(50),
  portfolioWebsite: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .min(5, "Location must be at least 5 characters")
    .max(50)
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(150)
    .optional()
    .or(z.literal("")),
});

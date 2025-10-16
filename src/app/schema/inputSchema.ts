import { z } from "zod";

export const inputSchema = z.object({
  words: z
    .string()
    .min(1, { message: "単語を入力してください" })
    .max(30, { message: "単語は30文字以内にしてください" }),
});

export type InputSchemaType = z.infer<typeof inputSchema>;

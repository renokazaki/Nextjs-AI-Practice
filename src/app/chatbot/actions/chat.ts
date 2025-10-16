"use server";
import { gemini } from "../../lib/gemini";

export async function submitChat(userMessage: string) {
  const response = await gemini.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant. Please respond in Japanese.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });
  return response.choices[0].message;
}

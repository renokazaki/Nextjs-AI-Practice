import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = await streamText({
    model: google("gemini-2.5-flash"),
    system: "あなたはフレンドリーなアシスタントです。",
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

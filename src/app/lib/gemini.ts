import OpenAI from "openai";
import { OpenAIChatCompletionsModel } from "@openai/agents";

export const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// agentsでdefaultでgeminiを使うために必要な設定
// Gemini用のモデルを設定
// chatbotで使う文には上記のgeminiをそのまま呼び出すだけで良いが、(OpenAIでnewされているのは共通の規格を使っているかららしい)
// 恐らくopenAIのエージェントを使う場合はこのgeminiModelを別途設定する必要がある。
export const geminiModel = new OpenAIChatCompletionsModel(
  gemini,
  "gemini-2.0-flash"
);

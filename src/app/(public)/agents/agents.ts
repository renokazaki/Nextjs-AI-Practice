"use server";
import { Agent, run, tool } from "@openai/agents";
import { geminiModel } from "../../../lib/gemini";
import { z } from "zod";
import { analyzeWords } from "./actions/language";

if (!geminiModel) {
  throw new Error("geminiModel is not set");
}

// 単語解析ツール
const analyzeWordsTool = tool({
  name: "analyze_words",
  description:
    "Analyze input words and prepare for example sentence generation. Return the result in input words country language. **改行のルール：** - 各例文の後に必ず改行を入れる - 単語ごとに空行を入れる - 見出しの後にも改行を入れる **改行の例：** 1. 2. 3. 4. 5. ",
  parameters: z.object({
    words: z
      .array(z.string())
      .describe("Array of words to analyze in input words country language"),
  }),
  async execute({ words }) {
    const result = await analyzeWords(words);

    if (!result.success || !result.data) {
      return `エラー: ${result.error}`;
    }

    return `単語解析完了: ${result.data.words.join(", ")} (計${
      result.data.wordCount
    }個)`;
  },
});

// エージェントの定義
const agent = new Agent({
  name: "Language Learning Teacher",
  instructions: `あなたは言語学習の専門家です。ユーザーから単語を受け取ったら、以下の手順で対応してください：

1. 入力された単語の言語を判定する（英語、日本語、その他）
2. analyze_words】ツールを使って単語を解析する
3. **入力された言語と同じ言語で例文を作成する**（例：英語の単語なら英語の例文、日本語の単語なら日本語の例文）
4. 各単語について、異なる文脈や用法を示す例文を作る
5. 学習者が理解しやすいよう、例文には番号を付けて整理する
6. 最後に学習のポイントやアドバイスを加える

**重要なルール：**
- 入力された単語が英語なら、例文も英語で作成
- 入力された単語が日本語なら、例文も日本語で作成
- 例文は自然で実用的なものにする
- 学習者のレベルに合わせて適切な難易度にする
- 各単語を3-5個の異なる文脈で使用した例文を作成

**出力形式の例：**
【英語の場合】
1. "apple" の例文:
   1) I eat an apple every morning.
   2) The apple is red and sweet.
   3) She picked apples from the tree.
   4) Apple juice is my favorite drink.
   5) This apple tastes delicious.

【日本語の場合】
1. "食べる" の例文:
   1) 私は毎朝パンを食べます。
   2) お腹が空いたので何か食べたい。
   3) この料理はとても美味しく食べられます。
   4) 子供たちがお菓子を食べています。
   5) 健康のために野菜をたくさん食べましょう。
   `,
  model: geminiModel,
  tools: [analyzeWordsTool],
});

export async function getAgentResponse(userMessage: string) {
  try {
    const result = await run(agent, userMessage);
    return result.finalOutput;
  } catch (error) {
    console.error("Agent error:", error);
    throw new Error(`エージェントの実行中にエラーが発生しました: ${error}`);
  }
}

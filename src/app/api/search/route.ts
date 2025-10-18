import { experimental_createMCPClient, generateText } from "ai";
import { google } from "@ai-sdk/google";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function POST(req: Request) {
  let mcpClient;

  try {
    const { query } = await req.json();

    if (!query) {
      return Response.json({ error: "クエリが必要です" }, { status: 400 });
    }

    // ✅ デバッグ: APIキーを確認
    console.log("TAVILY_API_KEY exists:", !!process.env.TAVILY_API_KEY);
    console.log(
      "TAVILY_API_KEY first 10 chars:",
      process.env.TAVILY_API_KEY?.substring(0, 10)
    );

    // ✅ URLパラメータ方式に変更（より確実）
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    if (!tavilyApiKey) {
      throw new Error("TAVILY_API_KEY is not set");
    }

    const mcpUrl = new URL(
      `https://mcp.tavily.com/mcp/?tavilyApiKey=${tavilyApiKey}`
    );

    mcpClient = await experimental_createMCPClient({
      transport: new StreamableHTTPClientTransport(mcpUrl),
    });
    // MCPサーバーからツールを取得
    const tools = await mcpClient.tools();
    console.log("tools", tools);
    // Gemini 2.5 Flashでテキスト生成
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      tools,
      system:
        "あなたは親切なアシスタントです。ユーザーの質問に答えるために、必要に応じてウェブ検索ツールを使用してください。検索結果を元に、わかりやすく日本語で回答してください。",
      prompt: query,
    });

    return Response.json({
      text: result.text,
      toolCalls: result.toolCalls,
      toolResults: result.toolResults,
    });
  } catch (error) {
    console.error("検索エラー:", error);
    return Response.json(
      {
        error: "検索に失敗しました",
        details: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 }
    );
  } finally {
    // 必ずクライアントを閉じる
    if (mcpClient) {
      try {
        await mcpClient.close();
      } catch (closeError) {
        console.error("MCPクライアントのクローズエラー:", closeError);
      }
    }
  }
}

import { generateText } from "ai";
import { experimental_createMCPClient } from "@ai-sdk/mcp";
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
      process.env.TAVILY_API_KEY?.substring(0, 10),
    );

    // ✅ URLパラメータ方式に変更（より確実）
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    if (!tavilyApiKey) {
      throw new Error("TAVILY_API_KEY is not set");
    }

    const mcpUrl = new URL(
      `https://mcp.tavily.com/mcp/?tavilyApiKey=${tavilyApiKey}`,
    );

    mcpClient = await experimental_createMCPClient({
      transport: new StreamableHTTPClientTransport(mcpUrl),
    });

    // MCPサーバーからツールを取得（自動的にAI SDK形式に変換される）
    const tools = await mcpClient.tools();
    console.log("🔧 利用可能なツール数:", tools.length);

    console.log("🔧 ツール詳細:", tools);

    // Gemini 2.5 Flashでテキスト生成
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      tools,
      system:
        "あなたは親切なアシスタントです。ユーザーの質問に答えるために、必ずウェブ検索ツールを使用してください。\n\n重要な指示:\n1. 最新情報や具体的な事実について質問された場合は、必ず検索ツールを使用してください\n2. 検索結果を元に、わかりやすく日本語で回答してください\n3. 検索ツールを使わずに推測で答えることは避けてください\n4. 検索結果が見つからない場合は、その旨を明確に伝えてください",
      prompt: query,
    });

    // 🔍 ツール使用の詳細分析
    console.log("📊 === ツール使用分析 ===");
    console.log("📝 生成されたテキスト長:", result.text?.length || 0);
    console.log("🔧 ツール呼び出し数:", result.toolCalls?.length || 0);
    console.log("📋 ツール結果数:", result.toolResults?.length || 0);

    if (result.toolCalls && result.toolCalls.length > 0) {
      console.log("✅ ツールが使用されました！");
      result.toolCalls.forEach((call, index) => {
        console.log(`  ${index + 1}. ツール名: ${call.toolName}`);
        console.log(`     引数:`, JSON.stringify(call.input, null, 2));
      });
    } else {
      console.log("❌ ツールが使用されませんでした");
      console.log("🤔 考えられる原因:");
      console.log("  - Geminiが検索不要と判断した");
      console.log("  - ツールの定義に問題がある");
      console.log("  - システムプロンプトが不適切");
    }

    if (result.toolResults && result.toolResults.length > 0) {
      console.log("📊 ツール実行結果:");
      result.toolResults.forEach((toolResult, index) => {
        console.log(`  ${index + 1}. ツール名: ${toolResult.toolName}`);
        console.log(`     結果タイプ: ${typeof toolResult.output}`);
        console.log(
          `     結果サイズ: ${JSON.stringify(toolResult.output).length}文字`,
        );
      });
    }

    console.log("📊 === 分析終了 ===");

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
      { status: 500 },
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

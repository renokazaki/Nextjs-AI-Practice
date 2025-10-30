"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{
    text: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toolCalls?: { toolName: string; toolCallId: string; input: any }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toolResults?: { toolName: string; toolCallId: string; output: any }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("検索クエリを入力してください");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/vercelaisdk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "検索に失敗しました");
      }

      const data = await response.json();
      console.log("API Response:", data); // デバッグ用
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期しないエラーが発生しました",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gemini + Tavily MCP
          </h1>
          <p className="text-gray-600">
            Gemini 2.5 FlashがTavily MCPサーバーを使ってリアルタイムウェブ検索
          </p>
          <div className="mt-2 inline-flex items-center gap-2 text-sm text-gray-500">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              StreamableHTTP
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              本番環境対応
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="検索クエリを入力..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "検索中..." : "検索"}
            </button>
          </div>
        </form>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
            <div className="font-medium">エラーが発生しました</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        )}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">検索結果</h2>

            {/* メインレスポンス */}
            <div className="prose max-w-none">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {result.text || "AIが検索結果を分析中です..."}
                </p>
              </div>
            </div>

            {/* デバッグ情報 */}
            <details className="mt-4 border border-yellow-200 rounded-lg">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                🐛 デバッグ情報
              </summary>
              <div className="p-4 bg-yellow-50">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </details>

            {/* ツール呼び出し詳細 */}
            {result.toolCalls && result.toolCalls.length > 0 && (
              <details className="mt-6 border border-gray-200 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  🔧 ツール呼び出し詳細 ({result.toolCalls.length}回)
                </summary>
                <div className="p-4 space-y-4 bg-gray-50">
                  {result.toolCalls.map((call, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg p-4 border border-blue-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono px-2 py-1 bg-blue-100 text-blue-900 rounded">
                          {call.toolName}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {call.toolCallId}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong className="block mb-1">入力パラメータ:</strong>
                        <pre className="overflow-x-auto bg-gray-50 p-3 rounded text-xs border border-gray-200">
                          {JSON.stringify(call.input, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* ツール結果詳細 */}
            {result.toolResults && result.toolResults.length > 0 && (
              <details className="mt-4 border border-gray-200 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  📊 ツール実行結果 ({result.toolResults.length}件)
                </summary>
                <div className="p-4 space-y-3 bg-gray-50">
                  {result.toolResults.map((toolResult, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg p-4 border border-green-200"
                    >
                      <div className="mb-2">
                        <span className="text-xs font-mono px-2 py-1 bg-green-100 text-green-900 rounded">
                          {toolResult.toolName}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ID: {toolResult.toolCallId}
                        </span>
                      </div>

                      {/* 検索結果の構造化表示 */}
                      {toolResult.output && (
                        <div className="space-y-3">
                          {/* content配列がある場合 */}
                          {toolResult.output.content &&
                            toolResult.output.content.map(
                              (
                                content: { type: string; text: string },
                                contentIdx: number,
                              ) => (
                                <div
                                  key={contentIdx}
                                  className="border border-gray-200 rounded p-3 bg-gray-50"
                                >
                                  {content.type === "text" && (
                                    <div>
                                      <h4 className="font-medium text-sm mb-2">
                                        検索結果データ:
                                      </h4>
                                      <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                                        {typeof content.text === "string"
                                          ? content.text
                                          : JSON.stringify(
                                              content.text,
                                              null,
                                              2,
                                            )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ),
                            )}

                          {/* 直接結果がある場合（Tavily形式） */}
                          {!toolResult.output.content && toolResult.output && (
                            <div className="border border-gray-200 rounded p-3 bg-gray-50">
                              <h4 className="font-medium text-sm mb-2">
                                検索結果:
                              </h4>
                              <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                                {typeof toolResult.output === "string"
                                  ? toolResult.output
                                  : JSON.stringify(toolResult.output, null, 2)}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 生の結果データ */}
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                          生データを表示
                        </summary>
                        <pre className="text-xs overflow-x-auto bg-gray-100 p-2 rounded mt-1">
                          {JSON.stringify(toolResult.output, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* レスポンス統計 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                レスポンス統計
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">テキスト長:</span>
                  <span className="ml-1 font-mono">
                    {result.text?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">ツール呼び出し:</span>
                  <span className="ml-1 font-mono">
                    {result.toolCalls?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">ツール結果:</span>
                  <span className="ml-1 font-mono">
                    {result.toolResults?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">成功:</span>
                  <span className="ml-1 text-green-600">✅</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">💡 試してみよう:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setQuery("2025年のAI技術のトレンド")}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              AIトレンド
            </button>
            <button
              onClick={() => setQuery("2025年のフロントエンド技術のトレンド")}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              フロントエンド技術のトレンド
            </button>

            <button
              onClick={() => setQuery("2025年のバックエンド技術のトレンド")}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              バックエンド技術のトレンド
            </button>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

// "use server";
// import { Agent, run, tool, hostedMcpTool } from "@openai/agents";
// import { geminiModel } from "../../lib/gemini";
// import { z } from "zod";

// if (!geminiModel) {
//   throw new Error("geminiModel is not set");
// }

// // エージェントの定義
// const agent = new Agent({
//   name: "MCP Assistant with Tavily",
//   instructions:
//     "You must always use the MCP tools to answer questions. Use Tavily search when you need real-time information or web search results.",
//   tools: [
//     hostedMcpTool({
//       serverLabel: "tavily",
//       serverUrl: `https://mcp.tavily.com/mcp/?tavilyApiKey=${process.env.TAVILY_API_KEY}`,
//     }),
//   ],
//   model: geminiModel,
// });

// export async function getAgentResponse(userMessage: string) {
//   try {
//     const result = await run(agent, userMessage);
//     return result.finalOutput;
//   } catch (error) {
//     console.error("Agent error:", error);
//     throw new Error(`エージェントの実行中にエラーが発生しました: ${error}`);
//   }
// }

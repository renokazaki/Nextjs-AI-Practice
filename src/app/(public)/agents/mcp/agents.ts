"use server";
import { Agent, run, MCPServerStreamableHttp } from "@openai/agents";
import { geminiModel } from "../../../lib/gemini";

export async function getAgentResponse(userMessage: string) {
  const mcpServer = new MCPServerStreamableHttp({
    url: `https://mcp.tavily.com/mcp/?tavilyApiKey=${process.env.TAVILY_API_KEY}`,
    name: "Tavily MCP Server",
  });

  const agent = new Agent({
    name: "Tavily Assistant",
    instructions: "Use the Tavily MCP tools to respond to user requests.",
    mcpServers: [mcpServer],
    model: geminiModel,
  });

  try {
    await mcpServer.connect();
    const result = await run(agent, userMessage);
    return result.finalOutput;
  } catch (error) {
    console.error("Agent error:", error);
    throw new Error(`エージェントの実行中にエラーが発生しました: ${error}`);
  } finally {
    await mcpServer.close();
  }
}

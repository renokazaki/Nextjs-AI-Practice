import ChatForm from "./actions/ChatForm";

export default function MCPPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">MCP</h1>
          <p className="text-lg text-gray-600">
            AIがElevenLabsのMCPを使用して、単語を読み上げます
          </p>
          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <p>例: 「hello, world」</p>
          </div>
        </div>
      </div>
      <ChatForm />
    </div>
  );
}

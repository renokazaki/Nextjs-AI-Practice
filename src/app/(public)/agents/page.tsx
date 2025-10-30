import ChatForm from "@/components/agent/ChatForm";

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Language Learning Agent
          </h1>
          <p className="text-lg text-gray-600">
            AIが単語を解析して、学習用の例文を自動生成します
          </p>
          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <p>例: 「食べる、歩く、美しい」</p>
            <p>「happy, sad, beautiful」</p>
            <p>「プログラミング、学習、楽しい」</p>
          </div>
        </div>
      </div>
      <ChatForm />
    </div>
  );
}

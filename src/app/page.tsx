import Link from "next/link";

export default async function Home() {
  const features = [
    {
      title: "ChatBot",
      description: "Gemini APIを使用したシンプルなチャットボット",
      href: "/chatbot",
      icon: "💬",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Language Learning Agent",
      description: "単語から学習用例文を自動生成するAIエージェント",
      href: "/agents",
      icon: "📚",
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                AI Agent Dashboard
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Powered by OpenAI Agents and Gemini AI
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AI Agent Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            様々なAI機能を試すことができるダッシュボードです。
            チャットボットや言語学習エージェントなど、多彩なAIアシスタントをご利用いただけます。
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href} className="group block">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{feature.icon}</div>
                    <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div
                    className={`inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-colors ${feature.color}`}
                  >
                    <span>開始する</span>
                    <svg
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

import ChatForm from "@/components/chatbot/ChatForm";

export default function ChatBot() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Gemini AI チャット
          </h1>
          <p className="text-lg text-gray-600">
            AIに質問して回答を得ることができます
          </p>
        </div>
        <ChatForm />
      </div>
    </div>
  );
}

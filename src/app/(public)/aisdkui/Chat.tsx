"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import Input from "./Input";

export default function Chat() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/vercelaiui",
    }),
  });

  return (
    <>
      {messages.map((m: UIMessage) => (
        <div
          key={m.id}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] px-4 py-2 ${
              m.role === "user"
                ? "bg-gray-100 text-gray-900 rounded-3xl"
                : "bg-white text-gray-900 rounded-2xl"
            }`}
          >
            {m.parts.map((part, index) => (
              <div
                key={index}
                className={`${part.type === "text" ? "text-gray-900" : "text-gray-500"}`}
              >
                {part.type === "text" ? part.text : null}
              </div>
            ))}
          </div>
        </div>
      ))}
      {error && (
        <p className="text-sm text-red-600 mt-2 text-center" role="alert">
          {String(error)}
        </p>
      )}
      <Input sendMessage={sendMessage} status={status} />
    </>
  );
}

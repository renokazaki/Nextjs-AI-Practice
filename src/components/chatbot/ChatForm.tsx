"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { submitChat } from "@/actions/chatbot/chat";
import { InputSchemaType } from "@/schemas/inputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputSchema } from "@/schemas/inputSchema";

export default function ChatForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputSchemaType>({ resolver: zodResolver(inputSchema) });
  const [response, setResponse] = useState<{ content: string | null } | null>(
    null,
  );

  const onSubmit: SubmitHandler<InputSchemaType> = async (data) => {
    try {
      const response = await submitChat(data.words);
      setResponse(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <textarea
            {...register("words")}
            placeholder="AIに質問を入力してください..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            disabled={isSubmitting}
          />
          {errors.words && (
            <p className="text-red-500">{errors.words.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "AIが回答を考えています..." : "回答を生成する"}
        </button>
      </form>

      {errors.words && <p className="text-red-500">{errors.words.message}</p>}

      {response && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI回答:</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
              {response.content}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

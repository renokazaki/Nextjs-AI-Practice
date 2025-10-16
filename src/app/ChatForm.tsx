"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { submitChat } from "./chat/submit";

export default function ChatForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ message: string }>();
  const [response, setResponse] = useState<{ content: string | null } | null>(
    null
  );

  const onSubmit: SubmitHandler<{ message: string }> = async (data) => {
    const response = await submitChat(data);
    setResponse(response);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <textarea
            {...register("message", { required: true })}
            placeholder="AIに質問を入力してください..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "送信中..." : "送信"}
        </button>
      </form>

      {errors.message && (
        <p className="text-red-500">{errors.message.message}</p>
      )}

      <p className="text-gray-800 whitespace-pre-wrap">{response?.content}</p>
    </>
  );
}

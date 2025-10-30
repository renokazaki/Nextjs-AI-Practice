"use client";
import React, { useState } from "react";
import { getAgentResponse } from "../agents";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputSchemaType } from "../../../../schemas/inputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputSchema } from "../../../../schemas/inputSchema";

export default function MCPPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<InputSchemaType>({ resolver: zodResolver(inputSchema) });
  const [response, setResponse] = useState<string | null>(null);
  const onSubmit: SubmitHandler<InputSchemaType> = async (data) => {
    try {
      const result = await getAgentResponse(data.words);
      setResponse(result || null);
    } catch (error) {
      setResponse(`エラーが発生しました: ${error}`);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <textarea
            {...register("words")}
            placeholder="読み上げたい単語を入力してください（カンマ区切りで複数可）"
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
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "AIが読み上げています..." : "読み上げる"}
        </button>
      </form>

      {response && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            AI読み上げ:
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
              {response}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use server";

export async function analyzeWords(words: string[]) {
  try {
    // 単語の検証と基本的な情報提供
    if (!words || words.length === 0) {
      return {
        success: false,
        error: "単語が入力されていません",
      };
    }

    // 単語の基本的な情報を返すだけ
    return {
      success: true,
      data: {
        wordCount: words.length,
        words: words,
        message: `${words.length}個の単語を受け取りました。これらの単語を使った例文を考えてください。`,
      },
    };
  } catch (error) {
    console.error("Word analysis error:", error);
    return {
      success: false,
      error: `単語解析中にエラーが発生しました: ${error}`,
    };
  }
}

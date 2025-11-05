import { useState } from "react";

type InputProps = {
  sendMessage: (message: { text: string }) => void;
  status: string;
};

export default function Input({ sendMessage, status }: InputProps) {
  const [input, setInput] = useState("");

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white py-4 z-10 max-w-3xl mx-auto px-4"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
          placeholder="Say something..."
        />
        <button type="submit" disabled={status !== "ready"}>
          Submit
        </button>
      </form>
    </div>
  );
}

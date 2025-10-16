import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link href="/chatbot">ChatBot</Link>
      <Link href="/chatbot">ChatBot</Link>
      <Link href="/chatbot">ChatBot</Link>
    </div>
  );
}

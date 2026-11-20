import Link from "next/link";

export const metadata = {
  title: "关于我 | 我的 AI 实验田",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0f] px-5 py-16 text-zinc-100">
      <main className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold">关于我</h1>
        <p className="mt-4 text-zinc-400">是个人，还活着</p>
        <Link href="/" className="mt-8 inline-block text-sm text-zinc-300 underline">
          ← 回首页
        </Link>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Card from "./components/Card";
import QuoteCard from "./components/QuoteCard";
import RateCard from "./components/RateCard";
import Modal from "./components/Modal";
import Link from "next/link";
import { supabase } from "./lib/supabase";
import GoldCard from "./components/GoldCard";

type CardRow = {
  id: number;
  title: string;
  lines: string[];
};

export default function Home() {
  const [cards, setCards] = useState<CardRow[]>([]);
  const [open, setOpen] = useState(false);

  async function loadCards() {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .order("sort_order");

    if (error) {
      console.error(error);
      return;
    }
    setCards(data as CardRow[]);
  }

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0f] px-5 py-16 text-zinc-100 sm:px-8 sm:py-24">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col sm:justify-center">
        {/* 顶部标题 */}
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            我的 AI 实验田
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:text-lg">
            第 1 周，从这里开始
          </p>
        </header>
        {/* 中间：三张卡片 */}
        <section className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-3 sm:gap-6">
          {cards.map((card) => (
            <Card key={card.id} title={card.title} lines={card.lines} />
          ))}
          <QuoteCard />
          <RateCard />
          <GoldCard />
        </section>
        {/* 底部：按钮 */}
        <div className="mt-16 flex flex-col items-center gap-3 sm:mt-20 sm:flex-row sm:justify-center sm:gap-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full rounded-full bg-white px-8 py-3.5 text-base font-medium text-black transition-opacity hover:opacity-80 sm:w-auto"
          >
            点这个
          </button>
          <Link
            href="/about"
            className="w-full rounded-full border border-white/15 px-8 py-3.5 text-center text-base text-zinc-200 transition-colors hover:bg-white/10 sm:w-auto"
          >
            关于我
          </Link>
        </div>
      </main>
      {/* 点击按钮后弹出的浮层 */}
      <Modal open={open} onClose={() => setOpen(false)} />
    </div >
  );
}

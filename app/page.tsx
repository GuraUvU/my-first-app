"use client";

import { useEffect, useState } from "react";

const cards = [
  {
    title: "我在学什么",
    lines: ["Next.js + React 的页面与组件", "用 LLM API 做一个能用的小功能"],
  },
  {
    title: "我做过什么",
    lines: ["从零跑通一个 Next.js 项目", "把第一版页面部署到公网上"],
  },
  {
    title: "我想做什么",
    lines: ["做一个解决真实小问题的 AI 工具", "学习并产出一些神人玩意"],
  },
];

const shownCurrencies = ["CNY", "EUR", "JPY", "GBP"];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [source, setSource] = useState("");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [updatedAt, setUpdatedAt] = useState("");

  async function loadQuote() {
    try {
      setQuote("");
      setSource("");
      const res = await fetch("https://v1.hitokoto.cn/?_=" + Date.now());
      if (!res.ok) {
        throw new Error("网络错误：" + res.status);
      }
      const data = await res.json();
      setQuote(data.hitokoto);
      setSource(data.from);
    } catch (error) {
      console.error(error);
      setQuote("加载失败，请稍后再试。");
      setSource("");
    }
  }

  async function loadRates() {
    try {
      setUpdatedAt("");
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!res.ok) {
        throw new Error("请求失败：" + res.status);
      }
      const data = await res.json();
      console.log(data);
      if (data.result !== "success") {
        throw new Error("接口返回失败：" + data["error-type"]);
      }
      setRates(data.rates);
      setUpdatedAt(data.time_last_update_utc);
    } catch (error) {
      console.error(error);
      setUpdatedAt("获取失败，请稍后再试");
    }
  }

  useEffect(() => {
    loadQuote();
    loadRates();
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
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.07]"
            >
              <h2 className="text-lg font-medium text-white">{card.title}</h2>
              <div className="mt-3 space-y-1.5">
                {card.lines.map((line) => (
                  <p key={line} className="text-sm leading-6 text-zinc-400">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {/*卡片4*/}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center sm:col-span-3">
            <h2 className="text-lg font-medium text-white">每日一句</h2>
            <div className="mt-3 space-y-1.5">
              <p className="text-sm leading-10 text-zinc-200">
                {quote || "加载中……"}
              </p>
              <p className="text-xs leading-5 text-zinc-500">{source ? "—— " + source : ""}</p>
            </div>
            <button
              type="button"
              onClick={loadQuote}
              className="mt-4 rounded-full bg-white/30 px-4 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-white/20"
            >
              换一句
            </button>
          </div>
          {/* 卡片5：今日汇率 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center sm:col-span-3">
            <h2 className="text-lg font-medium text-white">今日汇率</h2>
            <div className="mt-3 space-y-1.5">
              {shownCurrencies.map((code) => (
                <p key={code} className="text-sm leading-8 text-zinc-200">
                  1 美元 = {rates[code] ? rates[code].toFixed(2) : "—"} {code}
                </p>
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              更新于：{updatedAt ? new Date(updatedAt).toLocaleString("zh-CN") : "加载中……"}
            </p>
            <p className="mt-4 text-xs text-zinc-500">老实赚钱，很枯燥吧</p>
            <button
              type="button"
              onClick={loadRates}
              className="mt-4 rounded-full bg-white/10 px-4 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-white/20"
            >
              刷新
            </button>
          </div>
        </section>

        {/* 底部：按钮 */}
        <div className="mt-16 flex justify-center sm:mt-20">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full rounded-full bg-white px-8 py-3.5 text-base font-medium text-black transition-opacity hover:opacity-80 sm:w-auto"
          >
            点这个
          </button>
        </div>
      </main>

      {/* 点击按钮后弹出的浮层 */}
      {
        open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-8 text-center"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-lg font-medium text-white">不要点这个</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 w-full rounded-full border border-white/15 px-6 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/10"
              >
                彳亍
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
}

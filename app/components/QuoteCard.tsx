"use client";

import { useEffect, useState } from "react";

export default function QuoteCard() {
    const [quote, setQuote] = useState("");
    const [source, setSource] = useState("");

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

    useEffect(() => {
        loadQuote();
    }, []);

    return (
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
    );
}
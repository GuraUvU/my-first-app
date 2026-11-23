"use client";

import { useEffect, useState } from "react";

const GRAM_PER_OUNCE = 31.1034768;

export default function GoldCard() {
    const [usdPerOunce, setUsdPerOunce] = useState<number | null>(null);
    const [usdCny, setUsdCny] = useState<number | null>(null);
    const [updatedAt, setUpdatedAt] = useState("");

    async function loadGold() {
        try {
            setUsdPerOunce((prev) => prev);
            
            const [goldRes,fxRes] = await Promise.all([
                fetch("https://api.gold-api.com/price/XAU"),
                fetch("https://open.er-api.com/v6/latest/USD")
            ]);

            if (!goldRes.ok || !fxRes.ok) {
                throw new Error("请求失败");
            }

            const gold = await goldRes.json();
            const fx = await fxRes.json();

            setUsdPerOunce(gold.price);
            setUsdCny(fx.rates.CNY);
            setUpdatedAt(gold.updatedAt);
        }catch (error) {
            console.error(error);
            setUpdatedAt("获取失败，请稍后再试");
        }
    }

    useEffect(() => {
        loadGold();

        const timer = setInterval(() => {
            loadGold();
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const cnyPerGram = usdPerOunce && usdCny ? (usdPerOunce / GRAM_PER_OUNCE) * usdCny : null;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center sm:col-span-3">
            <h2 className="text-lg font-medium text-white">今日金价</h2>
            <div className="mt-3 space-y-1.5">
                <p className="text-sm leading-8 text-zinc-200">
                    1 克 ≈ {cnyPerGram ? "¥" + cnyPerGram.toFixed(2) : "—"}
                </p>
                <p className="text-sm leading-8 text-zinc-200">
                    1 盎司 ≈ {usdPerOunce ? usdPerOunce.toFixed(2) : "—"}
                </p>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
                {updatedAt ? "更新于：" + new Date(updatedAt).toLocaleTimeString("zh-CN") : "加载中……"}
            </p>
            <p className="mt-4 text-xs text-zinc-500">老实赚钱，很枯燥吧</p>
            <button
                type="button"
                onClick={loadGold}
                className="mt-4 rounded-full bg-white/10 px-4 py-2 text-xs text-zinc-200 transition-colors hover:bg-white/20"
            >
                刷新
            </button>
            <p className="mt-2 text-[11px] text-zinc-500">每 60 秒自动刷新</p>
        </div>
    );
}
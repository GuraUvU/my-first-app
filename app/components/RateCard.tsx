"use client";

import { useEffect, useState } from "react";

const shownCurrencies = ["CNY", "EUR", "JPY", "GBP"];

export default function RateCard() {
    const [rates, setRates] = useState<Record<string, number>>({});
    const [updatedAt, setUpdatedAt] = useState("");

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
        loadRates();
    }, []);

    return (
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
  );
}
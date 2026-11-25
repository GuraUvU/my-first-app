"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthCard() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        // 1) 进来先问一次：现在有人登录吗
        supabase.auth.getSession().then(({ data }) => {
            setUserEmail(data.session?.user.email ?? null);
        });

        // 2) 之后一直听着：登录/退出都会触发
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserEmail(session?.user.email ?? null);
        });

        // 3) 清理：组件卸载时取消订阅（和 clearInterval 一个道理）
        return () => data.subscription.unsubscribe();
    }, []);

    async function signUp() {
        setBusy(true);
        setMsg("");
        const { data, error } = await supabase.auth.signUp({ email, password });
        setBusy(false);

        if (error) {
            setMsg("注册失败：" + error.message);
        } else if (data.session) {
            setMsg("");
        } else {
            setMsg("注册成功，请去邮箱点击确认链接");
        }
    }

    async function signIn() {
        setBusy(true);
        setMsg("");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setBusy(false);
        if (error) setMsg("登录失败：" + error.message);
    }

    async function signOut() {
        await supabase.auth.signOut();
        setMsg("已退出");
    }

    if (userEmail) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center sm:col-span-3">
                <p className="text-sm text-zinc-300">已登录：{userEmail}</p>
                <button
                    type="button"
                    onClick={signOut}
                    className="mt-3 rounded-full border border-white/15 px-5 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-white/10"
                >
                    退出登录
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:col-span-3">
            <h2 className="text-center text-lg font-medium text-white">登录 / 注册</h2>
            <div className="mt-4 space-y-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="邮箱"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="密码（至少 6 位）"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
                />
            </div>
            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    onClick={signIn}
                    disabled={busy}
                    className="flex-1 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                    登录
                </button>
                <button
                    type="button"
                    onClick={signUp}
                    disabled={busy}
                    className="flex-1 rounded-xl border border-white/15 px-5 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                    注册
                </button>
            </div>
            {msg && <p className="mt-3 text-center text-xs text-zinc-400">{msg}</p>}
        </div>
    );
}
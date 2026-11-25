"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Message = {
  id: number;
  content: string;
  created_at: string;
};

export default function MessageCard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const canSend = !!userEmail && text.trim().length > 0 && !sending;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
      setError("");
      setText("");
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error(error);
      return;
    }
    setMessages(data ?? []);
  }

  async function sendMessage() {
    const content = text.trim();
    if (!content) {
      setError("先说点什么吧？");
      return;
    }

    setSending(true);
    setError("");

    const { error: insertError } = await supabase
      .from("messages")
      .insert({ content });

    setSending(false);

    if (insertError) {
      console.error(insertError);
      setError("发送失败" + insertError.message);
      return;
    }

    setText("");
    await loadMessages();
  }

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:col-span-3">
      <h2 className="text-lg font-medium text-white text-center">留言板</h2>

      {userEmail ? (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError("");
            }}
            maxLength={200}
            placeholder="说点什么…（最多 200 字）"
            className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/30"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={sending}
            className="rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {sending ? "发送中…" : "发送"}
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-center text-zinc-400 outline-none placeholder:text-zinc-500 focus:border-white/30">
            登录后才能留言
          </div>
          <button
            type="button"
            disabled={!canSend}
            className="rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            不可发送
          </button>
        </div>
      )}

      {userEmail && error && <p className="mt-2 text-xs text-amber-400">{error}</p>}

      <ul className="mt-5 space-y-2">
        {messages.length === 0 && (
          <li className="text-center text-xs text-zinc-500">还没有留言，做第一个吧</li>
        )}
        {messages.map((m) => (
          <li
            key={m.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-200"
          >
            {m.content}
            <span className="ml-2 text-[11px] text-zinc-500">
              {new Date(m.created_at).toLocaleString("zh-CN")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
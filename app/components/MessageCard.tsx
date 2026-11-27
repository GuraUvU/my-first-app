"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type MessageImage = {
  id: number;
  path: string;
};

type Message = {
  id: number;
  content: string;
  created_at: string;
  images: MessageImage[];
};

export default function MessageCard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const canSend = !!userEmail && text.trim().length > 0 && !sending;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      .select("id, content, created_at, images(id, path)")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error(error);
      return;
    }
    setMessages((data as Message[]) ?? []);
  }

  async function sendMessage() {
    const content = text.trim();
    if (!content) {
      setError("先说点什么吧？");
      return;
    }

    setSending(true);
    setError("");

    try {
      let imagePath: string | null = null;
      if (file) {
        const { data: userData } = await supabase.auth.getUser();
        const uid = userData.user?.id;
        if (!uid) throw new Error("用户未登录");

        const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
        const random = crypto.randomUUID();
        imagePath = `${uid}/${random}.${ext}`;
        setUploading(true);
        const { error: uploadError } = await supabase.storage
          .from("message-images")
          .upload(imagePath, file, { contentType: file.type });
        setUploading(false);
        if (uploadError) throw uploadError;
      }

      const { data: newMessage, error: msgError } = await supabase
        .from("messages")
        .insert({ content })
        .select("id")
        .single();

      if (msgError) throw msgError;

      if (imagePath && newMessage) {
        const { error: imgError } = await supabase
          .from("images")
          .insert({ message_id: newMessage.id, path: imagePath });

        if (imgError) throw imgError;
      }

      setText("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadMessages();
    } catch (err) {
      console.error(err);
      setError("发送失败：" + ((err as Error).message ?? "未知错误"));
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:col-span-3">
      <h2 className="text-lg font-medium text-white text-center">留言板</h2>

      {userEmail ? (
        <>
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-zinc-200"
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
        {uploading && <p className="mt-2 text-xs text-zinc-500">图片上传中…</p>}
        {error && <p className="mt-2 text-xs text-amber-400">{error}</p>}
      </>
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
            {m.images?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {m.images.map((img) => (
                  <img
                    key={img.id}
                    src={supabase.storage.from("message-images").getPublicUrl(img.path).data.publicUrl}
                    alt="留言配图"
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
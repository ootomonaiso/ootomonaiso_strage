"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content }),
    });

    router.push("/blog");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold">新規記事作成</h1>
      <input
        className="border w-full p-2 my-2"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border w-full p-2 my-2"
        placeholder="Slug (URL 用)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <textarea
        className="border w-full p-2 my-2 h-40"
        placeholder="Markdown で記事を入力"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2">
        投稿
      </button>
    </div>
  );
}

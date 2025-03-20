'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    tags: '',
    series: '',
    thumbnail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 必要であればシークレットキーの検証ロジックを追加
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/blog');
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">新規記事作成</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>タイトル:</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label>スラッグ:</label>
          <input type="text" name="slug" value={form.slug} onChange={handleChange} required />
        </div>
        <div>
          <label>本文 (Markdown):</label>
          <textarea name="content" value={form.content} onChange={handleChange} required />
        </div>
        <div>
          <label>サマリー:</label>
          <textarea name="summary" value={form.summary} onChange={handleChange} />
        </div>
        <div>
          <label>タグ (カンマ区切り):</label>
          <input type="text" name="tags" value={form.tags} onChange={handleChange} />
        </div>
        <div>
          <label>シリーズ:</label>
          <input type="text" name="series" value={form.series} onChange={handleChange} />
        </div>
        <div>
          <label>サムネイルURL:</label>
          <input type="text" name="thumbnail" value={form.thumbnail} onChange={handleChange} />
        </div>
        <button type="submit">投稿する</button>
      </form>
    </main>
  );
}

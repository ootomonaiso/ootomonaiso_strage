import React from 'react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PageProps {
  params: { slug: string }
}

// サーバーコンポーネントとして直接 DB から取得する方法もありますが、ここでは API 経由の例です
async function getPostBySlug(slug: string) {
  // NEXT_PUBLIC_BASE_URL はビルド時に設定した公開 URL（または内部関数で DB 接続する方法に変更）
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?slug=${slug}`, { cache: 'no-store' });
  const posts = await res.json();
  return posts[0];
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <article className="prose dark:prose-dark">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </article>
    </main>
  );
}

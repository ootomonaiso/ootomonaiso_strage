'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">ブログ記事一覧</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id} className="mb-4">
            <Link href={`/blog/${post.slug}`}>
              <span className="text-xl font-semibold cursor-pointer">{post.title}</span>
            </Link>
            <p>{post.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

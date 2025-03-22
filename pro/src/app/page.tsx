import React from 'react';

export default function HomePage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Portfolio</h1>
      <section>
        <h2 className="text-2xl font-semibold">自己紹介</h2>
        <p>ここに自己紹介文を記述します。</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">スキル</h2>
        <ul>
          <li>Next.js (App Router, TypeScript)</li>
          <li>Tailwind CSS</li>
          <li>Supabase</li>
          <li>Drizzle ORM</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">プロジェクト一覧</h2>
      </section>
    </main>
  );
}

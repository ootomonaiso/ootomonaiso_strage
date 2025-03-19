import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import Link from "next/link";

export default async function BlogPage() {
  const data = await db.select().from(posts);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">ブログ一覧</h1>
      <ul className="mt-4 space-y-4">
        {data.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`} className="text-xl text-blue-500 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default async function BlogPage() {
  const { data: posts } = await supabase.from("posts").select("*");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">ブログ一覧</h1>
      <ul className="mt-4 space-y-4">
        {posts?.map((post) => (
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

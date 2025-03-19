import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const data = await db.select().from(posts).where(eq(posts.slug, params.slug));

  if (!data.length) return <p>記事が見つかりません</p>;

  return (
    <div className="prose dark:prose-invert max-w-2xl mx-auto">
      <h1>{data[0].title}</h1>
      <MarkdownRenderer content={data[0].content} />
    </div>
  );
}

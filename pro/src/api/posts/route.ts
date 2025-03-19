import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const data = await db.select().from(posts);
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req: Request) {
  const { title, slug, content, tags, series, thumbnail } = await req.json();

  await db.insert(posts).values({
    title,
    slug,
    content,
    tags,
    series,
    thumbnail,
  });

  return new Response(JSON.stringify({ message: "投稿成功" }), { status: 201 });
}

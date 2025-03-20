import { NextResponse } from 'next/server';
import { db } from '../../db/client';
import { posts } from '../../db/schema';

export async function GET() {
  const allPosts = await db.select().from(posts);
  return NextResponse.json(allPosts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newPost = await db.insert(posts).values({
    title: body.title,
    slug: body.slug,
    content: body.content,
    summary: body.summary || null,
    tags: body.tags || [],
    series: body.series || null,
    thumbnail: body.thumbnail || null,
  }).returning();
  return NextResponse.json(newPost);
}

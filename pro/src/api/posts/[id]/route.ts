import { NextResponse } from 'next/server';
import { db } from '../../../db/client';
import { posts } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const result = await db.select().from(posts).where(eq(posts.id, params.id));
  if (!result || result.length === 0) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(result[0]);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updated = await db.update(posts)
    .set({
      title: body.title,
      slug: body.slug,
      content: body.content,
      summary: body.summary || null,
      tags: body.tags ? body.tags.split(',').map((s: string) => s.trim()) : [],
      series: body.series || null,
      thumbnail: body.thumbnail || null,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, params.id))
    .returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await db.delete(posts).where(eq(posts.id, params.id));
  return NextResponse.json({ success: true });
}

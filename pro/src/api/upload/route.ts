import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as Blob;
  if (!file) {
    return NextResponse.json({ error: 'File not provided' }, { status: 400 });
  }
  // 画像のリサイズ処理（例：300x300 のサムネイル）
  const buffer = Buffer.from(await file.arrayBuffer());
  const resizedImage = await sharp(buffer)
    .resize(300, 300)
    .toBuffer();

  // Cloudflare Images へのアップロード処理は API キー等を利用して実装してください
  // 下記はダミーの URL を返す例
  return NextResponse.json({ thumbnailUrl: 'https://example.com/path/to/thumbnail.jpg' });
}

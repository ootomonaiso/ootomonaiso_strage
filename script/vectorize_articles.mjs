// vectorize_articles.js
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import fetch from 'node-fetch';
import crypto from 'crypto';

// 例: DB クライアントのインポート（Supabase の場合）
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Gemini API のエンドポイント（例）
const GEMINI_EMBEDDING_URL = 'https://api.gemini.example.com/embeddings';

// ファイル内容からハッシュを計算する関数
function computeHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Gemini API を呼び出して埋め込みを取得する関数
async function getEmbedding(text) {
  const response = await fetch(GEMINI_EMBEDDING_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
    },
    body: JSON.stringify({ text })
  });
  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data.embedding; // API のレスポンス形式に合わせて調整
}

// Markdown ファイルの処理
async function processMarkdownFiles() {
  // pro ディレクトリ以下の Markdown ファイルを再帰的に取得
  const files = glob.sync('pro/**/*.{md,mdx}');
  const processedFiles = [];

  for (const filePath of files) {
    const fullPath = path.resolve(filePath);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data: meta, content } = matter(raw);
    const cleanedContent = content.trim();
    const hash = computeHash(cleanedContent);
    
    // ここで、DB から既存レコードをチェック（file_path をキーに）
    const { data: existing, error } = await supabase
      .from('documents')
      .select('hash')
      .eq('file_path', filePath)
      .single();

    // 更新が不要な場合はスキップ
    if (!error && existing && existing.hash === hash) {
      console.log(`Skipping unchanged file: ${filePath}`);
      processedFiles.push(filePath);
      continue;
    }

    // Gemini API で埋め込み生成
    const embedding = await getEmbedding(cleanedContent);

    // DB に upsert（新規作成または更新）
    const payload = {
      file_path: filePath,
      meta,                // YAML フロントマター全体
      content: cleanedContent,
      embedding,           // 取得したベクトル
      hash,
    };
    const { error: upsertError } = await supabase
      .from('documents')
      .upsert(payload, { onConflict: 'file_path' });
    if (upsertError) {
      console.error(`DB upsert error for ${filePath}:`, upsertError);
    } else {
      console.log(`Processed file: ${filePath}`);
    }
    processedFiles.push(filePath);
  }

  // DB に存在するが、現ファイル一覧に含まれないレコードを削除
  const { data: dbFiles } = await supabase
    .from('documents')
    .select('file_path');
  const dbFilePaths = dbFiles.map((item) => item.file_path);
  const toDelete = dbFilePaths.filter((dbPath) => !processedFiles.includes(dbPath));

  for (const delPath of toDelete) {
    const { error: delError } = await supabase
      .from('documents')
      .delete()
      .eq('file_path', delPath);
    if (delError) {
      console.error(`Failed to delete ${delPath}:`, delError);
    } else {
      console.log(`Deleted record for file: ${delPath}`);
    }
  }
}

processMarkdownFiles()
  .then(() => console.log('All Markdown files processed'))
  .catch((err) => console.error('Error processing Markdown files:', err));

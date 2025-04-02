import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_EMBEDDING_URL = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedText?key=${GEMINI_API_KEY}`;

function computeHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

async function getEmbedding(text) {
  const response = await fetch(GEMINI_EMBEDDING_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/embedding-001',
      content: {
        parts: [{ text }]
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  return data.embedding || data.embeddings?.[0]?.values;
}

async function processMarkdownFiles() {
  const files = glob.sync('pro/**/*.{md,mdx}');
  const processedFiles = [];

  for (const filePath of files) {
    const fullPath = path.resolve(filePath);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data: meta, content } = matter(raw);
    const cleanedContent = content.trim();
    const hash = computeHash(cleanedContent);

    const { data: existing, error } = await supabase
      .from('documents')
      .select('hash')
      .eq('file_path', filePath)
      .single();

    const needsInsert = error || !existing || existing.hash !== hash;

    if (needsInsert) {
      const embedding = await getEmbedding(cleanedContent);

      const payload = {
        file_path: filePath,
        meta,
        content: cleanedContent,
        embedding,
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
    } else {
      console.log(`Skipping unchanged file: ${filePath}`);
    }

    processedFiles.push(filePath);
  }

  const { data: dbFiles } = await supabase.from('documents').select('file_path');
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

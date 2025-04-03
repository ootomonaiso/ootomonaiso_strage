import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@xenova/transformers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// BERT embedder init
const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

// SHA256 hash
function computeHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// ベクトル生成（BERT）
async function getEmbedding(text) {
  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  });
  const array = await output.data.tolist(); // Tensor → JavaScript array
  return array[0]; // [float, float, ...]
}

// Markdown 処理
async function processMarkdownFiles() {
  const files = glob.sync('../pro/**/*.{md,mdx}', {
    ignore: ['../pro/node_modules/**'],
  });

  console.log('Matched Markdown files:', files);
  const processedFiles = [];

  for (const filePath of files) {
    const fullPath = path.resolve(filePath);
    const relativePath = path.relative(path.resolve(__dirname, '..'), fullPath);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data: meta, content } = matter(raw);
    const cleanedContent = content.trim();
    const hash = computeHash(cleanedContent);

    const { data: existing, error } = await supabase
      .from('documents')
      .select('hash')
      .eq('file_path', relativePath)
      .single();

    const needsInsert = error || !existing || existing.hash !== hash;

    if (needsInsert) {
      const embeddingArray = await getEmbedding(cleanedContent);
      const embedding = `[${embeddingArray.map(v => Number(v.toFixed(8))).join(', ')}]`; // pgvector 用文字列

      const payload = {
        file_path: relativePath,
        meta,
        content: cleanedContent,
        embedding,
        hash,
      };

      const { error: upsertError } = await supabase
        .from('documents')
        .upsert(payload, { onConflict: 'file_path' });

      if (upsertError) {
        console.error(`DB upsert error for ${relativePath}:`, upsertError);
      } else {
        console.log(`Processed file: ${relativePath}`);
      }
    } else {
      console.log(`Skipping unchanged file: ${relativePath}`);
    }

    processedFiles.push(relativePath);
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

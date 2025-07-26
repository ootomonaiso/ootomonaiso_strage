// notify-and-vectorize.mjs
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

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const baseUrl = process.env.SITE_URL || 'https://ootomonaiso.github.io/ootomonaiso_strage/';

function computeHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

async function getEmbedding(text) {
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  });

  if (!output || !output.data || !output.data.length) {
    throw new Error('❌ Invalid embedding tensor structure');
  }

  return Array.from(output.data);
}

async function main() {
  const files = glob.sync('../pro/**/*.{md,mdx}', {
    ignore: ['../pro/node_modules/**']
  });

  console.log(`📄 対象Markdownファイル数: ${files.length}`);

  const updatedFiles = [];
  const processedFiles = [];

  for (const filePath of files) {
    const fullPath = path.resolve(filePath);
    const relativePath = path.relative(path.resolve(__dirname, '..'), fullPath);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data: meta, content } = matter(raw);
    const cleanedContent = content.trim();
    const hash = computeHash(cleanedContent);

    const { data: record, error } = await supabase
      .from('documents')
      .select('hash')
      .eq('file_path', relativePath)
      .single();

    const needsInsert = error || !record || record.hash !== hash;

    if (needsInsert) {
      console.log(`🆕 差分検出: ${relativePath}`);
      const embeddingArray = await getEmbedding(cleanedContent);
      const embedding = `[${embeddingArray.map(v => Number(v.toFixed(8))).join(', ')}]`;

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
        console.error(`❌ DB upsert error for ${relativePath}:`, upsertError);
      } else {
        updatedFiles.push(relativePath);
      }
    } else {
      console.log(`✅ 一致: ${relativePath}`);
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
      console.error(`❌ Failed to delete ${delPath}:`, delError);
    } else {
      console.log(`🗑️ Deleted record for file: ${delPath}`);
    }
  }

  fs.writeFileSync('updated_docs.txt', updatedFiles.join('\n') + '\n');

  let message;
  if (updatedFiles.length === 0) {
    console.log('🔍 差分なし。通知はスキップされます。');
    message = '更新されたドキュメントはありません。';
  } else {
    message = updatedFiles.map(filePath => {
      const trimmed = filePath.replace(/\.(md|mdx)$/, '').replace(/\/?index$/, '');
      const name = path.basename(trimmed) || 'index';
      const url = baseUrl + trimmed;
      return `- [${name}](${url})`;
    }).join('\n');
  }

  fs.writeFileSync('docs_diff_message.txt', message + '\n');

  console.log('📝 Discord通知内容:');
  console.log(message);
  console.log('\n✅ docs_diff_message.txt 書き出し完了');

  const githubEnvPath = process.env.GITHUB_ENV;
  if (githubEnvPath) {
    console.log(`📦 GITHUB_ENV にメッセージを出力します → ${githubEnvPath}`);
    fs.appendFileSync(githubEnvPath, `DOC_MSG<<EOF\n${message}\nEOF\n`);
  } else {
    console.warn('⚠️ GITHUB_ENV が未定義。DOC_MSG をエクスポートできません。');
  }

  console.log('🎉 全処理完了');
}

main().catch(err => {
  console.error('🔥 notify-and-vectorize 処理中にエラー:', err);
  process.exit(1);
});

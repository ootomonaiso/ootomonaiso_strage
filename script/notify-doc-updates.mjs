import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ハッシュ関数
function computeHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// GitHub Pages base URL
const baseUrl = process.env.SITE_URL || 'https://ootomonaiso.github.io/ootomonaiso_strage/';

async function main() {
  const files = glob.sync('../pro/**/*.{md,mdx}', {
    ignore: ['../pro/node_modules/**']
  });

  const updatedFiles = [];

  for (const filePath of files) {
    const fullPath = path.resolve(filePath);
    const relativePath = path.relative(path.resolve(__dirname, '..'), fullPath);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { content } = matter(raw);
    const hash = computeHash(content.trim());

    const { data: record, error } = await supabase
      .from('documents')
      .select('hash')
      .eq('file_path', relativePath)
      .single();

    if (error || !record || record.hash !== hash) {
      updatedFiles.push(relativePath);
    }
  }

  if (updatedFiles.length === 0) {
    console.log('🔍 No updated files found.');
    fs.writeFileSync('docs_diff_message.txt', '更新されたドキュメントはありません。\n');
    return;
  }

  // Markdown形式のリンクメッセージ生成
  const message = updatedFiles.map(filePath => {
    const trimmed = filePath.replace(/\.(md|mdx)$/, '').replace(/\/?index$/, '');
    const name = path.basename(trimmed) || 'index';
    const url = baseUrl + trimmed;
    return `- [${name}](${url})`;
  }).join('\n');

  fs.writeFileSync('docs_diff_message.txt', message + '\n');

  // GitHub Actions 向けの環境変数ファイル出力
  const githubEnvPath = process.env.GITHUB_ENV;
  if (githubEnvPath) {
    fs.appendFileSync(githubEnvPath, `DOC_MSG<<EOF\n${message}\nEOF\n`);
  }

  console.log('✅ docs_diff_message.txt generated and DOC_MSG exported.');
}

main().catch(err => {
  console.error('🔥 notify-doc-updates failed:', err);
  process.exit(1);
});

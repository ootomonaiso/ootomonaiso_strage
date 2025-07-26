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

const baseUrl = process.env.SITE_URL || 'https://ootomonaiso.github.io/ootomonaiso_strage/';

async function main() {
  const files = glob.sync('../pro/**/*.{md,mdx}', {
    ignore: ['../pro/node_modules/**']
  });

  console.log(`📄 対象Markdownファイル数: ${files.length}`);

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

    if (error) {
      console.warn(`⚠️ Supabase fetch error for ${relativePath}:`, error.message);
    }

    if (error || !record || record.hash !== hash) {
      console.log(`🆕 差分検出: ${relativePath}`);
      updatedFiles.push(relativePath);
    } else {
      console.log(`✅ 一致: ${relativePath}`);
    }
  }

  if (updatedFiles.length === 0) {
    console.log('🔍 差分なし。通知はスキップされます。');
    fs.writeFileSync('docs_diff_message.txt', '更新されたドキュメントはありません。\n');
    return;
  }

  // Markdownリンクメッセージ作成
  const message = updatedFiles.map(filePath => {
    const trimmed = filePath.replace(/\.(md|mdx)$/, '').replace(/\/?index$/, '');
    const name = path.basename(trimmed) || 'index';
    const url = baseUrl + trimmed;
    return `- [${name}](${url})`;
  }).join('\n');

  fs.writeFileSync('docs_diff_message.txt', message + '\n');

  console.log('📝 Discord通知内容（整形済）:\n');
  console.log(message);
  console.log('\n✅ docs_diff_message.txt 書き出し完了');

  // GitHub Actions 環境変数へ出力
  const githubEnvPath = process.env.GITHUB_ENV;
  if (githubEnvPath) {
    console.log(`📦 GITHUB_ENV にメッセージを出力します → ${githubEnvPath}`);
    fs.appendFileSync(githubEnvPath, `DOC_MSG<<EOF\n${message}\nEOF\n`);
  } else {
    console.warn('⚠️ GITHUB_ENV が未定義。DOC_MSG をエクスポートできません。');
  }
}

main().catch(err => {
  console.error('🔥 notify-doc-updates 処理中にエラー:', err);
  process.exit(1);
});

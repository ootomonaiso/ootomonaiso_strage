// notify-and-vectorize.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import crypto from 'crypto';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl =
  process.env.SITE_URL || 'https://ootomonaiso.github.io/ootomonaiso_strage/';
const MANIFEST_FILE = path.resolve(__dirname, 'docs-manifest.yml');

function computeHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function loadManifest() {
  if (fs.existsSync(MANIFEST_FILE)) {
    try {
      return yaml.load(fs.readFileSync(MANIFEST_FILE, 'utf8')) || {};
    } catch (err) {
      console.warn('⚠️ マニフェストファイルの読み込みに失敗しました:', err);
      return {};
    }
  }
  return {};
}

function saveManifest(manifest) {
  const yamlContent = yaml.dump(manifest, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  });
  fs.writeFileSync(MANIFEST_FILE, yamlContent, 'utf8');
  console.log(`💾 マニフェストファイルを保存: ${MANIFEST_FILE}`);
}

function gitAddManifest() {
  try {
    execSync(`git add "${MANIFEST_FILE}"`, {
      cwd: path.resolve(__dirname, '..'),
    });
    console.log('✅ マニフェストファイルをGitステージングに追加しました');
  } catch (err) {
    console.warn('⚠️ Git addに失敗:', err.message);
  }
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : '(no title)';
}

function findCategoryLabels(filePath) {
  const parts = filePath.split(path.sep);
  const categories = [];

  for (let i = 1; i < parts.length - 1; i++) {
    const categoryPath = path.resolve(
      __dirname,
      '..',
      ...parts.slice(0, i + 1),
      '_category_.json'
    );
    if (fs.existsSync(categoryPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
        if (data.label) categories.push(data.label);
      } catch (_) {
        continue;
      }
    }
  }

  return categories.join(' / ');
}

async function main() {
  // website/network-docs のみを監視（実際に公開されるドキュメント）
  const files = glob.sync('../website/network-docs/**/*.{md,mdx}', {
    ignore: ['../website/network-docs/node_modules/**'],
  });

  console.log(`📄 対象Markdownファイル数: ${files.length}`);

  const manifest = loadManifest();
  const updatedFiles = [];
  const processedFiles = [];
  const newManifest = {};

  for (const filePath of files) {
    const fullPath = path.resolve(filePath);
    const relativePath = path.relative(path.resolve(__dirname, '..'), fullPath);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data: meta, content } = matter(raw);
    const cleanedContent = content.trim();
    const hash = computeHash(cleanedContent);
    const lastModified = fs.statSync(fullPath).mtime.toISOString();

    // マニフェストに記録
    newManifest[relativePath] = {
      hash,
      lastModified,
      title: extractTitle(cleanedContent),
      category: findCategoryLabels(filePath),
    };

    // 差分チェック
    const existingRecord = manifest[relativePath];
    const needsUpdate = !existingRecord || existingRecord.hash !== hash;

    if (needsUpdate) {
      console.log(`🆕 差分検出: ${relativePath}`);
      updatedFiles.push(relativePath);
    } else {
      console.log(`✅ 一致: ${relativePath}`);
    }

    processedFiles.push(relativePath);
  }

  // 削除されたファイルを検出
  const deletedFiles = Object.keys(manifest).filter(
    (manifestPath) => !processedFiles.includes(manifestPath)
  );

  for (const delPath of deletedFiles) {
    console.log(`🗑️ 削除されたファイル: ${delPath}`);
  }

  // マニフェストを保存
  saveManifest(newManifest);

  // 差分があればGitにステージング
  if (updatedFiles.length > 0 || deletedFiles.length > 0) {
    gitAddManifest();
  }

  fs.writeFileSync('updated_docs.txt', updatedFiles.join('\n') + '\n');

  let message;
  if (updatedFiles.length === 0) {
    console.log('🔍 差分なし。通知はスキップされます。');
    message = '更新されたドキュメントはありません。';
  } else {
    const MAX_ITEMS = 5; // Discord通知に表示する最大件数（文字数制限対策）
    const items = updatedFiles.slice(0, MAX_ITEMS).map((filePath) => {
      const record = newManifest[filePath];
      const raw = fs.readFileSync(
        path.resolve(__dirname, '..', filePath),
        'utf8'
      );
      const { data: frontmatter } = matter(raw);

      // Windows のパス区切り文字を / に変換
      const normalizedPath = filePath.replace(/\\/g, '/');

      // website/network-docs/ を除去してドキュメントパスを取得
      const docPath = normalizedPath
        .replace(/^website\/network-docs\//, '')
        .replace(/\.(md|mdx)$/, '');

      // Docusaurusのルール：
      // 1. フロントマターに slug があればそれを使用
      // 2. index.md のみ親ディレクトリのURLになる
      // 3. その他はファイル名がそのままURLになる
      let urlPath;
      if (frontmatter.slug) {
        // slugは相対パスまたは絶対パス
        if (frontmatter.slug.startsWith('/')) {
          urlPath = 'network-docs' + frontmatter.slug;
        } else {
          const dir = path.posix.dirname(docPath);
          urlPath =
            dir === '.'
              ? `network-docs/${frontmatter.slug}`
              : `network-docs/${dir}/${frontmatter.slug}`;
        }
      } else {
        // index.md のみ親ディレクトリのURLになる
        let finalPath = docPath;
        if (docPath.endsWith('/index')) {
          finalPath = docPath.replace(/\/index$/, '');
        }
        urlPath = finalPath ? `network-docs/${finalPath}` : 'network-docs';
      }

      const name = record.title;
      const url = baseUrl + urlPath;
      // カテゴリを省略してタイトルとURLのみ表示（簡潔化）
      return `• [${name}](${url})`;
    });

    message = items.join('\n');

    // 残りの件数を追加
    if (updatedFiles.length > MAX_ITEMS) {
      const remaining = updatedFiles.length - MAX_ITEMS;
      message += `\n\n他 ${remaining} 件のドキュメントが更新されました`;
    }
  }

  fs.writeFileSync('docs_diff_message.txt', message + '\n');

  console.log(`📝 Discord通知内容:\n`);
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

main().catch((err) => {
  console.error('🔥 notify-and-vectorize 処理中にエラー:', err);
  process.exit(1);
});

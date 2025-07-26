import fs from 'fs';
import path from 'path';
import docusaurusConfig from '../docusaurus.config.js';

/**
 * git diff --name-status の出力ファイルから、
 * plugin-content-docs に定義されている path 配下の .md / .mdx ファイルだけを抽出する
 */

// docusaurus.config.js に定義されている plugin-content-docs のパス一覧を取得
function getDocPaths(config) {
  const paths = new Set();

  // plugin-content-docs (idあり構成)
  for (const plugin of config.plugins || []) {
    if (Array.isArray(plugin) && plugin[0] === '@docusaurus/plugin-content-docs') {
      const options = plugin[1];
      if (typeof options?.path === 'string') {
        paths.add(options.path);
      }
    }
  }

  // classic preset で docs: {} がある場合 → path は "docs"
  const classic = config.presets?.find(preset => Array.isArray(preset) && preset[0] === 'classic');
  const classicDocs = classic?.[1]?.docs;
  if (classicDocs !== false) {
    paths.add('docs');
  }

  return paths;
}

// 実行本体
function main() {
  const docPaths = getDocPaths(docusaurusConfig); // Set<string>
  const changedLines = fs.readFileSync('changed_files.txt', 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const filtered = changedLines.filter(line => {
    const [status, filePath] = line.split(/\s+/);
    if (!['A', 'M'].includes(status)) return false;
    if (!filePath.endsWith('.md') && !filePath.endsWith('.mdx')) return false;

    for (const p of docPaths) {
      if (filePath.startsWith(`${p}/`)) return true;
    }
    return false;
  });

  fs.writeFileSync('filtered_docs.txt', filtered.join('\n') + '\n');
  console.log(`[INFO] filtered_docs.txt: ${filtered.length} 件`);
}

main();

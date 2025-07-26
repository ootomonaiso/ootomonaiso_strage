import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const baseUrl = process.env.SITE_URL || 'https://ootomonaiso.github.io/ootomonaiso_strage/';
const changedFileList = 'filtered_docs.txt';

const pluginIds = ['docs', 'NetWork', 'IT_gyoumu', 'yoshinashi'];
const results = [];

const lines = fs.readFileSync(changedFileList, 'utf-8')
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean);

for (const line of lines) {
  const [status, filePath] = line.split(/\s+/);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(content);

  const title = data.title || path.basename(filePath, path.extname(filePath));

  // カテゴリ名の決定
  const pluginId = pluginIds.find(id => filePath.startsWith(`${id}/`));
  if (!pluginId) continue;

  // URLスラッグの生成
  const relativePath = filePath.replace(new RegExp(`^${pluginId}/`), '').replace(/\.mdx?$/, '');
  const slug = data.slug || relativePath;
  const url = `${baseUrl}${pluginId}/${slug}`;
  const label = `${pluginId}/${title}`;
  const type = status === 'A' ? '新規' : '更新';

  results.push(`- [${label}](${url})（${type}）`);
}

fs.writeFileSync('docs_diff_message.txt', results.join('\n'));

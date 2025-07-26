// script/generate-updated-docs.js
import fs from 'fs';
const baseUrl = process.env.SITE_URL || 'https://ootomonaiso.github.io/ootomonaiso_strage/';
const raw = fs.readFileSync('filtered_docs.txt', 'utf-8');
const lines = raw.trim().split('\n');

const format = line => {
  const parts = line.trim().split(/\s+/);
  if (parts.length !== 2) return null;
  const [, path] = parts;
  const name = path.split('/').pop().replace(/\.(md|mdx)$/, '');
  const url = `${baseUrl}${path.replace(/\.(md|mdx)$/, '').replace(/\/?index$/, '')}`;
  return `- [${name}](${url})`;
};

const messages = lines.map(format).filter(Boolean).join('\n');
fs.writeFileSync('docs_diff_message.txt', messages + '\n');

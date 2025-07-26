// script/generate-updated-docs.js
import fs from 'fs';

const baseUrl = process.env.SITE_URL || 'https://ootomonaiso.github.io/ootomonaiso_strage/';
const lines = fs.readFileSync('updated_docs.txt', 'utf-8').trim().split('\\n');

const format = (filePath) => {
  const name = filePath.split('/').pop().replace(/\.(md|mdx)$/, '');
  const url = baseUrl + filePath.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');

  return `- [${name}](${url})`;
};

const messages = lines.map(format).filter(Boolean).join('\\n');
fs.writeFileSync('docs_diff_message.txt', messages + '\\n');
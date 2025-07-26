import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = process.env.SITE_URL || 'https://ootomonaiso.github.io/ootomonaiso_strage/';
const updatedDocsPath = path.join(__dirname, 'updated_docs.txt');
const raw = fs.readFileSync(updatedDocsPath, 'utf-8');
const lines = raw.trim().split('\n');

const format = (filePath) => {
  const pagePath = filePath.replace(/\.(md|mdx)$/, '').replace(/\/?index$/, '');
  const url = baseUrl + pagePath;
  const name = decodeURIComponent(pagePath.split('/').pop());
  return `- [${name || pagePath}](${url})`;
};

const messages = lines.map(format).filter(Boolean).join('\n');
fs.writeFileSync(path.join(__dirname, 'docs_diff_message.txt'), messages + '\n');

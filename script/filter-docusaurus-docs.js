// script/filter-docusaurus-docs.js
import fs from 'fs';
const changedFiles = fs.readFileSync('changed_files.txt', 'utf-8').split('\n');
const configPaths = JSON.parse(fs.readFileSync('docusaurus-docs-paths.json', 'utf-8'));
const docExtensions = ['.md', '.mdx'];

const filtered = changedFiles
  .filter(line => {
    const parts = line.trim().split(/\s+/);
    if (parts.length !== 2) return false;
    const [, filePath] = parts;
    return configPaths.some(dir => filePath.startsWith(dir + '/')) &&
           docExtensions.some(ext => filePath.endsWith(ext));
  });

fs.writeFileSync('filtered_docs.txt', filtered.join('\n') + '\n');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// SHA256 hash function
function computeHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

async function listUpdatedFiles() {
  const files = glob.sync('../pro/**/*.{md,mdx}', {
    ignore: ['../pro/node_modules/**']
  });

  const updatedFiles = [];

  for (const filePath of files) {
    const fullPath = path.resolve(filePath);
    const relativePath = path.relative(path.resolve(__dirname, '..'), fullPath);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { content } = matter(raw);
    const cleanedContent = content.trim();
    const localHash = computeHash(cleanedContent);

    const { data: record, error } = await supabase
      .from('documents')
      .select('hash')
      .eq('file_path', relativePath)
      .single();

    if (error || !record || record.hash !== localHash) {
      updatedFiles.push(relativePath);
    }
  }

  fs.writeFileSync('updated_docs.txt', updatedFiles.join('\n') + '\n');
  console.log('✅ updated_docs.txt generated');
}

listUpdatedFiles()
  .then(() => console.log('🎉 Done'))
  .catch((err) => console.error('🔥 Error listing updated files:', err));

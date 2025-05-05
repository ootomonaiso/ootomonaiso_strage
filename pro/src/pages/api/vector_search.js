import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@xenova/transformers';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { query } = req.body;
  try {
    const embedding = (await embedder(query))[0];

    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.8,
      match_count: 5
    });

    if (error) throw error;
    res.status(200).json({ candidates: data });
  } catch (err) {
    console.error('ベクトル検索エラー:', err);
    res.status(500).json({ error: 'ベクトル検索に失敗しました' });
  }
}
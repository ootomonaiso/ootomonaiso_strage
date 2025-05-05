import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { embedding } = req.body;
  if (!embedding || !Array.isArray(embedding)) {
    return res.status(400).json({ error: '埋め込みベクトルが必要です' });
  }

  try {
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

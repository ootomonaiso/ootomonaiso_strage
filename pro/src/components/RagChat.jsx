import React, { useState, useEffect, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * @typedef {Object} Candidate
 * @property {string} file_path
 * @property {string} content
 */

function RagChat() {
  const [query, setQuery] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  /** @type {[Candidate[], Function]} */
  const [candidates, setCandidates] = useState([]);
  const [modelLoaded, setModelLoaded] = useState(false);
  /** @type {React.MutableRefObject<any>} */
  const embedderRef = useRef(null);

  const ctx = useDocusaurusContext();
  const GEMINI_API_KEY = ctx?.siteConfig?.customFields?.geminiApiKey ?? '';

  useEffect(() => {
    async function loadModel() {
      const { pipeline } = await import('@xenova/transformers');
      const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      embedderRef.current = embedder;
      setModelLoaded(true);
    }
    loadModel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelLoaded) {
      alert('モデルの読み込み中です。少しお待ちください…');
      return;
    }
    setLoading(true);
    setResponseText('');
    try {
      const candidateLinks = await fetchCandidateLinks(query);
      setCandidates(candidateLinks);
      const ragResponse = await generateRagResponse(query, candidateLinks);
      setResponseText(ragResponse);
    } catch (error) {
      console.error('Error during RAG process:', error);
      setResponseText('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  /** @param {string} query */
  async function fetchCandidateLinks(query) {
    if (!embedderRef.current) throw new Error('BERTモデルがまだ読み込まれていません');

    const embedding = (await embedderRef.current(query))[0];

    const response = await fetch('/api/vector_search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embedding }),
    });
    if (!response.ok) throw new Error('Candidate search failed');
    const data = await response.json();
    return data.candidates;
  }

  /**
   * @param {string} query
   * @param {Candidate[]} candidates
   */
  async function generateRagResponse(query, candidates) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `質問: ${query}\n候補文献:\n${candidates
                    .map((c, i) => `${i + 1}. ${c.file_path}\n---\n${c.content.substring(0, 200)}...`)
                    .join('\n\n')}`,
                },
              ],
            },
          ],
        }),
      }
    );
    if (!response.ok) throw new Error('Response generation failed');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '回答なし';
  }

  return (
    <div style={{ padding: '1em', maxWidth: '800px', margin: '0 auto' }}>
      <h2>RAG チャットツール</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          placeholder="質問を入力してください..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '80%', padding: '0.5em' }}
        />
        <button type="submit" style={{ padding: '0.5em 1em', marginLeft: '0.5em' }}>
          送信
        </button>
      </form>
      {!modelLoaded && <p>🔄 モデル読み込み中...</p>}
      {loading && <p>回答を生成中...</p>}
      {responseText && (
        <div style={{ marginTop: '1em', padding: '1em', background: '#f0f0f0' }}>
          <strong>回答:</strong>
          <p>{responseText}</p>
        </div>
      )}
      {candidates.length > 0 && (
        <div style={{ marginTop: '1em' }}>
          <h3>関連記事候補</h3>
          <ul>
            {candidates.map((item, idx) => (
              <li key={idx}>
                <a
                  href={`/${item.file_path.replace(/\.md$/, '').replace(/^docs\//, 'docs/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.file_path}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RagChat;

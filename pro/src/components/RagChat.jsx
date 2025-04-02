// RagChat.jsx
import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'; // Docusaurus の設定情報を取得

function RagChat() {
  const [query, setQuery] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);

  // Docusaurus のコンテキストからカスタムフィールド（API キー）を取得
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const GEMINI_API_KEY = customFields.geminiApiKey;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseText('');
    try {
      // 1. クエリをベクトル化
      const queryEmbedding = await getQueryEmbedding(query);
      // 2. 候補記事のリンク情報を取得
      const candidateLinks = await fetchCandidateLinks(queryEmbedding);
      setCandidates(candidateLinks);
      // 3. 候補を元に回答を生成
      const ragResponse = await generateRagResponse(query, candidateLinks);
      setResponseText(ragResponse);
    } catch (error) {
      console.error('Error during RAG process:', error);
      setResponseText('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  // Gemini API を用いてクエリの埋め込み（ベクトル）を取得する関数
  async function getQueryEmbedding(query) {
    const response = await fetch('https://api.gemini.example.com/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ text: query }),
    });
    if (!response.ok) throw new Error('Failed to get query embedding');
    const data = await response.json();
    return data.embedding;
  }

  // 候補記事情報を取得するための API 呼び出し関数
  async function fetchCandidateLinks(queryEmbedding) {
    const response = await fetch('https://your-api.example.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryEmbedding }),
    });
    if (!response.ok) throw new Error('Candidate search failed');
    const data = await response.json();
    return data.candidates;
  }

  // Gemini API を使用して候補情報を元に最終回答を生成する関数
  async function generateRagResponse(query, candidates) {
    const response = await fetch('https://api.gemini.example.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ query, context: candidates }),
    });
    if (!response.ok) throw new Error('Response generation failed');
    const data = await response.json();
    return data.response;
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
      {loading ? <p>回答を生成中...</p> : null}
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
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
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

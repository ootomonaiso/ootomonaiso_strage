// RagChat.jsx
import React, { useState } from 'react';

// Gemini API を利用してクエリをベクトル化する関数
async function getQueryEmbedding(query) {
  const response = await fetch('https://api.gemini.example.com/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}`,
    },
    body: JSON.stringify({ text: query }),
  });
  if (!response.ok) throw new Error('Failed to get query embedding');
  const data = await response.json();
  return data.embedding;
}

// Supabase API（または専用 API）を呼び出して候補記事のリンク情報を取得する関数
async function fetchCandidateLinks(queryEmbedding) {
  const response = await fetch('https://your-api.example.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queryEmbedding }),
  });
  if (!response.ok) throw new Error('Candidate search failed');
  const data = await response.json();
  // data.candidates に候補記事のメタ情報（タイトル、URL 等）が含まれている前提
  return data.candidates;
}

// Gemini API を利用して、候補記事情報を元に最終回答を生成する関数
async function generateRagResponse(query, candidates) {
  const response = await fetch('https://api.gemini.example.com/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      context: candidates, // 候補記事の情報をコンテキストとして渡す
    }),
  });
  if (!response.ok) throw new Error('Response generation failed');
  const data = await response.json();
  return data.response;
}

function RagChat() {
  const [query, setQuery] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseText('');
    try {
      // 1. 検索クエリのベクトル化
      const queryEmbedding = await getQueryEmbedding(query);
      // 2. ベクトル検索で候補記事のリンク情報を取得
      const candidateLinks = await fetchCandidateLinks(queryEmbedding);
      setCandidates(candidateLinks);
      // 3. 候補をもとに回答生成
      const ragResponse = await generateRagResponse(query, candidateLinks);
      setResponseText(ragResponse);
    } catch (error) {
      console.error('Error during RAG process:', error);
      setResponseText('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

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

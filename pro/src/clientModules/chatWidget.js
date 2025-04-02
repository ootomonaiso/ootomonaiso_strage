// src/clientModules/chatWidget.js
import React from 'react';
import ReactDOM from 'react-dom';
import RagChatWidget from '../components/RagChatWidget';

// ページ全体にウィジェットを追加するための div を作成して body に追加
const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

ReactDOM.render(<RagChatWidget />, mountNode);

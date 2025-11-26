# Obsidian プラグインガイド

## 📦 導入済みプラグイン

### 🎯 必須プラグイン

#### 1. **Obsidiosaurus** (Docusaurus 連携)

**用途**: Obsidian から Docusaurus への記事変換

**使い方**:

- `Ctrl+P` → "Obsidiosaurus: Convert"
- `vault/`の記事を`website/`へ自動変換
- メタデータ、画像パス、リンクを自動調整

**設定のコツ**:

- フロントマターは必ず記入
- 画像は`vault/assets/`に配置

#### 2. **Obsidian Git** (自動バックアップ)

**用途**: Git 操作の自動化

**設定済み**:

- 自動コミット: 30 分毎
- 自動プル: 10 分毎
- プッシュ前にプル実行

**手動操作**:

- `Ctrl+P` → "Obsidian Git: Commit"
- `Ctrl+P` → "Obsidian Git: Push"
- `Ctrl+P` → "Obsidian Git: Pull"

**複数人開発のポイント**:

```
1. 執筆開始前: 自動プルされているか確認
2. 執筆中: 30分毎に自動コミット
3. 執筆終了: 手動でプッシュ推奨
```

#### 3. **Obsidian Linter** (Markdown 整形)

**用途**: Markdown 文法の自動修正

**機能**:

- 連続空行の削除
- 見出し前後の空行追加
- トレーリングスペース削除
- 保存時自動整形

**設定**:

- 保存時に自動実行
- Docusaurus 互換の設定済み

### 🎨 執筆支援プラグイン

#### 4. **Admonition** (コールアウト)

**用途**: 情報ボックスの作成

**使い方**:

```markdown
:::note
これはノートです
:::

:::tip
これは TIP です
:::

:::warning
これは警告です
:::

:::danger
これは危険情報です
:::
```

Docusaurus と完全互換!

#### 5. **Excalidraw** (図解作成)

**用途**: 手書き風図解の作成

**使い方**:

1. `Ctrl+P` → "Excalidraw: Create new drawing"
2. 図を作成
3. Markdown 内で `![[drawing.excalidraw]]`

**連携**:

- SVG/PNG エクスポート可能
- Docusaurus に自動変換

#### 6. **Diagrams.net** (フローチャート)

**用途**: draw.io 図の埋め込み

**使い方**:

1. `Ctrl+P` → "Diagrams.net: Create new diagram"
2. フローチャート作成
3. 自動で画像として保存

### 📋 プロジェクト管理プラグイン

#### 7. **Templater** (推奨追加)

**用途**: 高度なテンプレート自動化

**インストール後の設定**:

1. Settings → Templater
2. Template folder: `templates`
3. Trigger on file creation: ON

**使い方**:

```markdown
---
title: { { title } }
date: { { date:YYYY-MM-DD } }
author: { { user } }
---
```

#### 8. **Dataview** (推奨追加)

**用途**: 記事一覧・進捗管理

**使用例**:

````markdown
## 未完成の記事

\```dataview
TABLE description, sidebar_position
FROM "docs"
WHERE !completed
SORT file.mtime DESC
\```
````

#### 9. **Kanban** (推奨追加)

**用途**: タスクボード

**使い方**:

1. 新規ファイル作成
2. `Ctrl+P` → "Kanban: Create new board"
3. カラムを作成: TODO → In Progress → Done

**複数人開発での活用**:

- 記事執筆の進捗管理
- レビュー待ちの記事を可視化
- 担当者の割り当て

#### 10. **Calendar** (推奨追加)

**用途**: 執筆スケジュール管理

**機能**:

- カレンダービューで記事作成日を表示
- 日次ノートの作成
- 執筆の習慣化

#### 11. **Table Editor** (推奨追加)

**用途**: Markdown テーブルの編集

**機能**:

- Excel ライクな編集
- セルの追加・削除
- CSV インポート

### 🔧 ユーティリティ

#### 12. **Attachment Management**

**用途**: 画像ファイルの自動整理

**設定済み**:

- 画像は`assets/`フォルダへ自動移動
- 記事削除時に未使用画像を検出

#### 13. **QuickAdd**

**用途**: クイックアクション

**活用例**:

- 新規記事の高速作成
- テンプレート選択の自動化

## ⚙️ 推奨設定

### app.json

```json
{
  "useMarkdownLinks": true, // Wikilinksではなく[]()形式
  "attachmentFolderPath": "assets", // 画像の保存先
  "alwaysUpdateLinks": true, // ファイル移動時にリンク自動更新
  "showFrontmatter": true // フロントマター表示
}
```

### 複数人開発の設定ポイント

#### 1. Git 設定

- 自動プル: 10 分
- 自動コミット: 30 分
- プッシュ前に必ずプル

#### 2. Linter 設定

- 保存時自動整形
- チーム統一フォーマット

#### 3. テンプレート

- `templates/`フォルダで共有
- メタデータの記入漏れ防止

## 🚀 プラグインインストール手順

### 推奨プラグインの追加

1. Settings → Community plugins
2. Browse
3. 以下を検索してインストール:
   - Templater
   - Dataview
   - Kanban
   - Calendar
   - Table Editor

### 自動インストール

このリポジトリをクローン後、Obsidian で`vault/`を開くと、`community-plugins.json`に基づいて自動的にプラグインがインストールされます。

## 📝 ワークフロー例

### 記事作成フロー

```
1. Calendar で執筆予定を確認
2. Templater でテンプレート挿入
3. Excalidraw/Diagrams.net で図解作成
4. Admonition でコールアウト追加
5. Linter で自動整形
6. Git で自動コミット
7. Obsidiosaurus で変換
8. Docusaurus でプレビュー
```

### プロジェクト管理フロー

```
1. Kanban で記事タスク作成
2. Dataview で進捗一覧表示
3. Calendar で締切管理
4. Git で共同執筆
```

## 🐛 トラブルシューティング

### Q. プラグインがインストールされない

A. Settings → Community plugins → "Turn on community plugins"

### Q. Git 自動プルでコンフリクト

A. 手動でマージするか、Stash してからプル

### Q. Templater が動かない

A. Settings → Templater → Template folder: `templates`

### Q. 画像パスがおかしい

A. `app.json`で`attachmentFolderPath: "assets"`を確認

## 📚 参考リンク

- [Obsidian Plugin Directory](https://obsidian.md/plugins)
- [Obsidian Git](https://github.com/denolehov/obsidian-git)
- [Templater](https://silentvoid13.github.io/Templater/)
- [Dataview](https://blacksmithgu.github.io/obsidian-dataview/)

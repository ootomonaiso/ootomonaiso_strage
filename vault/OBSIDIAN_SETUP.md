# Obsidian プロジェクト設定ガイド

## 🎯 初回セットアップ

### 1. Obsidianでvaultを開く
1. Obsidianを起動
2. 「Open folder as vault」を選択
3. `vault/`フォルダを選択

### 2. 必須プラグインのインストール

#### Obsidiosaurus(必須)
1. Settings → Community plugins
2. Browse → "Obsidiosaurus"で検索
3. Install & Enable

#### Obsidian Git(推奨)
自動コミット・プッシュ機能
1. Browse → "Obsidian Git"で検索
2. Install & Enable
3. 設定:
   - Auto pull: 10分
   - Auto backup: 30分
   - Auto pull on mobile: ON

#### Templater(推奨)
テンプレート自動化
1. Browse → "Templater"で検索
2. Install & Enable
3. Template folder: `templates/`

### 3. 推奨設定

#### Files & Links
- Default location for new notes: `docs/`
- Default location for new attachments: `assets/`
- Use [[Wikilinks]]: OFF(Markdownリンク推奨)

#### Editor
- Strict line breaks: ON
- Show frontmatter: ON
- Default view: Editing view

## 🔧 複数人開発の推奨設定

### チーム共有する設定
`.obsidian/`配下で共有すべきファイル:
- `plugins/`: プラグイン本体
- `community-plugins.json`: 有効化プラグインリスト
- `templates/`: テンプレート
- `snippets/`: カスタムCSS

### 個人で保持する設定
gitignoreに追加済み:
- `workspace.json`: ウィンドウレイアウト
- `workspace-mobile.json`: モバイル設定
- `graph.json`: グラフビュー設定
- `cache/`: キャッシュ

## 📝 執筆ワークフロー

### 記事作成
1. `Ctrl+N`で新規ノート
2. テンプレート選択
3. メタデータ入力
4. 本文執筆

### プレビュー
1. `Ctrl+E`でプレビューモード
2. または右ペインでプレビュー表示

### Git操作
- `Ctrl+P` → "Obsidian Git: Commit"
- 自動バックアップ有効時は自動コミット

## 🎨 おすすめプラグイン

### 執筆効率化
- **Templater**: テンプレート自動化
- **Calendar**: 執筆スケジュール管理
- **Periodic Notes**: 日次ノート

### 記事管理
- **Dataview**: 記事一覧・メタデータ集計
- **Kanban**: 進捗ボード
- **Tag Wrangler**: タグ管理

### ビジュアル
- **Excalidraw**: 図解作成
- **Admonition**: コールアウト作成
- **Editor Syntax Highlight**: コードハイライト

## 🐛 よくある問題

### Q. 画像が表示されない
A. `vault/assets/`に配置し、パスを `/assets/image.png` 形式で記述

### Q. リンクが動かない
A. Wikilinks(`[[]]`)ではなくMarkdownリンク(`[]()`)を使用

### Q. frontmatterが崩れる
A. YAMLシンタックスを確認。コロンの後にスペース必須

### Q. 自動コミットされない
A. Obsidian Gitの設定確認。Git認証情報も確認

## 🔗 参考リンク
- [Obsidian公式ドキュメント](https://help.obsidian.md/)
- [Obsidiosaurus GitHub](https://github.com/CIMSTA/obsidiosaurus)
- [Docusaurus Markdown](https://docusaurus.io/docs/markdown-features)

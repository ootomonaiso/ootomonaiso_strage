# VSCode 拡張機能ガイド

## 📦 必須拡張機能

### 1. **Markdown All in One** (`yzhang.markdown-all-in-one`)
Markdown執筆の必須ツール
- ショートカット: `Ctrl+B`(太字)、`Ctrl+I`(斜体)
- 目次自動生成
- リスト自動整形
- プレビュー機能

### 2. **markdownlint** (`DavidAnson.vscode-markdownlint`)
Markdownの文法チェック
- リアルタイム警告表示
- 自動修正機能
- Docusaurus互換設定済み

### 3. **GitLens** (`eamodio.gitlens`)
Git履歴の可視化
- 行ごとの編集履歴表示
- コミット履歴検索
- ブランチ比較

## 🎨 推奨拡張機能

### Obsidian連携系

#### **Foam** (`foam.foam-vscode`)
VSCodeをObsidian風に
- `[[wikilinks]]`サポート
- バックリンク表示
- グラフビュー
- デイリーノート作成

使い方:
```
Ctrl+Shift+P → "Foam: Show Graph"
```

#### **Dendron Markdown Shortcuts** (`dendron.dendron-markdown-shortcuts`)
Markdown記法の拡張
- バックリンク補完
- タグ補完

### Git管理系

#### **GitHub Pull Requests** (`GitHub.vscode-pull-request-github`)
VSCode内でPR管理
- PR作成・レビュー
- コメント追加
- マージ操作

#### **Git Graph** (`mhutchie.git-graph`)
ビジュアルなGit履歴
- ブランチツリー表示
- コミット検索
- チェリーピック

### プロジェクト管理系

#### **TODO Tree** (`Gruntfuggly.todo-tree`)
TODOコメントを一覧表示
```markdown
<!-- TODO: この記事を完成させる -->
<!-- FIXME: リンク切れ修正 -->
<!-- NOTE: 参考情報 -->
```

サイドバーに一覧表示されます。

#### **Better Comments** (`aaron-bond.better-comments`)
コメントを色分け
```javascript
// TODO: 実装予定
// ! 重要な警告
// ? 疑問点
// * ハイライト
```

### 開発系

#### **Prettier** (`esbenp.prettier-vscode`)
コード整形
- 保存時自動整形
- チーム統一フォーマット

#### **Error Lens** (`usernamehw.errorlens`)
エラーをインラインで表示
- リアルタイムエラー表示
- 警告も表示

### ユーティリティ

#### **Path Intellisense** (`christian-kohler.path-intellisense`)
パス補完
```markdown
![画像](/assets/image.png) ← 補完が効く
```

#### **Code Spell Checker** (`streetsidesoftware.code-spell-checker`)
スペルチェック
- 英単語のタイポを検出
- カスタム辞書対応

## ⚙️ 推奨設定

`.vscode/settings.json`に以下を設定済み:

### Markdown
- 保存時自動整形
- プレビューでリンク有効化
- 行の長さ制限なし

### Git
- 自動フェッチ
- スマートコミット有効

### パス
- `vault/`を`/`にマッピング
- `website/src/`を`@`にマッピング

## 🎯 便利なショートカット

### Markdown編集
- `Ctrl+B`: 太字
- `Ctrl+I`: 斜体
- `Ctrl+Shift+V`: プレビュー
- `Ctrl+K V`: サイドプレビュー

### Git操作
- `Ctrl+Shift+G`: Git パネル
- `Ctrl+Enter`: コミット

### 検索
- `Ctrl+P`: ファイル検索
- `Ctrl+Shift+F`: 全体検索
- `Ctrl+T`: シンボル検索

### Foam機能
- `Ctrl+Shift+P` → "Foam: Show Graph": グラフビュー
- `Alt+D`: デイリーノート作成

## 🔧 カスタマイズ例

### ワークスペース固有の設定
`.vscode/settings.json`で設定:

```json
{
  "editor.wordWrap": "on",  // 行の折り返し
  "files.autoSave": "afterDelay",  // 自動保存
  "terminal.integrated.cwd": "${workspaceFolder}/website"  // ターミナル開始位置
}
```

### ユーザー辞書追加
`cSpell.words`に専門用語を追加:
```json
{
  "cSpell.words": [
    "Docusaurus",
    "Obsidian",
    "プロジェクト固有の用語"
  ]
}
```

## 🚀 インストール方法

### 一括インストール
```bash
# 拡張機能IDをコピーして
code --install-extension yzhang.markdown-all-in-one
code --install-extension eamodio.gitlens
# ...
```

### または
1. VSCodeで`Ctrl+Shift+X`
2. 拡張機能名で検索
3. Install

このリポジトリをクローン後、VSCodeが自動的に推奨拡張機能をインストールするよう促します。

## 📚 参考リンク
- [VSCode Markdown](https://code.visualstudio.com/docs/languages/markdown)
- [Foam公式](https://foambubble.github.io/foam/)
- [GitLens](https://gitlens.amod.io/)

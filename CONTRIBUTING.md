# 貢献ガイド

## 🚀 開発フロー

### ブランチ戦略
- `master`: 本番環境(GitHub Pages)
- `develop`: 開発環境(プレビュービルド)
- `feature/*`: 新機能開発
- `fix/*`: バグ修正

### 記事作成フロー

1. **developブランチから作業ブランチを作成**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-article-name
   ```

2. **Obsidianで記事を作成**
   - `vault/`配下で執筆
   - テンプレート: `vault/templates/docusaurus-doc-template.md`

3. **VSCodeで確認**
   ```bash
   cd website
   npm install
   npm start
   ```

4. **コミット & プッシュ**
   ```bash
   git add .
   git commit -m "feat: 記事タイトル"
   git push origin feature/your-article-name
   ```

5. **Pull Request作成**
   - `develop`ブランチへPR作成
   - レビュー後マージ
   - `master`への昇格は定期リリース時

## 📝 記事作成ルール

### ファイル配置
- 業務IT: `vault/IT_gyoumu_docs/`
- ネットワーク: `vault/NetWork_docs/`
- よしなし: `vault/yoshinashi_docs/`
- ブログ: `vault/blog/`

### メタデータ必須項目
```markdown
---
sidebar_position: 1
description: 記事の説明(必須)
---
```

### カテゴリ追加時
`docusaurus.config.js`に以下を追加:
1. `plugins`配列
2. `themeConfig.items`
3. `footer.links`

詳細は`.github/copilot-instructions.md`参照

## 🔧 Obsidian設定

### 必須プラグイン
- Obsidiosaurus (Docusaurus連携)
- Templater (テンプレート自動化)
- Obsidian Git (自動コミット・推奨)

### 推奨プラグイン
- Dataview (記事管理)
- Kanban (進捗管理)
- Calendar (執筆予定)

### 設定ファイル
- `.obsidian/plugins/`: 共有
- `.obsidian/workspace.json`: 個人設定(gitignore)

## 🤝 複数人開発のベストプラクティス

### 1. コンフリクト回避
- 同じ記事を同時編集しない
- GitHub Issues/Projectsでタスク管理
- 定期的に`develop`をpull

### 2. レビューポイント
- メタデータの記入漏れ
- 画像パスの確認(`assets/`配下)
- リンク切れチェック
- ビルドエラーの有無

### 3. コミットメッセージ
```
feat: 新機能・記事追加
fix: バグ修正・誤字修正
docs: ドキュメント更新
style: フォーマット修正
refactor: リファクタリング
```

## 🐛 トラブルシューティング

### Obsidianで画像が表示されない
- `vault/assets/`に配置
- パスを絶対パスで記述: `/assets/image.png`

### ビルドエラー
```bash
cd website
npm run clear
npm install
npm run build
```

### マージコンフリクト
```bash
git checkout develop
git pull origin develop
git checkout your-branch
git merge develop
# コンフリクト解消後
git commit
git push
```

## 📚 参考資料
- [Docusaurus公式](https://docusaurus.io/)
- [Obsidian公式](https://obsidian.md/)
- [Obsidiosaurus](https://github.com/CIMSTA/obsidiosaurus)

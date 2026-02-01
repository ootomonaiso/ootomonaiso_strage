# 📚 執筆から公開までの完全ワークフロー

## 🎯 概要

Obsidian → Git → GitHub Actions → Docusaurus → GitHub Pages

## 🚀 パターン 1: 個人執筆

### 1. 準備

```bash
# 最新版を取得
git checkout develop
git pull origin develop
```

### 2. Obsidian で執筆

1. Obsidian を起動
2. `Ctrl+P` → "Templater: Create from template"
3. テンプレート選択(ドキュメント/ブログ)
4. メタデータ入力:
   ```markdown
   ---
   sidebar_position: 1
   description: 記事の説明
   ---
   ```
5. 本文執筆
6. 図解作成(Excalidraw/Diagrams.net)
7. 画像は`assets/`フォルダにドラッグ

### 3. 自動バックアップ

- 30 分毎に自動コミット
- 10 分毎に自動プル
- ステータスバーで確認

### 4. ローカルプレビュー

```bash
# VSCodeのターミナルで
cd website
npm start
```

→ http://localhost:3000 で確認

### 5. 手動プッシュ(推奨)

Obsidian 内:

- `Ctrl+P` → "Obsidian Git: Push"

または:

```bash
git push origin develop
```

### 6. 本番デプロイ

```bash
# developで問題なければmasterへ
git checkout master
git merge develop
git push origin master
```

→ GitHub Actions が自動デプロイ

## 🤝 パターン 2: 複数人執筆

### 1. タスク管理(GitHub Issues)

1. Issues → New issue
2. テンプレート選択: "新規記事作成"
3. 情報入力:
   - カテゴリ
   - タイトル
   - 担当者
4. Issue に番号が付与(例: #15)

### 2. 作業ブランチ作成

```bash
git checkout develop
git pull origin develop
git checkout -b feature/article-name-#15
```

### 3. Kanban で進捗管理(Obsidian)

1. `執筆進捗.md`を開く
2. Kanban ボード:
   ```
   TODO | In Progress | Review | Done
   ```
3. 自分のタスクを"In Progress"へ移動

### 4. 執筆(同上)

- Obsidian で執筆
- 自動バックアップ有効
- 定期的にプッシュ

### 5. コンフリクト回避

```bash
# こまめにdevelopの変更を取り込む
git checkout develop
git pull origin develop
git checkout feature/article-name-#15
git merge develop

# コンフリクトがあれば解決
```

### 6. Pull Request 作成

1. 作業完了後、GitHub へ移動
2. "Compare & pull request"
3. PR テンプレートに従って記入:
   - 変更内容
   - チェックリスト確認
   - スクリーンショット添付
4. Reviewers 指定
5. Create pull request

### 7. レビュー

**レビュアー**:

- コードタブで Markdown を確認
- Files changed で差分確認
- コメント追加
- Approve または Request changes

**執筆者**:

- コメントに対応
- 修正をプッシュ
- 再レビュー依頼

### 8. マージ

- レビュー承認後
- "Merge pull request"
- develop ブランチにマージ完了

### 9. 定期リリース

週 1 回など定期的に:

```bash
git checkout master
git merge develop
git push origin master
```

→ GitHub Pages に自動デプロイ

## 📋 チェックリスト

### 執筆前

- [ ] `git pull`で最新版取得
- [ ] 作業ブランチ作成
- [ ] Kanban で進捗更新
- [ ] Issue を確認

### 執筆中

- [ ] メタデータ記入
- [ ] 画像は`assets/`に配置
- [ ] Markdown リンク使用(`[]()`)
- [ ] こまめにコミット

### 執筆後

- [ ] ローカルビルド確認
- [ ] プレビュー確認
- [ ] 誤字脱字チェック
- [ ] リンク切れチェック

### PR 作成前

- [ ] develop の最新を取り込み
- [ ] コンフリクト解消
- [ ] ビルドエラーなし
- [ ] PR テンプレート記入

### レビュー

- [ ] 内容確認
- [ ] 文法チェック
- [ ] 画像表示確認
- [ ] リンク動作確認

## 🛠️ ツール連携

### Obsidian

- **執筆**: メインエディタ
- **Git**: 自動バックアップ
- **Kanban**: 進捗管理
- **Dataview**: 記事一覧

### VSCode

- **コーディング**: 設定ファイル編集
- **プレビュー**: Docusaurus 開発サーバー
- **Git**: 詳細な Git 操作

### GitHub

- **Issues**: タスク管理
- **Projects**: プロジェクトボード
- **Pull Requests**: レビュー
- **Actions**: 自動デプロイ

## 🔄 日常的なフロー

### 毎日のルーチン

```
1. Obsidian起動
2. Git自動プル(10分毎)
3. 執筆
4. Git自動コミット(30分毎)
5. 終了時に手動プッシュ
```

### 週次のルーチン

```
1. Kanbanで進捗確認
2. developをmasterにマージ
3. 本番デプロイ
4. 次週の計画
```

## 🐛 よくある問題と解決

### コンフリクト発生

```bash
# Stashして最新を取得
git stash
git pull origin develop
git stash pop

# コンフリクトを手動で解決
# <<<<<<< HEAD と ======= の間を編集
```

### プッシュできない

```bash
# リモートの変更を先に取り込む
git pull --rebase origin develop
git push origin feature/your-branch
```

### ビルドエラー

```bash
cd website
npm run clear
rm -rf node_modules
npm install
npm run build
```

### Obsidian Git が動かない

1. Settings → Obsidian Git
2. "Test connection"をクリック
3. 認証情報を確認

## 📚 参考コマンド

### Git 基本

```bash
# 状態確認
git status

# 変更を見る
git diff

# コミット履歴
git log --oneline --graph

# ブランチ一覧
git branch -a
```

### npm 基本

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm start

# ビルド
npm run build

# ビルド確認
npm run serve
```

## 🎓 ベストプラクティス

1. **こまめにコミット**: 小さな単位で変更を保存
2. **わかりやすいコミットメッセージ**: `feat: 記事タイトル追加`
3. **ブランチは小さく**: 1 記事 = 1 ブランチ
4. **レビューは早めに**: 溜め込まない
5. **コンフリクトは早期解決**: develop を定期的にマージ

これで執筆から公開までスムーズに進められます!

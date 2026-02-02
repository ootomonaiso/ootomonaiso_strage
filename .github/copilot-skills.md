# GitHub Copilot Skills

このファイルでは、リポジトリでの一般的なタスクを実行するためのスキルを定義します。

## 目次

1. [新しいドキュメント記事を作成する](#新しいドキュメント記事を作成する)
2. [新しいカテゴリを追加する](#新しいカテゴリを追加する)
3. [ブログ記事を作成する](#ブログ記事を作成する)
4. [画像を記事に追加する](#画像を記事に追加する)
5. [サイドバーを更新する](#サイドバーを更新する)

---

## 新しいドキュメント記事を作成する

**目的**: 既存のカテゴリ内に新しいドキュメント記事を作成する

**手順**:

1. 適切なカテゴリディレクトリを特定する（`vault/IT_gyoumu_docs/`、`vault/NetWork_docs/`、`vault/yoshinashi_docs/`のいずれか）
2. 以下のテンプレートを使用して新しい`.md`ファイルを作成する:

   ```markdown
   ---
   sidebar_position: [数値]
   description: [記事の説明]
   ---

   ## [タイトル]

   [内容]
   ```

3. `sidebar_position`は既存の記事の順序を考慮して設定する
4. Docusaurus特有のコンポーネントを活用する（`:::info`、`:::tip`、`:::warning`、`:::danger`）

**関連ファイル**:

- `vault/IT_gyoumu_docs/**/*.md`
- `vault/NetWork_docs/**/*.md`
- `vault/yoshinashi_docs/**/*.md`

**例**:

```markdown
---
sidebar_position: 3
description: MySQLの基本的な使い方について説明します
---

## MySQLの基本

:::info
この記事ではMySQL 8.0を対象としています。
:::

### インストール

...
```

---

## 新しいカテゴリを追加する

**目的**: Docusaurusサイトに新しいドキュメントカテゴリを追加する

**手順**:

1. `vault/`ディレクトリに新しいカテゴリディレクトリを作成する（例: `vault/new_category_docs/`）
2. `intro.md`と`_category_.json`（必要に応じて）を作成する
3. `website/docusaurus.config.js`を更新する:
   - **pluginsセクション**に新しいカテゴリを追加:
     ```javascript
     [
       '@docusaurus/plugin-content-docs',
       {
         id: 'new-category-docs',
         path: 'new-category-docs',
         routeBasePath: 'new-category-docs',
         sidebarPath: require.resolve('./sidebars.js'),
         editUrl: 'https://github.com/ootomonaiso/ootomonaiso_strage',
       },
     ],
     ```
   - **themeConfig.navbar.items**にナビゲーション項目を追加:
     ```javascript
     {
       to: '/new-category-docs/intro',
       position: 'left',
       label: '新しいカテゴリ',
     },
     ```
   - **themeConfig.footer.links**にフッターリンクを追加:
     ```javascript
     {
       label: '新しいカテゴリ',
       to: '/new-category-docs/intro',
     },
     ```
4. `website/`ディレクトリに対応するディレクトリを作成する（例: `website/new-category-docs/`）

**関連ファイル**:

- `website/docusaurus.config.js`
- `vault/[category]_docs/`
- `website/[category]-docs/`

**注意事項**:

- ディレクトリ名にはケバブケースを使用する
- `id`、`path`、`routeBasePath`の一貫性を保つ
- 既存のカテゴリ構造を参考にする

---

## ブログ記事を作成する

**目的**: 新しいブログ記事を作成する

**手順**:

1. `vault/blog/`ディレクトリに新しい`.md`ファイルを作成する
2. ファイル名は`YYYY-MM-DD-[slug].md`の形式にする
3. 以下のフロントマターを含める:

   ```markdown
   ---
   slug: [記事のスラッグ]
   title: [記事のタイトル]
   authors: [著者名]
   tags: [タグ1, タグ2, ...]
   ---

   [記事の内容]
   ```

4. 画像が必要な場合は、`vault/blog/img/YYYY-MM-DD/`ディレクトリに配置する
5. 著者情報が必要な場合は、`vault/blog/authors.yml`を更新する

**関連ファイル**:

- `vault/blog/*.md`
- `vault/blog/authors.yml`
- `vault/blog/img/**/*`

**例**:

```markdown
---
slug: mysql-performance-tips
title: MySQLパフォーマンス最適化のヒント
authors: ootomonaiso
tags: [mysql, database, performance]
---

この記事では、MySQLのパフォーマンスを向上させるためのヒントを紹介します。

<!-- truncate -->

## インデックスの最適化

...
```

---

## 画像を記事に追加する

**目的**: ドキュメントやブログ記事に画像を追加する

**手順**:

1. **ドキュメント記事の場合**:
   - 画像を`vault/[category]_docs/[article-folder]/images/`に配置する
   - Markdownで参照: `![説明](./images/image-name.png)`

2. **ブログ記事の場合**:
   - 画像を`vault/blog/img/YYYY-MM-DD/`に配置する
   - Markdownで参照: `![説明](./img/YYYY-MM-DD/image-name.png)`

3. 画像のaltテキストを必ず記述する
4. 画像サイズが大きい場合は、事前に最適化する

**関連ファイル**:

- `vault/IT_gyoumu_docs/**/images/*`
- `vault/NetWork_docs/**/images/*`
- `vault/blog/img/**/*`

**例**:

```markdown
![Eclipse IDEのインストール画面](./images/eclipse-install.png)
```

---

## サイドバーを更新する

**目的**: カテゴリのサイドバー構造を更新する

**手順**:

1. `website/sidebars.js`を開く
2. 該当するカテゴリのサイドバー設定を見つける
3. サイドバー項目を追加または更新する:
   ```javascript
   {
     type: 'category',
     label: 'カテゴリ名',
     items: [
       'article-id-1',
       'article-id-2',
       {
         type: 'category',
         label: 'サブカテゴリ',
         items: ['sub-article-1', 'sub-article-2'],
       },
     ],
   }
   ```
4. または、`_category_.json`ファイルを各ディレクトリに配置する:
   ```json
   {
     "label": "カテゴリ名",
     "position": 1,
     "link": {
       "type": "generated-index",
       "description": "カテゴリの説明"
     }
   }
   ```

**関連ファイル**:

- `website/sidebars.js`
- `vault/**/_category_.json`

**注意事項**:

- サイドバーの自動生成機能を利用する場合、`sidebar_position`フロントマターで順序を制御できる
- 手動でサイドバーを管理する場合、`sidebars.js`を使用する

---

## 共通のベストプラクティス

### Markdownの記法

- Docusaurusは標準的なMarkdownに加え、以下の拡張をサポート:
  - アドモニション: `:::info`、`:::tip`、`:::warning`、`:::danger`
  - タブ: `<Tabs>`コンポーネント
  - コードブロックのハイライト: タイトル付きコードブロック、行番号、ハイライト

### ファイル命名規則

- ドキュメントファイル: ケバブケース（`my-article.md`）
- ブログファイル: 日付プレフィックス（`YYYY-MM-DD-slug.md`）
- ディレクトリ: ケバブケース（`my-category-docs/`）

### Git Workflow

- 開発は`devlop`ブランチで行う
- マスターブランチにマージする前にプルリクエストを作成する
- GitHub Actionsが自動的にビルドとデプロイを実行する

### テスト手順

1. ローカルでビルドテスト: `npm run build`
2. 開発サーバーで確認: `npm run start`
3. リンク切れがないか確認する

---

## トラブルシューティング

### ビルドエラーが発生する

- `docusaurus.config.js`の設定を確認する
- すべてのリンクが正しいか確認する（`onBrokenLinks: 'throw'`が設定されている）
- Markdownのフロントマターが正しい形式か確認する

### サイドバーに記事が表示されない

- `sidebar_position`が設定されているか確認する
- `_category_.json`が正しく配置されているか確認する
- `sidebars.js`の設定を確認する

### 画像が表示されない

- 画像のパスが正しいか確認する
- 画像ファイルが正しいディレクトリに配置されているか確認する
- 相対パスを使用しているか確認する

---

## 関連リソース

- [Docusaurus公式ドキュメント](https://docusaurus.io/docs)
- [Markdown機能](https://docusaurus.io/docs/markdown-features)
- [プロジェクトCONTRIBUTING.md](../CONTRIBUTING.md)
- [プロジェクトWORKFLOW.md](../WORKFLOW.md)

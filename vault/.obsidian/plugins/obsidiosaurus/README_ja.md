# Obsidiosaurus プラグイン - 日本語ガイド

## 📖 概要

ObsidiosaurusはObsidianのVaultをDocusaurusに自動変換するプラグインです。

## 🎯 主な機能

- ✅ ObsidianのマークダウンをDocusaurus形式に変換
- ✅ 画像の自動変換・最適化（WebP形式）
- ✅ Wikiリンク `[[リンク名]]` のサポート
- ✅ Admonitions（警告ブロック）の変換
- ✅ 差分変換（変更されたファイルのみ変換）

## ⚙️ 設定項目

### Directories（ディレクトリ設定）

- **Docusaurus Directory:** `website`
  - Docusaurusプロジェクトのフォルダ名を指定します

### Assets（アセット設定）

- **Obsidian Asset Folder:** `assets`
  - Obsidianで画像を保存するフォルダ名
  
- **Docusaurus Asset Folder:** `assets`
  - Docusaurusで画像を配置するフォルダ名
  
- **Image Type:** `webp`
  - 変換後の画像形式（推奨: webp）
  
- **Image Width:** `2500`
  - 画像の最大幅（ピクセル）

### Language（言語設定）

- **Main Language:** `ja`
  - サイトの主要言語コード

### Dev Options（開発者オプション）

- **Debug mode:** デバッグ情報を表示
- **Developer mode:** プラグイン開発者向け

## 🚀 使い方

### 1. 変換の実行

左サイドバーの **↑アイコン**（ページに上矢印）をクリックするか、リボンアイコンから「Obsidiosaurus」をクリックします。

### 2. 変換プロセス

1. プラグインがVault内のマークダウンファイルを検出
2. 変更されたファイルのみを自動判定
3. Docusaurus形式に変換
4. `website`フォルダに出力
5. 完了通知が表示されます

### 3. 確認

Docusaurusの開発サーバーで変更を確認：

```bash
cd website
npm run start
```

ブラウザで `http://localhost:3000/` にアクセス

## 📁 フォルダ構造

```
リポジトリルート/
├── vault/              ← Obsidianで編集
│   ├── assets/        ← 画像置き場
│   ├── docs/          ← ドキュメント
│   ├── blog/          ← ブログ
│   └── *_docs/        ← その他のドキュメント
└── website/           ← Docusaurus（自動生成）
```

## 📝 フォルダ命名規則

Obsidiosaurusは以下の命名規則でフォルダを認識します：

- **ドキュメント:** フォルダ名に `docs` を含む
  - 例: `docs`, `IT_gyoumu_docs`, `NetWork_docs`
  
- **ブログ:** フォルダ名に `blog` を含む
  - 例: `blog`, `tech__blog`
  
- **アセット:** `assets` フォルダ

## 💡 Tips

### Wikiリンクの使用

Obsidianスタイルのリンクが使えます：

```markdown
[[ページ名]]
[[ページ名#見出し]]
[[ページ名|表示テキスト]]
```

### 画像の挿入

```markdown
![[画像ファイル名.png]]
![[画像ファイル名.png|サイズ]]
```

### Admonitions（警告ブロック）

```markdown
> [!note]
> これはノートです

> [!tip]
> これはヒントです

> [!warning]
> これは警告です

> [!danger]
> これは危険な警告です
```

## ⚠️ 注意事項

1. **ImageMagickが必要**
   - 画像変換にImageMagickが必要です
   - インストール: https://imagemagick.org/

2. **初回変換は時間がかかる**
   - すべてのファイルが変換されます
   - 2回目以降は差分のみ変換されるため高速です

3. **ファイル名に注意**
   - スペースやピリオド(`.`)が含まれる場合は変換されます
   - 可能な限りハイフン(`-`)やアンダースコア(`_`)を使用してください

## 🔧 トラブルシューティング

### Q: プラグインが動かない

**A:** 以下を確認：
- ImageMagickがインストールされているか
- `vault`と`website`フォルダが正しい位置にあるか
- プラグイン設定のパスが正しいか

### Q: 画像が表示されない

**A:** 以下を確認：
- 画像が`vault/assets`にあるか
- Obsidianの設定で「Attachment folder path」が`assets`になっているか
- Obsidiosaurusを実行したか

### Q: 変換に失敗する

**A:** 以下を試す：
- デバッグモードをONにして詳細ログを確認
- Obsidianを再起動
- `allFilesInfo.json`などの変換JSONファイルを削除して再実行

## 🌐 リソース

- [Obsidiosaurus公式ドキュメント](https://cimsta.github.io/obsidiosaurus-docs/)
- [GitHubリポジトリ](https://github.com/CIMSTA/obsidiosaurus)
- [Discord](https://discord.gg/SSGK5tuqJh)

---

**バージョン:** 0.3.2  
**作者:** CIMSTA  
**ライセンス:** MIT

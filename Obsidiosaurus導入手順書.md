# Obsidiosaurus 導入手順書

このドキュメントは、現在のDocusaurusサイトをObsidian対応のイケイケサイトにするための完全な手順書です。

## 📋 目次
1. [必要なツールの確認](#1-必要なツールの確認)
2. [リポジトリ構造の再編成](#2-リポジトリ構造の再編成)
3. [Obsidian Vaultのセットアップ](#3-obsidian-vaultのセットアップ)
4. [Obsidiosaurusプラグインのインストール](#4-obsidiosaurusプラグインのインストール)
5. [既存コンテンツの移行](#5-既存コンテンツの移行)
6. [動作確認](#6-動作確認)

---

## 1. 必要なツールの確認

### インストール済みの確認

PowerShellで以下のコマンドを実行して、必要なツールがインストールされているか確認します。

```powershell
# Node.jsのバージョン確認
node --version

# Gitのバージョン確認
git --version

# ImageMagickのバージョン確認
convert --version
```

### 必要なツール一覧

- ✅ **Node.js** (v20.11.0) - すでにインストール済み
- ✅ **Git** - すでにインストール済み
- ❓ **ImageMagick** - 画像変換に必要（未確認）
- ❓ **Obsidian.md** - マークダウンエディタ

### ImageMagickのインストール（必要な場合）

1. [ImageMagick公式サイト](https://imagemagick.org/script/download.php#windows)からWindows版をダウンロード
2. インストーラーを実行
3. インストール時に「Add application directory to your system path」にチェックを入れる

### Obsidian.mdのインストール

1. [Obsidian公式サイト](https://obsidian.md/)からダウンロード
2. インストーラーを実行

---

## 2. リポジトリ構造の再編成

### 現在の構造
```
ootomonaiso_strage/
└── pro/          # Docusaurusプロジェクト
    ├── docs/
    ├── blog/
    ├── IT_gyoumu/
    ├── NetWork/
    └── ...
```

### 目標の構造
```
ootomonaiso_strage/
├── vault/        # Obsidian Vault（新規作成）
│   ├── assets/   # 画像・ファイル置き場
│   ├── docs/
│   ├── blog/
│   ├── IT_gyoumu/
│   └── NetWork/
└── website/      # Docusaurusプロジェクト（proをリネーム）
    ├── docs/
    ├── blog/
    └── ...
```

### 手順

#### 2-1. `.gitignore`ファイルの更新

リポジトリのルート（`e:\00code\ootomonaiso_strage\`）に`.gitignore`を作成または更新：

```gitignore
# Obsidiosaurus変換用JSONファイル（ルートに生成される）
allSourceAssetsInfo.json
allFilesInfo.json
assetInfo.json

# Node modules
node_modules/
```

#### 2-2. フォルダ構造の作成

PowerShellで以下を実行：

```powershell
cd e:\00code\ootomonaiso_strage

# vault フォルダを作成
New-Item -ItemType Directory -Path "vault"

# vaultの中にassetsフォルダを作成
New-Item -ItemType Directory -Path "vault\assets"

# proフォルダをwebsiteにリネーム（後で実行）
# Rename-Item -Path "pro" -NewName "website"
```

> **注意:** `pro`を`website`にリネームするのは、すべての設定が完了してからにしましょう。

---

## 3. Obsidian Vaultのセットアップ

### 3-1. Obsidianでvaultを開く

1. **Obsidian**アプリを起動
2. 「Open folder as vault」をクリック
3. `e:\00code\ootomonaiso_strage\vault`フォルダを選択

### 3-2. Obsidian設定の調整

#### Files & Links設定

Obsidianの設定（左下の⚙️アイコン）→ **Files & Links** で以下を設定：

- **Default location for new attachments:** `In the folder specified below`
- **Attachment folder path:** `assets`
- **Use [[Wikilinks]]:** ✅ ON（チェックを入れる）
- **Automatically update internal links:** ✅ ON

![設定イメージ](https://cimsta.github.io/obsidiosaurus-docs/assets/images/obisidan_settings_files_and_links-9fc3c2e40b13db56f9255757ca270f3f.webp)

### 3-3. コミュニティプラグインを有効化

Obsidianの設定 → **Community plugins** → 「Turn on community plugins」をクリック

---

## 4. Obsidiosaurusプラグインのインストール

### 4-1. 手動インストール（推奨）

Obsidiosaurusは現在開発中のため、手動でインストールします。

#### 手順

1. **プラグインフォルダを作成**

```powershell
cd e:\00code\ootomonaiso_strage\vault
New-Item -ItemType Directory -Path ".obsidian\plugins\obsidiosaurus" -Force
```

2. **GitHubからプラグインをダウンロード**

```powershell
cd e:\00code\ootomonaiso_strage

# Obsidiosaurusリポジトリをクローン（一時的に）
git clone https://github.com/CIMSTA/obsidiosaurus.git temp_obsidiosaurus

# 必要なファイルをコピー
Copy-Item "temp_obsidiosaurus\main.js" "vault\.obsidian\plugins\obsidiosaurus\"
Copy-Item "temp_obsidiosaurus\manifest.json" "vault\.obsidian\plugins\obsidiosaurus\"
Copy-Item "temp_obsidiosaurus\styles.css" "vault\.obsidian\plugins\obsidiosaurus\" -ErrorAction SilentlyContinue

# 一時フォルダを削除
Remove-Item -Recurse -Force "temp_obsidiosaurus"
```

3. **Obsidianでプラグインを有効化**

   - Obsidianの設定 → **Community plugins**
   - 「Obsidiosaurus」を見つけて有効化

### 4-2. プラグイン設定

Obsidiosaurusプラグインの設定（⚙️アイコン）で以下を設定：

#### Directories
- **Docusaurus Directory:** `website`

#### Assets
- **Obsidian Asset Folder:** `assets`
- **Docusaurus Asset Folder:** `assets`
- **Image Type:** `webp`
- **Image Width:** `2500`

#### Language
- **Main Language:** `ja`

![プラグイン設定](https://cimsta.github.io/obsidiosaurus-docs/assets/images/obsidiosaurus_plugin_settings-9fcc3ff76407a7fa42359045f10d8627.webp)

---

## 5. 既存コンテンツの移行

### 5-1. コンテンツをvaultにコピー

現在の`pro`フォルダ内のマークダウンファイルを`vault`にコピーします。

```powershell
cd e:\00code\ootomonaiso_strage

# docsをコピー
Copy-Item -Recurse "pro\docs" "vault\"

# blogをコピー
Copy-Item -Recurse "pro\blog" "vault\"

# IT_gyoumuをコピー
Copy-Item -Recurse "pro\IT_gyoumu" "vault\"

# NetWorkをコピー
Copy-Item -Recurse "pro\NetWork" "vault\"

# yoshinashiをコピー
Copy-Item -Recurse "pro\yoshinashi" "vault\"
```

### 5-2. 画像ファイルを移動

既存の画像ファイルを`vault\assets`に移動：

```powershell
# blog内の画像
Copy-Item -Recurse "pro\blog\img\*" "vault\assets\" -ErrorAction SilentlyContinue

# その他の画像フォルダがあれば同様にコピー
```

### 5-3. フォルダ構造の調整

Obsidiosaurusは以下の命名規則を使用します：

- **ドキュメント:** フォルダ名に`docs`を含む（例: `docs`, `IT_gyoumu_docs`）
- **ブログ:** フォルダ名に`blog`を含む（例: `blog`, `tech__blog`）
- **アセット:** `assets`フォルダ

#### vaultのフォルダをリネーム

```
vault/
├── assets/
├── docs/              # 自己紹介
├── blog/              # ブログ
├── IT_gyoumu_docs/    # 業務用ITソフトウェア（docsとして認識）
├── NetWork_docs/      # ネットワーク（docsとして認識）
└── yoshinashi_docs/   # よしなしこと（docsとして認識）
```

PowerShellで実行：

```powershell
cd e:\00code\ootomonaiso_strage\vault

# フォルダ名をObsidiosaurus形式に変更
Rename-Item -Path "IT_gyoumu" -NewName "IT_gyoumu_docs"
Rename-Item -Path "NetWork" -NewName "NetWork_docs"
Rename-Item -Path "yoshinashi" -NewName "yoshinashi_docs"
```

---

## 6. 動作確認

### 6-1. Docusaurus開発サーバーを起動

```powershell
cd e:\00code\ootomonaiso_strage\pro
npm run start
```

ブラウザで`http://localhost:3000/`にアクセスして、サイトが正常に表示されることを確認。

### 6-2. Obsidiosaurusを実行

1. **Obsidian**で`vault`を開く
2. 左サイドバーの**↑アイコン**（ページに上矢印）をクリック
   - または、リボンアイコンから「Obsidiosaurus」をクリック
3. 変換が完了すると、右上に通知が表示されます

![実行アイコン](https://cimsta.github.io/obsidiosaurus-docs/assets/images/obsidiosaurus_sidebar_icon-c2a4f1e0f4c8b0e0f4c8b0e0.webp)

### 6-3. 変換結果を確認

ブラウザで`http://localhost:3000/`をリロードして、変更が反映されているか確認。

---

## 7. オプション設定

### 7-1. Excalidrawプラグイン（図形描画）

Obsidianで図形を描きたい場合：

1. Obsidianの設定 → **Community plugins** → Browse
2. 「Excalidraw」を検索してインストール
3. プラグイン設定：
   - **Excalidraw folder:** `assets`
   - **Filename:** `YYYY-MM-DD` または空欄（ピリオドを含まない形式）
   - **Auto-export SVG:** ✅ ON
   - **Export both light and dark SVG:** ✅ ON

### 7-2. Diagrams.netプラグイン（フローチャート）

1. Obsidianの設定 → **Community plugins** → Browse
2. 「Diagrams.net」を検索してインストール

---

## 8. GitHub Pagesへのデプロイ（既存設定の確認）

### 8-1. GitHub Actionsの確認

`.github/workflows/deploy.yml`が正しく設定されているか確認：

```yaml
# ビルドディレクトリが "pro" → "website" に変更されている場合
- name: Build website
  run: |
    cd website
    npm install
    npm run build
```

### 8-2. docusaurus.config.jsの確認

`website/docusaurus.config.js`のbaseURLが正しいか確認：

```javascript
module.exports = {
  url: 'https://ootomonaiso.github.io',
  baseUrl: '/ootomonaiso_strage/',
  // ...
};
```

---

## 9. トラブルシューティング

### Q1. Obsidiosaurusが動かない

**A:** 以下を確認してください：

1. プラグインが有効化されているか
2. `vault`と`website`フォルダが正しい位置にあるか
3. ImageMagickがインストールされているか（`convert --version`で確認）

### Q2. 画像が表示されない

**A:** 以下を確認してください：

1. 画像が`vault/assets`フォルダ内にあるか
2. Obsidianの設定で「Attachment folder path」が`assets`になっているか
3. Obsidiosaurusを実行して変換したか

### Q3. リンクが壊れている

**A:** Obsidianのリンク形式（Wikilinks: `[[ページ名]]`）を使用してください。

---

## 10. 次のステップ

### コンテンツの編集フロー

1. **Obsidian**で`vault`内のマークダウンファイルを編集
2. 画像を追加する場合は`vault/assets`に保存
3. 編集が完了したら、Obsidiosaurusアイコンをクリックして変換
4. Docusaurus開発サーバーで確認（自動リロード）
5. Gitでコミット・プッシュ

```powershell
git add .
git commit -m "Update content via Obsidian"
git push
```

### さらに学ぶ

- [Obsidiosaurus公式ドキュメント](https://cimsta.github.io/obsidiosaurus-docs/)
- [Obsidian公式ドキュメント](https://help.obsidian.md/)
- [Docusaurus公式ドキュメント](https://docusaurus.io/docs)

---

## 📝 メモ

### 重要なポイント

- ✅ `vault`フォルダでObsidianを使って執筆
- ✅ `website`フォルダはDocusaurusのビルド先（自動生成）
- ✅ Obsidiosaurusが`vault` → `website`に変換
- ✅ GitHubにプッシュすると自動デプロイ

### 変換のタイミング

Obsidiosaurusは**差分変換**を行うため、変更したファイルのみが変換されます。  
初回実行時はすべてのファイルが変換されます。

---

以上で、Obsidiosaurusの導入が完了です！🎉

質問や問題があれば、[Obsidiosaurus Discord](https://discord.gg/SSGK5tuqJh)で質問できます。

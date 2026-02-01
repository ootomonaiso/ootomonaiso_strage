# ootomonaiso_strage

俺の知識の殿堂

## 🚀 プロジェクト概要

Obsidian + VSCode + Docusaurusで構築されたドキュメントサイトのリポジトリです。

- **執筆**: Obsidian または VSCode
- **ビルド**: Docusaurus 3.0
- **デプロイ**: GitHub Pages (GitHub Actions)

## 📚 ドキュメント

- [貢献ガイド](CONTRIBUTING.md) - 開発フロー・記事作成ルール
- [Obsidianセットアップ](vault/OBSIDIAN_SETUP.md) - 初回設定・推奨プラグイン
- [Copilot指示書](.github/copilot-instructions.md) - AI補完ルール

## 🏗️ ディレクトリ構造

```
├── vault/               # Obsidianで編集する記事
│   ├── docs/           # メインドキュメント
│   ├── IT_gyoumu_docs/ # 業務IT
│   ├── NetWork_docs/   # ネットワーク
│   ├── yoshinashi_docs/ # よしなし
│   ├── blog/           # ブログ
│   ├── assets/         # 画像・ファイル
│   └── templates/      # 記事テンプレート
└── website/            # Docusaurusビルド用
    ├── docs/           # 変換後ドキュメント
    ├── it-gyoumu-docs/
    ├── network-docs/
    └── yoshinashi-docs/
```

## 🛠️ 開発環境

### 必須
- Node.js v20.11.0
- npm

### 推奨
- Obsidian(執筆用)
- VSCode(コーディング用)

## 📝 クイックスタート

### 1. ローカル開発
```bash
cd website
npm install
npm start
```

### 2. ビルド確認
```bash
npm run build
npm run serve
```

## 🤝 貢献方法

1. `develop`ブランチから作業ブランチ作成
2. `vault/`配下で記事作成(Obsidian推奨)
3. ローカルでビルド確認
4. `develop`へPull Request

詳細は[CONTRIBUTING.md](CONTRIBUTING.md)参照

## 🔧 技術スタック

- **CMS**: Obsidian
- **フレームワーク**: Docusaurus 3.0
- **UI**: React 18.0
- **ランタイム**: Node.js v20.11.0
- **CI/CD**: GitHub Actions
- **ホスティング**: GitHub Pages

## 📄 ライセンス

MIT


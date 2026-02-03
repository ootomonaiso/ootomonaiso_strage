---
sidebar_position: 1
description: GitHubCopilotをVSCodeで使う
---

# GitHubCopilotでできること

GitHubCopilotはGPT、Claude、Geminiをはじめとした複数の大規模言語モデルをコーディングを軸としたタスクに利用できるステキなサービスです。学生の皆様方は学生証を明け渡して[GitHubEducation](https://github.com/education?locale=ja)に登録するだけで無料で使えます。学生は無料だけど、実際に使おうとすると毎月2000円くらい持ってかれるので今のうちに使い倒すのがいいと思います。

## VS Codeでの基本的な使い方

### 1. インラインコード補完
コードを書いている最中に、Copilotが自動的に次のコードを提案してくれます。
- `Tab`キーで提案を受け入れる
- `Esc`キーで提案を却下
- `Alt + ]`で次の提案を表示
- `Alt + [`で前の提案を表示

### 2. Copilot Chat（チャット機能）
`Ctrl + I`（Mac: `Cmd + I`）でインラインチャットを開いて、コードについての質問や編集指示ができます。

#### よく使うスラッシュコマンド
- `/explain`: 選択したコードの説明
- `/fix`: 選択したコードのバグ修正
- `/tests`: ユニットテストの生成
- `/doc`: ドキュメンテーションコメントの生成
- `/simplify`: コードの簡略化

## 便利な設定

### settings.jsonに追加すると便利な設定

```json
{
  // Copilotの提案をより積極的に表示
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": true,
    "markdown": true
  },
  
  // インライン提案の遅延を短く
  "github.copilot.editor.enableAutoCompletions": true,
  
  // Copilot Chatでのモデル選択
  "github.copilot.chat.defaultModel": "claude-sonnet",
  
  // エディタの幽霊テキスト（提案）の色をカスタマイズ
  "workbench.colorCustomizations": {
    "editorGhostText.foreground": "#6a737d"
  }
}
```

## 効果的な使い方のコツ

### 1. コメントを活用した生成
詳細なコメントを書くことで、より精度の高いコード生成ができます。

```javascript
// ユーザーの入力をバリデーションして、エラーがあれば配列で返す関数
// メールアドレスの形式チェック、パスワードの長さチェック（8文字以上）を含む
function validateUserInput(email, password) {
  // ← ここでTabを押すとCopilotが生成してくれる
}
```

### 2. テストコードの自動生成
既存の関数を選択して、Copilot Chatで`/tests`コマンドを使うと、自動的にテストコードを生成してくれます。

### 3. コードレビュー機能の活用
選択したコードに対して「このコードをレビューして改善点を教えて」と聞くと、パフォーマンスやセキュリティの観点からアドバイスをもらえます。

### 4. リファクタリング支援
- レガシーコードを選択して「このコードをモダンな書き方にリファクタリングして」
- 「このコードにエラーハンドリングを追加して」
- 「このコードをTypeScriptに変換して」

## Copilot Editsの活用（新機能）

複数ファイルにまたがる編集を一度に行える強力な機能です。
1. `Ctrl + Shift + I`で Copilot Edits を起動
2. 編集したいファイルを選択
3. 「全てのコンポーネントで型定義を追加」のような指示を出す
4. Copilotが複数ファイルを同時に編集

:::tip 学生の特権を活かす
GitHub Copilot Proの機能も学生なら無料で使えます。Claude Sonnet 4.5やGPT-4など、最新モデルを自由に切り替えられるので、タスクに応じて使い分けましょう。
:::

## トラブルシューティング

### Copilotが動かない場合
1. GitHub Copilot拡張機能がインストールされているか確認
2. GitHubアカウントでVS Codeにログインしているか確認
3. `Ctrl + Shift + P` → "GitHub Copilot: Sign Out" → 再ログイン

### 提案が表示されない場合
- `settings.json`で該当ファイルタイプが無効になっていないか確認
- ネットワーク接続を確認
- VS Codeを再起動してみる

## 参考リンク
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [VS Code + GitHub Copilot](https://code.visualstudio.com/docs/copilot/overview)
- [GitHub Copilot Changelog](https://github.blog/changelog/label/copilot/)

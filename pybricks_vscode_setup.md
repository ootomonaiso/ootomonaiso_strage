# Pybricks × VSCode セットアップガイド（Windows）

## 概要

LEGO SPIKE Prime で Pybricks を使う際、**ファームウェア書き換えだけは Web 必須**だが、それ以外の開発はすべてローカル（VSCode）で完結できる。

| 作業 | ローカル可否 |
|---|---|
| Pybricks ファームウェアのインストール | **Web のみ**（`code.pybricks.com` 必須、最初の1回だけ） |
| コード作成・編集 | VSCode でOK |
| プログラムの転送・実行 | ローカル（`pybricksdev`）でOK |

---

## Step 1: ファームウェアのインストール（Web、最初の1回のみ）

1. [code.pybricks.com](https://code.pybricks.com) を開く
2. ツールメニュー → **Install Pybricks firmware** を選択
3. ハブを USB 接続し、画面の指示に従う
4. 完了後は Web は不要

> 元の LEGO ファームウェアに戻したい場合も同サイトの **Restore official LEGO firmware** から可能。

---

## Step 2: Python のインストール

[python.org](https://www.python.org/downloads) またはWindowsストアからインストール。

インストール時に **「Add Python to PATH」にチェック**を入れること。

---

## Step 3: プロジェクトフォルダの準備

```powershell
# 任意のフォルダを作成して移動
mkdir my_spike_project
cd my_spike_project

# 仮想環境を作成・有効化
py -3 -m venv .venv
.venv\scripts\activate
```

プロンプトが `(.venv)` で始まればOK。

---

## Step 4: パッケージのインストール

```powershell
pip install pybricksdev
pip install pybricks
```

### 各パッケージの役割

| パッケージ | 必須？ | 役割 |
|---|---|---|
| **pybricksdev** | ✅ 必須 | プログラムをハブに転送・実行するツール |
| **pybricks** | ⚠️ 推奨 | ローカル PC での補完・型チェック用（ハブ上では別） |

**pybricksdev だけでも動くが、pybricks があるとこうなる：**
- VSCode で `from pybricks.hubs import...` と書く際にオートコンプリート機能が働く
- Pylance が型情報を認識して、存在しないメソッドのエラーをローカルで検出
- ハブ上では Pybricks ファームウェア内に pybricks パッケージが実装されているため、PC にインストール有無は実行に影響しない

---

## Step 5: VSCode の設定

### Pylance 拡張をインストール

VSCode の拡張タブで `Pylance` を検索してインストール（補完・型チェック用）。

### インタープリタを仮想環境に設定

コマンドパレット（`Ctrl+Shift+P`）→ `Python: Select Interpreter` → `.venv` を選択。

### launch.json を作成

`.vscode/launch.json` を以下の内容で作成：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Run on Hub (Bluetooth)",
            "type": "python",
            "request": "launch",
            "module": "pybricksdev",
            "args": ["run", "ble", "${file}"],
            "console": "integratedTerminal"
        },
        {
            "name": "Run on Hub (USB)",
            "type": "python",
            "request": "launch",
            "module": "pybricksdev",
            "args": ["run", "usb", "${file}"],
            "console": "integratedTerminal"
        }
    ]
}
```

---

## 使い方

### Bluetooth 接続で転送・実行

1. **ハブと PC をペアリング**（初回のみ）
   - Windows 設定 → Bluetooth → デバイスを追加
   - SPIKE Prime ハブを検索してペアリング

2. ハブの電源を入れる
3. VSCode で `.py` ファイルを開く
4. **F5** を押す → `Run on Hub (Bluetooth)` を選択 → 実行

**コマンドラインから実行：**
```powershell
pybricksdev run ble my_program.py
```

複数台の場合は名前で指定：
```powershell
pybricksdev run ble --name "my hub" my_program.py
```

### USB 接続で転送・実行（推奨）

USB 接続は **Bluetooth より安定**しており、初期接続が簡単です。

1. **USB ドライバのインストール**（最初の1回のみ）
   - ハブを USB で PC に接続
   - [code.pybricks.com](https://code.pybricks.com) の Install ボタン内に「Install USB drivers」オプンがあれば実行
   - または、[WinUSB ドライバ](https://docs.microsoft.com/en-us/windows-hardware/drivers/usbcon/index)を手動インストール
   - Windows がドライバ自動検出した場合はスキップ可能

2. ハブを USB で PC に接続
3. VSCode で `.py` ファイルを開く
4. **F5** を押す → `Run on Hub (USB)` を選択 → 実行

**コマンドラインから実行：**
```powershell
pybricksdev run usb my_program.py
```

複数台の場合は名前で指定：
```powershell
pybricksdev run usb --name "my hub" my_program.py
```

### Bluetooth vs USB 比較

| 項目 | Bluetooth | USB |
|---|---|---|
| セットアップ | ペアリング必要 | ドライバ（自動の場合あり） |
| 安定性 | 電波干渉の影響あり | 有線のため安定 |
| 速度 | やや遅い | 高速 |
| 配線 | 不要 | USB ケーブル必要 |
| 移動性 | ハブを動かしながら実行可能 | 有線で制限あり |
| **おすすめ用途** | デバッグ時（ハブが動く） | 開発時（安定性重視） |

---

## よくある注意点

- **プログラムの停止はハブのボタンで行う**（VSCode からは停止できない）
- しばらく放置するとハブの電源が切れるので、その場合はボタンで再起動してから再実行
- VSCode の通常の「再生ボタン」を押すと **PC 上でローカル実行**されてしまう（F5 を使うこと）
- `pybricks` パッケージ未インストールの場合、ローカル実行時に `pybricks` not found エラーが出る

---

## サードパーティ VSCode 拡張（任意）

[pybricks-runner-vscode](https://github.com/AnandSingh/pybricks-runner-vscode) という拡張もあり、より統合された操作が可能。ただし非公式。

---

## 参考リンク

- [Pybricks 公式: VSCode での使い方](https://pybricks.com/project/pybricks-other-editors/)
- [pybricksdev (PyPI)](https://pypi.org/project/pybricksdev/)
- [Pybricks ドキュメント](https://docs.pybricks.com/en/latest/)

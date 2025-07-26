# t-client 設定例

## 設定内容
- メールクライアント: Thunderbirdでtaroの送受信設定
- Webブラウザ: Proxy（tsv:8080）、ルート証明書インストール
- ネットワークドライブ: bobでZドライブ割り当て

---

## 具体的な設定手順

### Thunderbird メール設定

#### アカウント設定
1. **Thunderbirdを起動**
   - 新しいアカウントの設定 → 既存のメールアドレスを設定

2. **基本情報入力**
   ```
   名前: taro
   メールアドレス: taro@tokyo-skills.jp
   パスワード: [設定されたパスワード]
   ```

3. **手動設定**
   - 手動設定ボタンをクリック

#### 受信サーバー設定（POP3S）
```
サーバー名: tsv.tokyo-skills.jp または 192.168.1.100
ポート: 995
接続の保護: SSL/TLS
認証方式: 平文のパスワード認証
ユーザー名: taro
```

#### 送信サーバー設定（SMTP）
```
サーバー名: tsv.tokyo-skills.jp または 192.168.1.100
ポート: 25
接続の保護: なし
認証方式: 認証なし
```

#### 高度な設定
```
☑ サーバーにメッセージのコピーを残す（必要に応じて）
☐ サーバーにメッセージのコピーを残す（容量節約の場合）
```

### Webブラウザ Proxy設定

#### Internet Explorer / Edge設定
1. **インターネットオプションを開く**
   - 設定 → インターネットオプション → 接続タブ

2. **LAN設定**
   - LANの設定ボタンをクリック

3. **Proxy設定**
   ```
   ☑ LANにプロキシサーバーを使用する
   アドレス: tsv.tokyo-skills.jp または 192.168.1.100
   ポート: 8080
   
   ☑ ローカルアドレスにはプロキシサーバーを使用しない
   ```

#### Chrome設定
1. **設定を開く**
   - chrome://settings/ → 詳細設定 → システム

2. **プロキシ設定を開く**
   - プロキシ設定を開く → LAN設定
   - 上記IE設定と同様に設定

#### Firefox設定
1. **設定を開く**
   - about:preferences → ネットワーク設定

2. **プロキシ設定**
   ```
   ○ 手動でプロキシを設定する
   HTTPプロキシ: 192.168.1.100
   ポート: 8080
   ☑ すべてのプロトコルでこのプロキシサーバーを使用する
   ☑ ローカルアドレスではプロキシを使用しない
   ```

### ルート証明書インストール

#### 証明書ファイル取得
```powershell
# PowerShellで証明書ダウンロード（例）
Invoke-WebRequest -Uri "http://tsv.tokyo-skills.jp/rootca.crt" -OutFile "C:\temp\rootca.crt"
```

#### 証明書インストール手順
1. **証明書ファイルをダブルクリック**
   - 証明書インポートウィザードが起動

2. **保存場所選択**
   ```
   ○ 現在のユーザー
   または
   ○ ローカルコンピューター（管理者権限必要）
   ```

3. **証明書ストア選択**
   ```
   ○ 証明書の種類に基づいて、自動的に証明書ストアを選択する
   または
   ○ 証明書をすべて次のストアに配置する
   → 信頼されたルート証明機関
   ```

#### コマンドライン方式
```cmd
:: 管理者権限でコマンドプロンプトを実行
certutil -addstore -f "ROOT" "C:\temp\rootca.crt"
```

### ネットワークドライブ設定

#### Zドライブマッピング（GUI）
1. **エクスプローラーを開く**
   - PC → ネットワークドライブの割り当て

2. **ドライブ設定**
   ```
   ドライブ: Z:
   フォルダー: \\192.168.1.101\share
   
   ☑ サインイン時に再接続する
   ☑ 異なる資格情報を使用して接続する
   ```

3. **認証情報入力**
   ```
   ユーザー名: bob
   パスワード: [bobのパスワード]
   ドメイン: （空白）
   ```

#### コマンドライン方式
```cmd
:: ネットワークドライブ割り当て
net use Z: \\192.168.1.101\share /user:bob [パスワード] /persistent:yes

:: 接続確認
net use

:: 切断（必要時）
net use Z: /delete
```

#### バッチファイル作成（自動マッピング用）
```batch
@echo off
echo ネットワークドライブを接続しています...
net use Z: \\192.168.1.101\share /user:bob %1 /persistent:yes
if %errorlevel% == 0 (
    echo 接続が完了しました。
) else (
    echo 接続に失敗しました。
)
pause
```

### トラブルシューティング

#### ネットワーク疎通確認
```cmd
:: サーバー疎通確認
ping 192.168.1.100
ping 192.168.1.101

:: ポート確認
telnet 192.168.1.100 25
telnet 192.168.1.100 995
telnet 192.168.1.100 8080

:: SMB接続確認
net view \\192.168.1.101
```

#### DNS確認
```cmd
nslookup tsv.tokyo-skills.jp
nslookup osv2.tokyo-skills.jp
```

#### メール送信テスト
```cmd
:: telnetでSMTPテスト
telnet 192.168.1.100 25
HELO test
MAIL FROM: taro@tokyo-skills.jp
RCPT TO: admin@tokyo-skills.jp
DATA
Subject: Test Mail

This is a test message.
.
QUIT
```

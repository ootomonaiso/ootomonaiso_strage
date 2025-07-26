# o-client 設定例

## 設定内容
- DHCP取得で接続
- SSHクライアント: Tera Termでosv2へ接続（秘密鍵: C:\ssh\id_rsa）

---

## 具体的な設定手順

### ネットワーク設定
#### DHCP自動取得設定
1. **ネットワーク設定を開く**
   - `Win + R` → `ncpa.cpl` → Enter

2. **イーサネット接続のプロパティ**
   - イーサネット接続を右クリック → プロパティ
   - インターネット プロトコル バージョン 4 (TCP/IPv4) を選択 → プロパティ

3. **DHCP設定**
   ```
   ☑ IPアドレスを自動的に取得する
   ☑ DNSサーバーのアドレスを自動的に取得する
   ```

#### 手動設定（必要に応じて）
```
IPアドレス: 192.168.2.102
サブネットマスク: 255.255.255.0
デフォルトゲートウェイ: 192.168.2.1
優先DNSサーバー: 192.168.1.101
```

### SSH接続設定（Tera Term）

#### 秘密鍵の配置
```
C:\ssh\id_rsa  （秘密鍵ファイル）
```

#### Tera Term設定手順
1. **Tera Termを起動**
   - ホスト: `192.168.1.101`（osv2のIPアドレス）
   - TCPポート: `10022`

2. **SSH認証設定**
   - ユーザー名: `bob`
   - 認証方式: 公開鍵認証
   - 秘密鍵ファイル: `C:\ssh\id_rsa`

3. **接続設定保存**
   - ファイル → 設定保存
   - ファイル名: `osv2_connection.ttl`

#### バッチファイル作成（自動接続用）
```batch
@echo off
"C:\Program Files (x86)\teraterm\ttermpro.exe" 192.168.1.101:10022 /ssh /2 /auth=publickey /user=bob /keyfile="C:\ssh\id_rsa"
```

### ファイアウォール設定
#### Windows Defenderファイアウォール
```powershell
# PowerShellを管理者権限で実行
# SSH接続用ポートを許可
New-NetFirewallRule -DisplayName "SSH Outbound" -Direction Outbound -Protocol TCP -RemotePort 10022 -Action Allow
```

### トラブルシューティング用コマンド
```cmd
:: ネットワーク接続確認
ipconfig /all
ping 192.168.2.1
ping 192.168.1.101
nslookup osv2.tokyo-skills.jp

:: DHCP更新
ipconfig /release
ipconfig /renew

:: DNS キャッシュクリア
ipconfig /flushdns
```

### ネットワーク診断コマンド
```cmd
:: 経路確認
tracert 192.168.1.101

:: ポート接続確認
telnet 192.168.1.101 10022

:: ネットワーク統計
netstat -rn
```

---
sidebar_position: 2
description: BIND9によるDNSサーバー設定ガイド
---

# DNS設定の虎の巻

DNSサーバー（BIND9）の設定方法を解説します。この資料は技能競技大会のDNS設定を参考にしています。

## 1. パッケージのインストール

```bash
# BINDのインストール
sudo apt update
sudo apt install bind9 bind9utils dnsutils
```

## 2. 主要な設定ファイル

| ファイル | 説明 |
|---------|------|
| `/etc/bind/named.conf` | メイン設定ファイル |
| `/etc/bind/named.conf.options` | グローバルオプション設定 |
| `/etc/bind/named.conf.local` | ゾーン定義 |
| `/etc/bind/named.conf.default-zones` | デフォルトゾーン定義 |
| `/etc/bind/` | ゾーンファイル保存ディレクトリ |

## 3. 基本設定（named.conf.options）

```conf
options {
    directory "/etc/bind";
    
    // DNSSECの検証を無効化
    dnssec-validation no;
    
    // 自身での反復問い合わせを行わない
    recursion no;
    
    // 特定のネットワークのみから再帰的な問い合わせを許可
    allow-recursion { 192.168.1.0/24; 192.168.2.0/24; };
    
    // IPv4とIPv6の両方をリッスン
    listen-on { any; };
    listen-on-v6 { any; };
    
    // バージョン情報を隠す
    version "not disclosed";
};
```

## 4. マスターゾーンの設定例（named.conf.local）

```conf
// マスターゾーン設定例
zone "osaka-skills.jp" {
    type master;
    file "/etc/bind/db.osaka-skills.jp";
    allow-transfer { 192.168.1.1; }; // ゾーン転送の許可
    notify yes; // ゾーンの更新をスレーブに通知
};

// 逆引きゾーン設定例
zone "1.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.1";
    allow-transfer { 192.168.1.1; };
    notify yes;
};
```

## 5. スレーブゾーンの設定例（named.conf.local）

```conf
// スレーブゾーン設定例
zone "osaka-skills.jp" {
    type slave;
    file "/etc/bind/db.osaka-skills.jp";
    masters { 201.10.0.25; }; // マスターサーバーのIP
};

// 逆引きスレーブゾーン
zone "1.168.192.in-addr.arpa" {
    type slave;
    file "/etc/bind/db.192.168.1";
    masters { 201.10.0.25; };
};
```

## 6. フォワーダー設定（named.conf.options）

```conf
options {
    // 他のオプション設定...
    
    // 転送先サーバー設定
    forwarders {
        200.99.1.1; // svのIPアドレス
    };
    
    // 転送先からの応答がない場合は反復問い合わせを行わない
    forward only;
};
```

## 7. ゾーンファイルの作成

### 正引きゾーンファイル例（db.osaka-skills.jp）

```conf
$TTL    604800
@       IN      SOA     osv1.osaka-skills.jp. admin.osaka-skills.jp. (
                        2025080101      ; Serial（YYYYMMDDNN形式）
                        604800          ; Refresh（7日）
                        86400           ; Retry（1日）
                        2419200         ; Expire（28日）
                        604800 )        ; Negative Cache TTL（7日）

; ネームサーバーの定義（短縮形とFQDN形式の両方を示す）
@       IN      NS      osv1            ; 短縮形（自動的にosaka-skills.jpが補完される）
@       IN      NS      osv2.osaka-skills.jp. ; FQDN形式（末尾のドットが必要）

; MXレコード（メールサーバー）
@       IN      MX  10  osv1            ; 短縮形
@       IN      MX  20  osv2            ; 短縮形

; Aレコード（IPv4アドレス）
osv1    IN      A       201.10.0.25
osv2    IN      A       192.168.1.1

; CNAMEレコード（エイリアス）
www     IN      CNAME   osv1            ; 短縮形
sec     IN      A       201.10.0.25
in      IN      CNAME   osv2            ; 短縮形

; AAAAレコード（IPv6アドレス）
www6    IN      AAAA    2001:DB8:3:100::1
```

### 逆引きゾーンファイル例（db.192.168.1）

```conf
$TTL    604800
@       IN      SOA     osv1.osaka-skills.jp. admin.osaka-skills.jp. (
                        2025080101      ; Serial
                        604800          ; Refresh
                        86400           ; Retry
                        2419200         ; Expire
                        604800 )        ; Negative Cache TTL

; ネームサーバーの定義
@       IN      NS      osv1.osaka-skills.jp.

; 逆引きレコード（逆引きゾーンでは完全なFQDNを指定する必要がある）
1       IN      PTR     osv2.osaka-skills.jp.
```

## 8. BINDの起動と管理

```bash
# BINDサービスの起動
sudo systemctl start bind9

# 自動起動の有効化
sudo systemctl enable bind9

# サービスステータスの確認
sudo systemctl status bind9

# 設定変更後の再読み込み
sudo systemctl reload bind9
```

## 9. 設定の検証

```bash
# 設定ファイルの構文チェック
sudo named-checkconf

# ゾーンファイルの構文チェック
sudo named-checkzone osaka-skills.jp /etc/bind/db.osaka-skills.jp
sudo named-checkzone 1.168.192.in-addr.arpa /etc/bind/db.192.168.1

# DNSサーバーの動作確認
dig @localhost osaka-skills.jp NS
dig @localhost www.osaka-skills.jp
dig @localhost -x 192.168.1.1
```

## 10. シナリオ別設定例

### 競技課題におけるosv1設定（マスター/スレーブハイブリッド）

**named.conf.options:**
```conf
options {
    directory "/etc/bind";
    dnssec-validation no;
    
    // 外部からの再帰的な問い合わせを拒否
    allow-recursion { 192.168.1.0/24; 192.168.2.0/24; };
    
    // 回送先設定
    forwarders {
        200.99.1.1; // svのIPアドレス
    };
    forward only;
    
    listen-on { any; };
    listen-on-v6 { any; };
};
```

**named.conf.local:**
```conf
// 外部向けマスターゾーン
zone "osaka-skills.jp" {
    type master;
    file "/etc/bind/db.osaka-skills.jp.external";
    allow-transfer { 192.168.1.1; }; // osv2へのゾーン転送許可
};

// 内部向けスレーブゾーン
zone "osaka-skills.jp" {
    type slave;
    file "/etc/bind/db.osaka-skills.jp.internal";
    masters { 192.168.1.1; }; // osv2からゾーン転送
};
```

### 競技課題におけるosv2設定（内部向けマスター）

**named.conf.options:**
```conf
options {
    directory "/etc/bind";
    dnssec-validation no;
    
    // 内部ネットワークからの再帰的な問い合わせを許可
    allow-recursion { 192.168.1.0/24; 192.168.2.0/24; };
    
    // osv1へ回送
    forwarders {
        201.10.0.25; // osv1のIPアドレス
    };
    forward only;
    
    listen-on { any; };
};
```

**named.conf.local:**
```conf
// 内部向けマスターゾーン
zone "osaka-skills.jp" {
    type master;
    file "/etc/bind/db.osaka-skills.jp";
    allow-transfer { 201.10.0.25; }; // osv1へのみゾーン転送許可
    notify yes;
};

// 逆引きゾーン
zone "1.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.1";
    allow-transfer { 201.10.0.25; };
    notify yes;
};
```

:::tip DNSの設定ポイント
1. シリアル番号を必ず更新する（ゾーンファイル変更時）
2. 設定変更後は必ず構文チェックを行う
3. IPv4とIPv6の両方のレコードを適切に設定する
4. ゾーン転送のセキュリティに注意する
5. マスター/スレーブの関係を明確にする
6. ホスト名の短縮形とFQDN形式を適切に使い分ける
   - 短縮形：末尾にドットなし（例：`osv1`）
   - FQDN形式：末尾にドット付き（例：`osv1.osaka-skills.jp.`）
:::

:::warning よくある問題と解決法
- **DNSサーバーが起動しない**: ログ(`/var/log/syslog`)を確認し、構文エラーを修正
- **ゾーン転送が動作しない**: `allow-transfer`の設定とファイアウォールを確認
- **名前解決ができない**: サービスの起動状態、ゾーンファイルの内容を確認
- **再帰問い合わせの問題**: `allow-recursion`の設定を確認
:::
```
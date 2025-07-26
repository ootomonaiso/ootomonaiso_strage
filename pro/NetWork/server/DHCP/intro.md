---
sidebar_position: 2
description: DHCPサーバーの偉大さを感じる
---

# DHCPサーバーの設定

## インストール
```bash
sudo apt install isc-dhcp-server
```

## 設定

### 1. インターフェース設定
設定ファイルは`/etc/default/isc-dhcp-server`を編集：

```bash
sudo nano /etc/default/isc-dhcp-server
```

```bash
# DHCPサーバーが動作するネットワークインターフェースを指定
INTERFACESv4="eth〇〇〇"  # Internal2ネットワークのインターフェース名
INTERFACESv6=""
```

### 2. DHCP設定ファイルの編集
メインの設定ファイル`/etc/dhcp/dhcpd.conf`を編集：

```bash
sudo nano /etc/dhcp/dhcpd.conf
```

```apache
# グローバル設定
default-lease-time 600;
max-lease-time 7200;

# 俺は権威サーバーであるという自信の表れ
authoritative;

subnet 192.168.2.0 netmask 255.255.255.0 {
    # IPアドレス配布範囲:192.168.2.101-110
    range 192.168.2.101 192.168.2.110;
    
    # デフォルトゲートウェイ（ルーター）
    option routers 192.168.2.1;　# 254(最後のアドレス)でもいいよ

    # DNSサーバー（osv2のIPアドレス）
    option domain-name-servers 192.168.2.1;
}
```

### 3. サービスの管理

#### DHCPサービスの開始・有効化
```bash
# サービスの開始
sudo systemctl start isc-dhcp-server

# 自動起動の有効化
sudo systemctl enable isc-dhcp-server

# サービス状態の確認
sudo systemctl status isc-dhcp-server
```

### 設定例の詳細

| 項目 | 設定値 | 説明 |
|------|--------|------|
| IPアドレス範囲 | 192.168.2.101-110 | 配布するIPアドレス範囲 |
| デフォルトゲートウェイ | 192.168.2.1 | ルーターのIPアドレス |
| DNSサーバー | 192.168.2.1 | osv2のIPアドレス |
| ネットワーク | 192.168.2.0/24 | Internal2ネットワーク |

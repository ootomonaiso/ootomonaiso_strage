---
sidebar_position: 2
description: Cisco PPPoE設定の解説
---

# PPPoEクライアント設定

## 物理インターフェース設定（Ethernet0/0）
```cisco
interface Ethernet0/0
 no ip address                      # 物理インターフェースにはIPアドレスを設定しない
 pppoe enable group global          # PPPoEセッションをグローバルグループで有効化
 pppoe-client dial-pool-number 1    # ダイアルプール1と関連付け
```

## ダイアラーインターフェース設定（Dialer1）
```cisco
interface Dialer1
 mtu 1492                           # PPPoEヘッダ(8バイト)分を考慮したMTU値
 ip address negotiated              # ISPからDHCPでIPアドレスを取得
 encapsulation ppp                  # PPPプロトコルでカプセル化
 dialer pool 1                      # 物理インターフェースと同じダイアルプール番号
 dialer-group 1                     # ダイアラーリスト1を参照
 ppp authentication chap callin     # 着信時のみCHAP認証を使用
 ppp chap hostname ppp-user         # ISPに提示するユーザー名
 ppp chap password 0 R6pass         # ISPに提示するパスワード(0は平文を示す)
```

## ルーティング設定
```cisco
ip route 0.0.0.0 0.0.0.0 Dialer1    # デフォルトルートをPPPoEインターフェースに向ける
```

## ダイアラーリスト設定
```cisco
dialer-list 1 protocol ip permit     # すべてのIPトラフィックを発信として許可
```

## 設定のポイント

| 設定項目 | 説明 |
|----------|------|
| `pppoe enable group global` | PPPoEを有効化 |
| `pppoe-client dial-pool-number 1` | ダイアルプール1を指定 |
| `mtu 1492` | PPPoEのMTUサイズ |
| `ip address negotiated` | IPアドレスはISPから取得 |
| `encapsulation ppp` | PPPカプセル化 |
| `dialer pool 1` | 物理インターフェースと関連付け |
| `ppp authentication chap callin` | CHAP認証を使用 |
| `ppp chap hostname ppp-user` | 認証用ユーザー名 |
| `ppp chap password 0 R6pass` | 認証用パスワード |

:::info PPPoE設定の流れ
1. 物理インターフェースでPPPoEを有効化
2. ダイアラーインターフェースでPPP設定
3. 認証情報（ユーザー名・パスワード）を設定
4. ルーティング設定を行い、デフォルトルートをダイアラーインターフェースに設定
5. ダイアラーリストを使用して、IPプロトコルのトラフィックを許可
:::

:::tip PPPoEのデバッグ
問題が発生した場合は以下のコマンドでデバッグできます：
```cisco
debug pppoe events
debug ppp negotiation
debug ppp authentication
```
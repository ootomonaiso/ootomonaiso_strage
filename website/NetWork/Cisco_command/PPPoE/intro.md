---
sidebar_position: 2
description: PPPoEさん
---

# PPPoEクライアント設定

## 物理インターフェース設定（Ethernet0/0）
```cisco
interface Ethernet0/0
 no ip address
 pppoe enable group global
 pppoe-client dial-pool-number 1
```

## ダイアラーインターフェース設定（Dialer1）
```cisco
interface Dialer1
 mtu 1492
 ip address negotiated
 encapsulation ppp
 dialer pool 1
 dialer-group 1
 ppp authentication chap callin
 ppp chap hostname ppp-user
 ppp chap password 0 R6pass
```

## ルーティング設定
```cisco
ip route 0.0.0.0 0.0.0.0 Dialer1
```

## ダイアラーリスト設定
```cisco
dialer-list 1 protocol ip permit
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
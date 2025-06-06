---
sidebar_position: 3
description: External Connectorを使う
---

# External Connectorを使ってESXi上に存在するマシンにpingが通るようにしておく

## External Connectorとは
外部アクセス用のコントローラです。ブリッジモードとNATモードがあり、それぞれ仮想環境内のルーターから使えるようにします

## 初期設定確認
- vSwitchのセキュリティポリシーは無差別モードは確実にONにしておく
- CMLと対象のマシンが同じポートグループにいること

## External Connectorと適当にルーターでもつなげてみる
配置したルーターのコンソールに入った後
```bash
enable 
configure terminal
interface eth0/0
    ip address (接続したいPCのクラスにそろえようね)
    no shutdown
exit
ip route 0.0.0.0 0.0.0.0 (ダブらない確信があるIPアドレスをここに入れる)
```

このあとconfigモードから出てping

```bash
ルーター# ping (接続したいPCのIPアドレス)
```

## おまけ
9090ポートを指定して開くと管理者向けのダッシュボードが見れる。
- sysadminでのログイン
- 起動したときにお出迎えされるあの画面のWebUI版。ほとんど日本語対応済み。至れり尽くせりとはまさにこのこと。
- カスタム接続をするならここでいったん設定追加
```bash
(CMLのWebUIのアドレス):9090
```

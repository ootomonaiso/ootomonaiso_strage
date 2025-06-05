---
sidebar_position: 3
description: External Connectorを使う
---

# External Connectorを使ってESXi上に存在するマシンにpingが通るようにしておく

## External Connectorとは
外部アクセス用のコントローラです。ブリッジモードとNATモードがあり、それぞれ仮想環境内のルーターから使えるようにします

## 初期設定確認
- vSwitchのセキュリティポリ氏ーは無差別モードは確実にONにしておく
- CMLと対象のマシンが同じポートグループにいること

## 

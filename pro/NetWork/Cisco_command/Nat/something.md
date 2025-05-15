---
sidebar_position: 3
description: Natの構築時に使える確認用コマンド
---

# Nat構築時の確認用コマンド

## インターフェースが生きてるかどうか確認する

```bash
show ip interface brief
```

![設定](./img/3-1.png)

見るべき項目は`IP-Address`と`Protocol`で、`IP-Address`が`unassigned`だったらIPアドレスが設定できません。`Protocol`が`up`になっていないなら`no shutdown`が通ってないです。通してください。


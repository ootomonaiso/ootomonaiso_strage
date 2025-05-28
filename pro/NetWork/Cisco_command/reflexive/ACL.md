---
sidebar_position: 2 
description: 外のネットワーク
---
# インターネット側からLAN内に通信させないぞ

## 設定
### R1の設定(LAN内)
```bash
enable
configre terminal

interface eth0/0
    ip route 192.168.12.1 255.255.255.0
    no shutdown
exit
ip route 0.0.0.0 0.0.0.0 192.168.12.2
```

### R3の設定(ネットワーク)
```bash
enable
configre terminal

interface eth0/0
    ip route 192.168.23.3 255.255.255.0
    no shutdown
exit
ip route 192.168.12.0 255.255.255.0 192.168.23.2
```

:::tip[R3のデフォルトルートの設定の書き方なにこれ]
`192.168.12.0`が、`192.168.23.2`を経由してルーティングされるようにするやつです
:::

### R2の設定(ゲートウェイのルーター)
```bash

```
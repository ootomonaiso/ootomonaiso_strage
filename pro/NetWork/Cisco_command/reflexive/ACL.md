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
    ip address 192.168.12.1 255.255.255.0
    no shutdown
exit
ip route 0.0.0.0 0.0.0.0 192.168.12.2
```

### R3の設定(ネットワーク)
```bash
enable
configre terminal

interface eth0/0
    ip address 192.168.23.3 255.255.255.0
    no shutdown
exit
ip route 192.168.12.0 255.255.255.0 192.168.23.2
```

:::tip[R3のデフォルトルートの設定の書き方なにこれ]
`192.168.12.0`が、`192.168.23.2`を経由してルーティングされるようにするやつです
:::

### R2の設定(ゲートウェイのルーター)
```bash
enable
configre terminal

ip access-list extended go_in 
    evaluate from_R1
ip access-list extended go_out
    permit ip host 192.168.12.1 any reflect from_R1 timeout 300

interface eth0/1
    ip address 192.168.12.2 255.255.255.0
    no shutdown
```

```bash
;eth0/0の設定

interface eth0/1
    ip address 192.168.23.3 255.255.255.0
exit
ip route 192.168.12.0 255.255.255.0 192.168.23.2
```

## IPv6つける
### R1の設定
```bash
interface eth0/0
    ipv6 address 2001:DB8:3:100::1/64
exit
ipv6 route ::/0 2001:DB8:3:100::FF
```
### R3の設定
```bash
interface eth0/1
    ipv6 address 2001:DB8:3:1::1/64
exit
ipv6 route ::/0 2001:DB8:3:100::FF
```

### R2の設定
インターフェースにv6アドレスを割り当てる
```bash
interface eth0/0
    ipv6 address 2001:DB3:3:100::FF/64
    ipv6 traffic-filter from_R3 in
    ipv6 traffic-filter to_R3 out
exit
```
アクセスリストつくるよ
```bash
ipv6 access-list from_R3
    evaluate from_OS
exit
ipv6 access-list to_R3
    permit ipv6 host 2001:DB3:3:100::1 any reflect from_OSV
exit
```
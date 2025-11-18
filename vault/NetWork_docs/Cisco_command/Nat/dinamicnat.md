---
sidebar_position: 4
description: dinamic NATの構築
---

# 動的NATの構築

![nat](./img/1-1.png)

- R2の`eth0/0`の入力をすべて`100.1.1.10`から`100.1.1.20`までを変換して`eth0/1`へ流す

- R1とR2の設定は静的NATのものを参照してください

| ノード | インターフェース | 役割     | IPアドレス         |
| --- | -------- | ------ | -------------- |
| R1  | Eth0/0   | 内部LAN側 | 192.168.1.1/24 |
| R3  | Eth0/0   | 外部サーバー | 100.1.1.254/24 |

## R1とR3の設定
```bash
; R1ルーターのIPアドレスを指定
enable
configure terminal
interface eth0/0
 ip address 192.168.1.1 255.255.255.0
 no shutdown
exit

; デフォルトルートの設定
ip route 0.0.0.0 0.0.0.0 192.168.1.2
```

```bash
; R3ルーターのIPアドレスを指定
enable
configure terminal
interface eth0/0
 ip address 100.1.1.254 255.255.255.0
 no shutdown
exit

```

## R2ルーター
```bash
enable
configure terminal
interface eth0/0
 ip address 192.168.1.254 255.255.255.0
 ip nat inside
interface eth0/1
 ip address 100.1.1.10 255.255.255.0
 ip nat outside
```

## dinamicNAT
```bash
enable 
configre terminal
ip nat pool dynamic1 100.1.1.10 100.1.1.20 netmask 255.255.255.0
ip nat inside source list 1 pool dynamic1
```
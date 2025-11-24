---
sidebar_position: 2
description: Static NATの構築
---

# はじめに
今回のページでは、Static NAT（スタティックNAT）を用いて、内部ネットワークの特定の端末を外部ネットワークから常に同じグローバルIPアドレスでアクセスできるようにする設定方法について解説します。

Static NATの構築について触れていきます

## Static Natとは?

Static NAT（スタティックNAT）は、内部ネットワークの特定のIPアドレスと外部ネットワークの特定のIPアドレスを1対1で固定的に対応付けるNAT（Network Address Translation）の方式です。  
これにより、内部の特定の端末が常に同じグローバルIPアドレスで外部と通信できるようになります。主にサーバー公開や外部からのアクセスが必要な機器に利用されます。

## 設定方法
### 前提条件

![設定](./img/1-1.png)

| ノード | インターフェース | 役割     | IPアドレス         |
| --- | -------- | ------ | -------------- |
| R1  | Eth0/0   | 内部LAN側 | 192.168.1.1/24 |
| R2  | Eth0/0   | 内部LAN側 | 192.168.1.2/24 |
| R2  | Eth0/1   | 外部WAN側 | 100.1.1.1/24 |
| R3  | Eth0/0   | 外部サーバー | 100.1.1.254/24 |

- インターフェースは無料版だとGi0/0とかにリネームできないことが判明したためイーサネットじゃないけどEthを採用する羽目になりました。かなしい
- 今回の設定だとR1からR3へR3を外部サーバーとして指定、R3からは通じるわけがない状態で組みます

## IPの設定
### R1、R3の初期設定

```bash
; R1ルーターのIPアドレスを指定
enable
configure terminal
interface eth0/0
 ip address 192.168.1.1 255.255.255.0 
 no shutdown
exit

; デフォルトゲートウェイの設定
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

ip route 0.0.0.0 0.0.0.0 100.1.1.1
```

### R2ルーターにIPv4のアドレスを指定
```bash
; R2ルーターのIPアドレスを指定
enable
configure terminal

! 内部インターフェース（LAN側）
interface eth0/0
 ip address 192.168.1.2 255.255.255.0
 no shutdown
 ip nat inside
exit

! 外部インターフェース（WAN側）
interface eth0/1
 ip address 100.1.1.1 255.255.255.0
 no shutdown
 ip nat outside
exit

! 不要なHTTPサービスを停止
no ip http server
no ip http secure-server

! 静的NATマッピングの設定
ip nat inside source static 192.168.1.1 100.1.1.1

! 外部向けデフォルトルート
ip route 0.0.0.0 0.0.0.0 100.1.1.254

```

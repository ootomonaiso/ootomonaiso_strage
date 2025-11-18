---
sidebar_position: 4
description: IOLで使えないコマンド
---

# IOL(IOS on Linux)で動かないコマンドがあるのはなぜ

## IOLとは

IOS(Internetworking Operating System)をLinux仮想環境上で動作させることができる検証用の仮想OSです。

## 使えないコマンド集

### ip virtual-reassembly 
フラグメントされたIPのパケットを再構築する機能で、主にNATやFirewallなどの処理を正しく行うために使います

例えば受信方向にこの機能を適用する場合は以下のコマンドになります

```bash
; 適用するインターフェースを指定
interface eth0/0
 ip virtual-reassembly in

```

- `in`: 受信方向のトラフィックに対して適用
- `out`: 送信方向のトラフィックに対して適用

### duplex
通信モードの切替について指定するコマンドです

```bash
; 適用するインターフェースを指定
interface eth0/0
 duplex auto

```

- `duplex helf` : 一度に送信or受信のどちらか一方を許可
- `duplex full` : 同時に送受信を許可
- `duplex auto` : 接続先に最適な設定に自動切換

### speed 
ポートの通信速度を接続先に応じて決定するためのコマンドです

```bash
; 適用するインターフェースを指定
interface eth0/0
 speed auto

```

- speedを`auto` にしておけば接続先に応じて通信速度を決定

### media-type
物理ポートの接続タイプを指定します。例えば光ファイバケーブル(SFP)とLANケーブル(RJ-45)とか。

```bash
; 適用するインターフェースを指定
interface eth0/0
 media-type rj45

```

- 自動検出することもできるらしい `media-type auto`


---
sidebar_position: 2
description: teratarmでルーターにワンタッチ接続しようぜって
---

# TeraTermでCML上にあるルーターへアクセスできるようにする

まずこのコードを`任意の名前.ttl` として保存

- ttlはTeraTarmの接続設定ファイル

```bash
; 接続情報
HOSTADDR = '192.168.40.132'
USERNAME = 'admin'
PASSWORD = 'Ootomonaiso39'
LABPATH = '/obenkyo/R1/0'  

; SSHコマンド作成
COMMAND = HOSTADDR
strconcat COMMAND ':22 /ssh /2 /auth=password /user='
strconcat COMMAND USERNAME
strconcat COMMAND ' /passwd='
strconcat COMMAND PASSWORD

; 接続
connect COMMAND

wait '>'

LABPATH_CMD = ''
strconcat LABPATH_CMD 'open '
strconcat LABPATH_CMD LABPATH
sendln LABPATH_CMD

```

次にこれを `任意の名前.bat` として保存

```bash
@echo off
; C:\Program Files (x86)\teraterm5\ttermpro.exeはTeraTermの実行ファイルのパスです。インストール先に合わせて適宜変更
start "" "C:\Program Files (x86)\teraterm5\ttermpro.exe" /M="絶対パスでttlファイルのパスを明示"
```

batファイルを実行すれば動くはずです。
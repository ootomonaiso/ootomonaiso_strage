---
sidebar_position: 1
description: 環境について
---

# 便利情報雑記

## TeraTermでCML上にあるルーターへアクセスできるようにする

```bash
; connect_cml.ttl - CMLにSSHして open コマンドを打つ
username = 'admin' ; CMLのWebアプリ側に入るときのユーザー名をここに
password = 'yourpassword'　; CMLのパスワードをここに
hostname = '192.168.0.100' ;　CMLにアクセスするときのIPアドレスをここに

lab_id = 'cf8f2e' ;　構築してるLabの名前をここに
node_id = '3df10b' ; ノードというかルーターのおなまえをここに

strconcat cmd "open /"
strconcat cmd lab_id
strconcat cmd "/"
strconcat cmd node_id
strconcat cmd "/0"

; SSHログイン
connect hostname '/ssh /auth=password /user=' + username + ' /passwd=' + password

wait '$'
sendln cmd

end

```
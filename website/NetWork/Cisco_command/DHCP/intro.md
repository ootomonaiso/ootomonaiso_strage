---
sidebar_position: 1
description: DHCPを設定する手順
---

# DHCPをルーターだけでやる

## 設定方法

### ほしい情報
- DHCPサーバーとして動かすルーター側
    - どの範囲のアドレスを配布するか
        - そのアドレスではない範囲(ブラックリスト)として設定する
- DNSサーバーのアドレス

### アドレスをもらう(クライアント)側
```bash
interface (サーバー側に繋いであるインターフェース)
! ipアドレスをdhcpでもらってくる
    ip address dhcp
    no shutdown
```

### DHCPサーバとして動かすルーター
```bash
! これは除外リスト
ip dhcp excluded-address (配布しちゃダメアドレスのはじめ)　(配布しちゃダメアドレスの終わり)

! よく知らんけどとりあえずLAN1指定すればいいらしい
ip dhcp pool LAN1   
! 192.168.1.xのネットワークに対して提供する
    network 192.168.1.0 255.255.255.0　
    ! DHCPのデフォルト
    default-router 192.168.1.254
    dns-server 200.99.1.1

interface eth0/1
    !DHCPサーバーのデフォルトと同じやつを書くよ
    ip address 192.168.1.254 255.255.255.0
    no shutdown
```

```bash
! 終わったら書き込み忘れずに
copy runningconf startupconf 
```

### 確認用コマンドリスト
- DHCPサーバー側で配布状況確認
    - クライアント側のIPアドレスがあればOK
```bash
show ip dhcp binding
```

- クライアント側で取得状況確認
    - 指定したインターフェースにDHCPと指定した範囲内のいずれかのアドレスがあればOK
```bash
show ip interface brief
```


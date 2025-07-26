# R-Gnm 設定例

## 設定内容
- PPPoEクライアント設定（MTU 1492、CHAP認証）
- NAT（ISPから取得したIPで内部アドレスを変換）
- DHCPサーバ（192.168.1.1～30、DNS: sv、GW配布）

---

## 具体的な設定コマンド

### 基本設定
```
enable
configure terminal
hostname R-Gnm
```

### PPPoEクライアント設定
```
! PPPoEクライアント設定
interface Dialer1
 ip address negotiated
 ip mtu 1492
 encapsulation ppp
 dialer pool 1
 ppp authentication chap callin
 ppp chap hostname [ISPユーザー名]
 ppp chap password [ISPパスワード]
 no shutdown

! 物理インターフェースの設定
interface GigabitEthernet0/0
 no ip address
 pppoe enable
 pppoe-client dial-pool-number 1
 no shutdown
```

### NAT設定
```
! NATプール設定（ISPから取得したIP使用）
ip nat inside source list 1 interface Dialer1 overload

! 内部ネットワークアクセスリスト
access-list 1 permit 192.168.1.0 0.0.0.255

! インターフェースへのNAT適用
interface Dialer1
 ip nat outside

interface GigabitEthernet0/1
 ip nat inside
```

### 内部インターフェース設定
```
interface GigabitEthernet0/1
 ip address 192.168.1.1 255.255.255.0
 no shutdown
```

### DHCPサーバ設定
```
! DHCPプール設定
ip dhcp pool GUNMA_POOL
 network 192.168.1.0 255.255.255.0
 range 192.168.1.2 192.168.1.30
 default-router 192.168.1.1
 dns-server [sv_ip_address]
 lease 1 0 0

! DHCP除外アドレス
ip dhcp excluded-address 192.168.1.1
```

### デフォルトルート設定
```
ip route 0.0.0.0 0.0.0.0 Dialer1
```


# R-Tky1 設定例

## 設定内容
- デフォルトルート（IPv4/IPv6）
- Internalへのスタティックルート
- NAT（tsv → 201.10.0.10）
- ACL（IPv4/IPv6）
  - tsv宛の各種サービス・ICMP・戻り通信のみ許可

---

## 具体的な設定コマンド

### 基本設定
```
enable
configure terminal
hostname R-Tky1
```

### インターフェース設定
```
! 外部インターフェース
interface GigabitEthernet0/0
 ip address dhcp
 no shutdown

! 内部インターフェース
interface GigabitEthernet0/1
 ip address 192.168.1.1 255.255.255.0
 no shutdown
```

### デフォルトルート設定
```
! IPv4デフォルトルート
ip route 0.0.0.0 0.0.0.0 dhcp

! IPv6デフォルトルート（必要に応じて）
ipv6 unicast-routing
ipv6 route ::/0 GigabitEthernet0/0
```

### スタティックルート設定
```
! Internalネットワークへのルート
ip route 192.168.0.0 255.255.0.0 192.168.1.2
```

### NAT設定
```
! NAT設定（tsv → 201.10.0.10）
ip nat inside source static 192.168.1.100 201.10.0.10

! インターフェースへのNAT適用
interface GigabitEthernet0/0
 ip nat outside

interface GigabitEthernet0/1
 ip nat inside
```

### ACL設定
```
! IPv4 ACL
access-list 100 permit tcp any host 192.168.1.100 eq www
access-list 100 permit tcp any host 192.168.1.100 eq 443
access-list 100 permit tcp any host 192.168.1.100 eq smtp
access-list 100 permit tcp any host 192.168.1.100 eq pop3s
access-list 100 permit tcp any host 192.168.1.100 eq ftp
access-list 100 permit tcp any host 192.168.1.100 eq 8080
access-list 100 permit icmp any host 192.168.1.100
access-list 100 permit tcp any host 192.168.1.100 established
access-list 100 deny ip any any

! IPv6 ACL
ipv6 access-list IPV6-IN
 permit tcp any host [tsv_ipv6_address] eq www
 permit tcp any host [tsv_ipv6_address] eq 443
 permit tcp any host [tsv_ipv6_address] eq smtp
 permit tcp any host [tsv_ipv6_address] eq pop3s
 permit tcp any host [tsv_ipv6_address] eq ftp
 permit tcp any host [tsv_ipv6_address] eq 8080
 permit icmp any host [tsv_ipv6_address]
 permit icmp any any nd-na
 permit icmp any any nd-ns
 permit icmp any any router-advertisement
 permit icmp any any router-solicitation
 permit tcp any host [tsv_ipv6_address] established
 deny ipv6 any any

! インターフェースへのACL適用
interface GigabitEthernet0/0
 ip access-group 100 in
 ipv6 traffic-filter IPV6-IN in
```


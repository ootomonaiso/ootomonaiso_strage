# R-Tky2 設定例

## 設定内容
- デフォルトゲートウェイ: R-Tky1
- DHCPリレー（tsvをDHCPサーバとして）

---

## 具体的な設定コマンド

### 基本設定
```
enable
configure terminal
hostname R-Tky2
```

### インターフェース設定
```
! R-Tky1側インターフェース
interface GigabitEthernet0/0
 ip address 192.168.1.2 255.255.255.0
 no shutdown

! クライアント側インターフェース
interface GigabitEthernet0/1
 ip address 192.168.1.254 255.255.255.0
 no shutdown
```

### デフォルトゲートウェイ設定
```
ip route 0.0.0.0 0.0.0.0 192.168.1.1
```

### DHCPリレー設定
```
! DHCPリレーエージェント有効化
service dhcp

! tsvをDHCPサーバとして指定
interface GigabitEthernet0/1
 ip helper-address 192.168.1.100
```

### 設定保存
```
write memory
```

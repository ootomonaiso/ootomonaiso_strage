---
sidebar_position: 1
---
# NetWorkに関するドキュメント
ネットワークについて詳しくなりましょう
今回は仮想環境でやりますが実機環境と大して変わらないのでそのまま参照できます

# 必須コマンド・設定チートシート(完全版)
[manコマンドで参照できる主なマニュアル一覧]

```
man smb.conf        # Sambaの設定ファイル全般
man testparm        # Samba設定ファイルの検証
man smbd            # Sambaデーモン
man smbpasswd       # Sambaユーザー管理
man net             # Samba管理コマンド
man share           # 共有設定キーワード
man sshd            # SSHデーモン
man sshd_config     # SSH設定ファイル
man ssh-keygen      # SSH鍵生成
man systemctl       # サービス管理
man useradd         # ユーザー追加
man groupadd        # グループ追加
man chpasswd        # パスワード一括設定
man chage           # アカウント有効期限
man quota           # ディスククオータ
man setquota        # クオータ設定
man fstab           # マウント設定
man nano            # テキストエディタ
man dig             # DNS問い合わせ
man host            # 名前解決
man ping            # 疎通確認
man ping6           # IPv6疎通確認
man traceroute      # 経路確認
man tcpdump         # パケットキャプチャ
man ss              # ソケット状態
man netstat         # ポート状態
man journalctl      # ログ確認
```
[主要サービスの基本設定例]

---
### Squid（Webプロキシサーバー）
インストール：
```
apt install squid
```
設定ファイル：
```
nano /etc/squid/squid.conf
```
基本設定例：
```
http_port 3128
acl localnet src 192.168.0.0/16
http_access allow localnet
http_access deny all
cache_mem 128 MB
maximum_object_size_in_memory 512 KB
access_log /var/log/squid/access.log
```
サービス管理：
```
systemctl restart squid
systemctl status squid
```
manコマンド：
```
man squid
man squid.conf
```

---
### tftpd-hpa（TFTPサーバー）
インストール：
```
apt install tftpd-hpa
```
設定ファイル：
```
nano /etc/default/tftpd-hpa
```
基本設定例：
```
TFTP_USERNAME="tftp"
TFTP_DIRECTORY="/srv/tftp"
TFTP_ADDRESS="0.0.0.0:69"
TFTP_OPTIONS="--secure"
```
ディレクトリ作成：
```
mkdir -p /srv/tftp
chown tftp:tftp /srv/tftp
```
サービス管理：
```
systemctl restart tftpd-hpa
systemctl status tftpd-hpa
```
manコマンド：
```
man tftpd-hpa
man tftpd
```

## ルータ設定 (Cisco IOS)

### 基本コマンド
```
enable                      # 特権モード：通常モードから特権EXECモードに移行する
configure terminal          # 設定モード：グローバルコンフィギュレーションモードに入る
copy running-config startup-config  # 設定保存：現在の設定を不揮発性メモリに保存
show running-config         # 現在の設定確認：実行中の設定を表示する
show ip interface brief     # インターフェース状態確認：全インターフェースの状態を簡潔に表示
```

### ターミナル環境設定（資料 1.1.2 必須）
```
# DNS検索無効化：コマンド誤入力時にDNS検索を試みるのを防止する
# これにより、コマンド入力ミスをした時の応答時間が短縮される
no ip domain-lookup        

# タイムゾーン設定：ルータの時計を日本標準時（UTC+9時間）に設定する
# ログや時刻同期などで正確な現地時間を表示するために必要
clock timezone JST 9       

# コンソール回線の設定：コンソールポート（物理的な管理ポート）の設定を開始
line console 0

 # 自動ログアウト無効化：無操作時のセッション切断をなくす（0分0秒=無効）
 # 競技中に作業が中断されないようにするため
 exec-timeout 0 0          
 
 # More機能無効化：長い出力時の「--More--」プロンプト表示をなくす
 # 大量の設定を表示する際にスムーズにスクロールするため
 terminal length 0         
 
 # 表示割り込み同期：コマンド入力中にメッセージが割り込んだ場合、
 # 入力中のテキストを保持し、メッセージの後に再表示する
 logging synchronous       
 
 # 特権モードアクセス許可：コンソールログイン時に自動的に特権モードに入る
 # 毎回enableコマンドを入力する手間を省く
 privilege level 15        
```

### PPPoE設定（資料 1.4.2 必須）
```
# R-Gnm側の設定
# Dialerインターフェースの設定：論理的なダイヤルアップインターフェースを作成
interface Dialer1
 # IPアドレスをISPから自動取得する設定
 ip address negotiated
 
 # MTUサイズ設定：PPPoEでは通常イーサネットMTU(1500)から8バイト減らす必要がある
 ip mtu 1492
 
 # PPPカプセル化：データをPPPフレームに格納する方式を指定
 encapsulation ppp
 
 # ダイヤラプール番号：物理インターフェースとの関連付けに使用
 dialer pool 1
 
 # CHAP認証を使用：ISPがCHAP認証方式を要求するため必要
 ppp authentication chap
 
 # CHAP認証のユーザー名（資料1.4.2の指定通り）
 ppp chap hostname ppp-user
 
 # CHAP認証のパスワード（資料1.4.2の指定通り）
 ppp chap password R6pass

# 物理インターフェースの設定：実際のネットワークケーブルが接続されるポート
interface GigabitEthernet0/0
 # PPPoE機能の有効化：このインターフェースでPPPoEを使用可能にする
 pppoe enable
 
 # 上記で定義したダイヤラプール番号と関連付け
 pppoe-client dial-pool-number 1
```

### 経路制御・NAT設定
```
# デフォルト経路の設定（資料 1.2.1, 1.3.1, 1.4.1）
# デフォルトルート：宛先不明パケットの転送先を指定。インターネット接続に必須
ip route 0.0.0.0 0.0.0.0 [ネクストホップIP]  # IPv4のデフォルトルート設定
ipv6 route ::/0 [ネクストホップIPv6]         # IPv6のデフォルトルート設定

# 静的NAT設定（資料 1.2.2）
# 1対1の固定変換：特定の内部IPを固定の外部IPにマッピング
# Webサーバなど、外部から接続が必要なサーバに使用
ip nat inside source static [内部IP] [外部IP]

# 動的NAT設定（資料 1.4.3）
# 多対1のPAT(ポートアドレス変換)：内部ネットワーク全体を1つのグローバルIPで外部接続
# overload：ポート番号を利用して複数の内部IPを1つの外部IPで共有する設定
ip nat inside source list [ACL番号] interface [インターフェース] overload

# どの内部ネットワークをNAT対象にするかを指定するACL
access-list [ACL番号] permit [内部ネットワーク] [ワイルドカードマスク]

# インターフェース設定
interface GigabitEthernet0/0
 ip nat outside    # 外部ネットワークに面するインターフェース
interface GigabitEthernet0/1
 ip nat inside     # 内部ネットワークに面するインターフェース
```

### DHCPサーバー・リレー設定
```
# DHCPリレー設定（資料 1.3.2）
# DHCPリレーエージェント：異なるサブネット間でDHCP要求を転送する機能
# サブネットごとにDHCPサーバーを置く必要がなく、中央集中管理が可能になる
interface GigabitEthernet0/1
 # クライアントからのDHCP要求をDHCPサーバーに転送する設定
 # ブロードキャストをユニキャストに変換して転送する
 ip helper-address [DHCPサーバーIP]

# DHCPサーバー設定（資料 1.4.4）
# IPアドレスプールの作成：DHCPで配布するIP範囲とオプション情報を定義
ip dhcp pool [プール名]
 # このプールが適用されるネットワークアドレス範囲
 network [ネットワーク] [サブネットマスク]
 
 # クライアントに通知するデフォルトゲートウェイ
 # クライアントがローカルネットワーク外と通信するために必要
 default-router [デフォルトゲートウェイIP]
 
 # クライアントに通知するDNSサーバー
 # 名前解決を行うために必要
 dns-server [DNSサーバーIP]
 
 # IPアドレスのリース期間設定
 # この時間が過ぎるとクライアントは再度IPを要求する必要がある
 lease [日数] [時間] [分]

# 除外アドレス設定
# DHCPで自動割当しないIPアドレス範囲を指定
# 静的に割り当てたいサーバーなどのIPを保護するために使用
ip dhcp excluded-address [開始IP] [終了IP]
```

### アクセス制御（ACL）
```
# IPv4アクセス制御（資料 1.2.3）
# 名前付きの拡張ACL作成：標準ACLより詳細な制御が可能（ポートやプロトコルも指定可能）
ip access-list extended [名前]
 # 確立済みのTCP接続のみ許可：戻りトラフィックを許可する設定
 # 内部から開始された接続の応答のみ許可（ステートフルフィルタリング）
 permit tcp [送信元ネット] [ワイルドカード] [宛先ネット] [ワイルドカード] established
 
 # DNSトラフィック許可：UDPポート53（DNS）の通信を許可
 # 名前解決に必要なDNSサーバーへの問い合わせを可能にする
 permit udp [送信元ネット] [ワイルドカード] [宛先ネット] [ワイルドカード] eq 53
 
 # Webトラフィック許可：TCPポート80（HTTP）の通信を許可
 # Webサイトの閲覧を可能にする
 permit tcp [送信元ネット] [ワイルドカード] [宛先ネット] [ワイルドカード] eq 80
 
 # メールトラフィック許可：TCPポート25（SMTP）の通信を許可
 # メール送信を可能にする
 permit tcp [送信元ネット] [ワイルドカード] [宛先ネット] [ワイルドカード] eq 25
 
 # Ping許可：ICMP echo（Ping）の通信を許可
 # ネットワーク疎通確認のためのPingを可能にする
 permit icmp [送信元ネット] [ワイルドカード] [宛先ネット] [ワイルドカード] echo
 
 # 暗黙の拒否を明示的に記述：上記のルールに一致しないすべてのトラフィックを拒否
 # セキュリティ強化のため、許可されていないすべてのトラフィックを明示的に拒否
 deny ip any any

# インターフェース適用
interface GigabitEthernet0/0
 # 作成したACLをインターフェースの入力方向（外部からの流入）に適用
 ip access-group [名前] in

# IPv6アクセス制御（資料 1.2.4）
# IPv6用のACL作成：IPv6トラフィックをフィルタリング
ipv6 access-list [名前]
 # IPv4と同様に確立済みTCP接続を許可
 permit tcp any established
 
 # IPv6でのDNS通信を許可
 permit udp any any eq 53
 
 # IPv6でのWeb通信を許可
 permit tcp any any eq 80
 
 # IPv6でのPing（ICMPv6 echo-request）を許可
permit icmp any any echo-request           # ping (Echo Request)
permit icmp any any echo-reply             # ping応答 (Echo Reply)
permit icmp any any neighbor-solicitation  # 近接ノード要請 (Neighbor Solicitation)
permit icmp any any neighbor-advertisement # 近接ノード広告 (Neighbor Advertisement)

 # IPv6の他のすべてのトラフィックを拒否
deny ipv6 any any

# インターフェース適用
interface GigabitEthernet0/0
 # IPv6のACLをインターフェースの入力方向に適用
 ipv6 traffic-filter [名前] in
```

## Debian Linux設定

### ネットワーク設定（資料 2.1.1）
```
# インターフェース設定
nano /etc/network/interfaces

# 静的IP設定
auto eth0
iface eth0 inet static
  address 192.168.1.1         # osv2用
  netmask 255.255.255.0
  gateway 192.168.1.254       # デフォルトゲートウェイ
  dns-nameservers 127.0.0.1   # 自身をネームサーバに

# IPv6設定
iface eth0 inet6 static
  address 2001:DB8:3:100::1   # osv1用
  netmask 64
  gateway 2001:DB8:3:100::FF

# 設定適用
systemctl restart networking
```

### DNSサーバー (Bind9)（資料 2.3）
```
# インストール
apt install bind9

# 主要設定ファイル
/etc/bind/named.conf         # 主設定ファイル（他の設定ファイルをinclude）
/etc/bind/named.conf.local    # ゾーン設定（追加するゾーン情報）
/etc/bind/named.conf.options  # グローバルオプション（DNSサーバーの動作設定）
/etc/bind/db.[ゾーン名]       # ゾーンファイル（各ドメインのレコード情報）

#----------------------------------------------------
# 1. グローバル設定 - /etc/bind/named.conf.options
#----------------------------------------------------

# named.conf.options の設定例（資料 2.3.1）
options {
  directory "/var/cache/bind";  # キャッシュ保存場所
  
  # DNSSEC関連設定
  dnssec-validation no;       # DNSSEC検証無効（資料2.3.1指定）
  
  # 問い合わせ関連設定
  recursion yes;              # 再帰問い合わせ許可
  allow-recursion {           # 再帰問い合わせを許可するクライアント
    127.0.0.1;                # localhost
    192.168.1.0/24;           # 大阪事業所 Internal1ネットワーク
    192.168.2.0/24;           # 大阪事業所 Internal2ネットワーク
  }; 
  
  # 外部DNSへの転送設定
  forward only;               # 自身での反復問い合わせを行わない（資料2.3.1指定）
  forwarders { 200.99.1.1; }; # svのIPアドレスへ転送
  
  # 追加セキュリティ設定
  allow-query {               # クエリを受け付けるクライアント
    any;                      # osv1は外部からも問い合わせ可能
    # 192.168.0.0/16;         # osv2は内部のみの場合はこのように制限
  };
  
  # リッスンアドレス設定
  listen-on {                 # IPv4リッスンアドレス
    127.0.0.1;                # localhost
    201.10.0.25;              # osv1外部IP
    # 192.168.1.1;            # osv2内部IP
  };
  listen-on-v6 { any; };      # IPv6リッスンアドレス
};

#----------------------------------------------------
# 2. ゾーン設定 - /etc/bind/named.conf.local
#----------------------------------------------------

# osv1のマスターゾーン設定（外部向け）（資料 2.3.2）
zone "osaka-skills.jp" {
  type master;                               # マスターサーバー
  file "/etc/bind/db.osaka-skills.jp";       # ゾーンファイルの場所
  allow-transfer { 192.168.1.1; };           # osv2へのゾーン転送許可
  also-notify { 192.168.1.1; };              # ゾーン変更時にosv2へ通知
  notify yes;                                # ゾーン変更通知を有効化
};

# osv1のスレーブゾーン設定（内部向け）（資料 2.3.2）
zone "osaka-skills.jp" {
  type slave;                               # スレーブサーバー
  file "/var/cache/bind/db.osaka-skills.jp"; # キャッシュファイルの場所
  masters { 192.168.1.1; };                 # osv2をマスターとする
  allow-notify { 192.168.1.1; };            # osv2からの通知を許可
};

# osv2のマスターゾーン設定（内部向け）（資料 2.3.3）
zone "osaka-skills.jp" {
  type master;                              # マスターサーバー 
  file "/etc/bind/db.osaka-skills.jp";      # ゾーンファイルの場所
  allow-transfer { 201.10.0.25; };          # osv1へのゾーン転送許可
  also-notify { 201.10.0.25; };             # ゾーン変更時にosv1へ通知
  notify yes;                               # ゾーン変更通知を有効化
};

# 逆引きゾーンの例（必要に応じて設定）
zone "25.0.10.201.in-addr.arpa" {           # osv1の逆引き（201.10.0.25）
  type master;
  file "/etc/bind/db.201.10.0";
};

zone "1.1.168.192.in-addr.arpa" {           # osv2の逆引き（192.168.1.1）
  type master;
  file "/etc/bind/db.192.168.1";
};

#----------------------------------------------------
# 3. ゾーンファイル - /etc/bind/db.osaka-skills.jp
#----------------------------------------------------

# osv1のゾーンファイル例（資料 2.3.2）
$TTL 86400                        # デフォルトTTL（1日）
@       IN      SOA     osv1.osaka-skills.jp. root.osaka-skills.jp. (
                         2024080101    ; シリアル番号（年月日+連番）
                         3600          ; リフレッシュ間隔（1時間）
                         900           ; リトライ間隔（15分）
                         604800        ; 有効期限（1週間）
                         3600 )        ; 否定的応答のキャッシュTTL（1時間）

; ネームサーバーレコード（NSレコード）
@       IN      NS      osv1.osaka-skills.jp.  ; プライマリネームサーバー
@       IN      NS      osv2.osaka-skills.jp.  ; セカンダリネームサーバー

; メールサーバーレコード（MXレコード）
@       IN      MX      10 mail.osaka-skills.jp.  ; 優先度10のメールサーバー
@       IN      MX      20 osv2.osaka-skills.jp.  ; 優先度20のメールサーバー（バックアップ）

; Aレコード（ホスト名→IPv4アドレスの対応）
osv1    IN      A       201.10.0.25            ; osv1のIPv4アドレス
osv2    IN      A       192.168.1.1            ; osv2のIPv4アドレス
sec     IN      A       201.10.0.25            ; secのIPv4アドレス
mail    IN      A       201.10.0.25            ; mailのIPv4アドレス

; AAAAレコード（ホスト名→IPv6アドレスの対応）
osv1    IN      AAAA    2001:DB8:3:100::1      ; osv1のIPv6アドレス
www6    IN      AAAA    2001:DB8:3:100::1      ; www6のIPv6アドレス

; CNAMEレコード（エイリアス設定）
www     IN      CNAME   osv1                   ; www → osv1の別名
in      IN      CNAME   osv2                   ; in → osv2の別名

#----------------------------------------------------
# 4. 逆引きゾーンファイル - /etc/bind/db.201.10.0 の例
#----------------------------------------------------

$TTL 86400
@       IN      SOA     osv1.osaka-skills.jp. root.osaka-skills.jp. (
                         2024080101    ; シリアル番号
                         3600          ; リフレッシュ
                         900           ; リトライ
                         604800        ; 有効期限
                         3600 )        ; 否定的応答のキャッシュTTL

; ネームサーバー
@       IN      NS      osv1.osaka-skills.jp.

; 逆引きレコード（PTR）- IPアドレス最後のオクテット IN PTR ホスト名
25      IN      PTR     osv1.osaka-skills.jp.  ; 201.10.0.25 → osv1.osaka-skills.jp

#----------------------------------------------------
# 5. 設定チェックとサービス管理
#----------------------------------------------------

# 構文チェック
named-checkconf                               # 全設定ファイルの構文チェック
named-checkconf /etc/bind/named.conf.local    # 特定ファイルの構文チェック
named-checkzone osaka-skills.jp /etc/bind/db.osaka-skills.jp  # ゾーンファイルチェック

# サービス管理
systemctl restart named        # サービス再起動
systemctl enable named         # 起動時に自��起動
systemctl status named         # サービス状態確認
journalctl -u named            # サービスログ確認

# 動作確認
dig @localhost osaka-skills.jp          # DNSサーバーにドメイン情報問い合わせ
dig @localhost -t MX osaka-skills.jp    # MXレコード問い合わせ
dig @localhost -x 201.10.0.25           # 逆引き問い合わせ
```

### Webサーバー（資料 2.4）
```
# Nginx（osv1用 - 資料 2.4.1）
apt install nginx

# 設定ファイル
nano /etc/nginx/sites-available/default

# Nginx基本設定
server {
  listen 80;
  server_name www.osaka-skills.jp;
  root /var/www/html;
  index index.html;
}

# IPv6サイト設定
server {
  listen [::]:80;
  server_name www6.osaka-skills.jp;
  root /var/www/ipv6;
  index index.html;
}

# SSL/リバースプロキシ設定
server {
  listen 443 ssl;
  server_name sec.osaka-skills.jp;
  
  ssl_certificate /etc/nginx/ssl/server_ca.crt;
  ssl_certificate_key /etc/nginx/ssl/server.key;
  
  location / {
    proxy_pass http://192.168.1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

# 構文チェック
nginx -t

# Apache2（osv2用 - 資料 2.4.2）
apt install apache2
nano /etc/apache2/sites-available/000-default.conf

# バックエンド設定
<VirtualHost *:80>
  ServerName sec.osaka-skills.jp
  DocumentRoot /var/www/html
</VirtualHost>

# ユーザーホームページ設定
<VirtualHost *:80>
  ServerName in.osaka-skills.jp
  DocumentRoot /var/www/html
  <Directory /home/alice/public_html>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
  </Directory>
  Alias /~alice/ /home/alice/public_html/
</VirtualHost>

a2enmod userdir        # ユーザーディレクトリモジュール有効化
a2ensite 000-default   # 設定有効化
apache2ctl configtest  # 構文チェック
systemctl restart apache2
```

### メールサーバー（資料 2.5）
```
# Postfix（資料 2.5.1）
apt install postfix

# 主要設定ファイル
nano /etc/postfix/main.cf

# 共通設定
myhostname = osv1.osaka-skills.jp
mydomain = osaka-skills.jp
myorigin = $mydomain
mydestination = $myhostname, localhost.$mydomain, $mydomain
inet_interfaces = all
inet_protocols = all

# osv1固有設定
mynetworks = 127.0.0.0/8 192.168.1.0/24 192.168.2.0/24
relay_domains = osaka-skills.jp
transport_maps = hash:/etc/postfix/transport

# /etc/postfix/transport
osaka-skills.jp    smtp:192.168.1.1

# osv2固有設定
mynetworks = 127.0.0.0/8 192.168.1.0/24 192.168.2.0/24
relay_domains = !osaka-skills.jp
transport_maps = hash:/etc/postfix/transport
alias_maps = hash:/etc/aliases

# /etc/postfix/transport
* smtp:201.10.0.25

# /etc/aliases
admin: master

# コマンド実行
postmap /etc/postfix/transport
newaliases
postfix check
systemctl restart postfix

# Dovecot（資料 2.5.2）
apt install dovecot-imapd

# 認証設定
nano /etc/dovecot/conf.d/10-auth.conf
disable_plaintext_auth = no  # 平文認証許可

# メールボックス設定
nano /etc/dovecot/conf.d/10-mail.conf
mail_location = mbox:~/mail:INBOX=/var/mail/%u

systemctl restart dovecot
```

### DHCPサーバー（資料 2.6）
```
# インストール
apt install isc-dhcp-server

# 設定ファイル
nano /etc/dhcp/dhcpd.conf

# DHCPサーバー設定（osv2用）
subnet 192.168.2.0 netmask 255.255.255.0 {
  range 192.168.2.101 192.168.2.110;
  option domain-name-servers 192.168.1.1;
  option routers 192.168.2.254;
  default-lease-time 600;
  max-lease-time 7200;
}

# インターフェース指定
nano /etc/default/isc-dhcp-server
INTERFACESv4="eth1"  # Internal2ネットワーク向けインターフェース

systemctl restart isc-dhcp-server
```

### ファイル共有 (Samba)（資料 2.7）
```
# インストール
apt install samba

# 設定ファイル
nano /etc/samba/smb.conf

# 共有設定
[global]
   workgroup = WORKGROUP
   security = user
   hosts allow = 192.168.2.0/24
   hosts deny = all

# マニュアルにはaprinterとして紹介　man から shareで調べてね
[share]
   path = /home/share
   valid users = @g_osaka
   writable = yes
   browseable = yes

# 共有ディレクトリ作成
mkdir -p /home/share
chmod 277 /home/share
chown root:g_osaka /home/share

# Sambaユーザー追加
smbpasswd -a alice
smbpasswd -a bob
smbpasswd -a charlie

# 設定チェック
testparm

systemctl restart smbd
```

### SSHサーバー（資料 2.8）
```
# インストール
apt install openssh-server

# 設定ファイル
nano /etc/ssh/sshd_config

# 特殊ポート設定
Port 10022

# パスワード認証無効化
PasswordAuthentication no

# 接続元制限
AllowUsers *@192.168.2.*

# 鍵作成（ユーザーアカウントで実行）
ssh-keygen -t rsa -f ~/.ssh/id_rsa -N "Ssh2024"  # パスフレーズ指定

# 公開鍵の配置
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat id_rsa.pub > ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

systemctl restart sshd
```

## ディスククオータ設定（資料 2.2.2）
```
# インストール
apt install quota

# ファイルシステムマウントオプション設定
nano /etc/fstab
/dev/sda3  /home  ext4  defaults,usrquota,grpquota  0  2

# 再マウント
mount -o remount /home

# クオータ初期化
quotacheck -ugm /home

# クオータ有効化
quotaon /home

# クオータ設定（bobに対して）
setquota -u bob 102400 204800 0 0 /home  # Soft:100MB, Hard:200MB

# クオータ確認
quota -v bob
```

## ユーザー管理（資料 2.2.2）
```
# ユーザー追加
useradd -m -d /home/alice alice
useradd -m -d /home/bob bob
useradd -m -d /home/charlie charlie

# パスワード設定
echo "alice:pass" | chpasswd
echo "bob:pass" | chpasswd
echo "charlie:pass" | chpasswd

# グループ作成とユーザー追加
groupadd g_osaka
usermod -aG g_osaka alice
usermod -aG g_osaka bob
usermod -aG g_osaka charlie

# アカウント有効期限設定
chage -E 2024-12-31 charlie
```

## sudo設定（資料 2.2.1）
```
# visudoの代わりにnanoを使用
EDITOR=nano visudo

# 設定追加
master ALL=(ALL:ALL) ALL

# またはsudoグループに追加
usermod -aG sudo master
```

## サービス管理コマンド（共通）
```
systemctl status [サービス名]   # 状態確認
systemctl restart [サービス名]  # 再起動
systemctl enable [サービス名]   # 自動起動設定
systemctl disable [サービス名]  # 自動起動無効化
systemctl stop [サービス名]     # 停止
systemctl start [サービス名]    # 起動
```

## クライアント設定（資料 3）
```
# SSHクライアント設定（資料 3.2）
# Tera Termでの設定:
# - ホスト: osv2のIP
# - ポート: 10022
# - 認証方式: 公開鍵認証
# - 秘密鍵ファイル: C:\ssh\id_rsa
# - パスフレーズ: Ssh2024
# - ユーザー名: master

# Webプロキシ設定（資料 3.3）
# Microsoft Edgeでの設定:
# - 設定 > システムとパフォーマンス > プロキシ
# - プロキシサーバーを使用する: オン
# - アドレス: [適切なプロキシサーバー]
# - ポート: [適切なポート]

# ネットワークドライブ設定（資料 3.5）
# エクスプローラーでの設定:
# - ネットワークドライブの割り当て
# - ドライブ: Z:
# - フォルダ: \\osv2\share
# - ユーザー: bob
# - パスワード: pass
```

## トラブルシューティング
```
# ネットワーク診断
ip a                   # IPアドレス確認
ip r                   # ルーティング確認
ping [IPアドレス]       # 疎通確認
ping6 [IPv6アドレス]    # IPv6疎通確認
traceroute [ホスト名]   # 経路確認
tcpdump -i [インターフェース] # パケットキャプチャ

# DNS診断
dig [ドメイン名]        # DNS問い合わせ
dig -t MX [ドメイン名]  # MXレコード確認
dig -x [IPアドレス]     # 逆引き確認
host [ドメイン名]       # 名前解決

# ログ確認
tail -f /var/log/syslog  # システムログ
tail -f /var/log/mail.log # メールログ
tail -f /var/log/auth.log # 認証ログ

# サービス確認
netstat -tulpn          # ポート使用状況
ss -tulpn               # ソケット状態確認
systemctl list-units --type=service --state=running # 実行中サービス
```

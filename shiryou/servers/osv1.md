# osv1 設定例

## 設定内容
- OS: Debian GNU/Linux 12.5
- DNS: master（外部/内部ゾーン）、再帰問い合わせ制限、MXやA/CNAMEレコード追加
- Web: nginx使用、www・www6・sec（SSL+ReverseProxy）
- SMTP: postfix、認証なし、外部転送可、spoolはosv2へ

---

## 具体的な設定手順

### 基本設定
```bash
# パッケージ更新
sudo apt update && sudo apt upgrade -y

# 必要パッケージインストール
sudo apt install bind9 bind9utils nginx postfix -y

# タイムゾーン設定
sudo timedatectl set-timezone Asia/Tokyo

# ホスト名設定
sudo hostnamectl set-hostname osv1
```

### DNS設定（BIND9）
```bash
# named.conf.local編集
sudo nano /etc/bind/named.conf.local
```

```conf
// 外部ゾーン
zone "tokyo-skills.jp" {
    type master;
    file "/etc/bind/db.tokyo-skills.jp";
    allow-transfer { 192.168.1.101; }; // osv2のIP
};

// 逆引きゾーン
zone "1.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.1";
    allow-transfer { 192.168.1.101; };
};
```

```bash
# ゾーンファイル作成
sudo nano /etc/bind/db.tokyo-skills.jp
```

```conf
$TTL    604800
@       IN      SOA     osv1.tokyo-skills.jp. admin.tokyo-skills.jp. (
                        2024072601      ; Serial
                        604800          ; Refresh
                        86400           ; Retry
                        2419200         ; Expire
                        604800 )        ; Negative Cache TTL

@       IN      NS      osv1.tokyo-skills.jp.
@       IN      MX  10  mail.tokyo-skills.jp.

osv1    IN      A       192.168.1.100
osv2    IN      A       192.168.1.101
www     IN      A       192.168.1.100
www6    IN      AAAA    [IPv6アドレス]
sec     IN      A       192.168.1.100
mail    IN      A       192.168.1.100
```

```bash
# 逆引きゾーンファイル作成
sudo nano /etc/bind/db.192.168.1
```

```conf
$TTL    604800
@       IN      SOA     osv1.tokyo-skills.jp. admin.tokyo-skills.jp. (
                        2024072601      ; Serial
                        604800          ; Refresh
                        86400           ; Retry
                        2419200         ; Expire
                        604800 )        ; Negative Cache TTL

@       IN      NS      osv1.tokyo-skills.jp.

100     IN      PTR     osv1.tokyo-skills.jp.
101     IN      PTR     osv2.tokyo-skills.jp.
```

### nginx設定
```bash
# nginx設定ファイル作成
sudo nano /etc/nginx/sites-available/tokyo-skills
```

```nginx
server {
    listen 80;
    server_name www.tokyo-skills.jp;
    root /var/www/html;
    index index.html;
}

server {
    listen 443 ssl;
    server_name sec.tokyo-skills.jp;
    
    ssl_certificate /etc/ssl/certs/server.crt;
    ssl_certificate_key /etc/ssl/private/server.key;
    
    location / {
        proxy_pass http://192.168.1.101;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# サイト有効化
sudo ln -s /etc/nginx/sites-available/tokyo-skills /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Postfix設定
```bash
# main.cf編集
sudo nano /etc/postfix/main.cf
```

```conf
myhostname = osv1.tokyo-skills.jp
mydomain = tokyo-skills.jp
myorigin = $mydomain
inet_interfaces = all
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
relayhost = 
mynetworks = 192.168.0.0/16, 127.0.0.0/8
home_mailbox = Maildir/

# スプール転送設定
transport_maps = hash:/etc/postfix/transport
```

```bash
# transport設定
sudo nano /etc/postfix/transport
```

```conf
tokyo-skills.jp    smtp:[192.168.1.101]
```

```bash
# 設定反映
sudo postmap /etc/postfix/transport
sudo systemctl restart postfix
```

### サービス起動・有効化
```bash
sudo systemctl enable bind9
sudo systemctl enable nginx
sudo systemctl enable postfix
```

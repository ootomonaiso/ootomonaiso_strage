# osv2 設定例

## OSインストール設定
- OS: Debian GNU/Linux 12.5
- キーボード: 日本語
- タイムゾーン: Asia/Tokyo
- 管理者: root / パスワード: Young2024
- 一般ユーザ: master / パスワード: pass
- ネームサーバ: 自身のIP
- デフォルトGW: 192.168.1.254（R-Osk）

## 設定内容
- OS: Debian GNU/Linux 12.5
- DNS: slave（osaka-skills.jpゾーン）、osv1へフォワード
- Web: apache2、Aliceの個人ページ対応（バックエンドサーバー）
- メール: postfix（spool）、admin→masterへのエイリアス
- IMAP: dovecot-imapd（平文認証許可）
- DHCP: isc-dhcp-server（192.168.2.101～110）
- Samba: /home/shareを共有、g_osaka所属ユーザーのみ
- SSH: openssh-server、ポート10022、パスワード認証不可

---

## 具体的な設定手順

### 基本設定
```bash
# 必要パッケージインストール
sudo apt install bind9 apache2 postfix dovecot-imapd isc-dhcp-server samba openssh-server quota

# タイムゾーン設定
sudo timedatectl set-timezone Asia/Tokyo

# ホスト名設定
sudo hostnamectl set-hostname osv2

# ユーザー追加
sudo useradd -m -s /bin/bash alice
sudo useradd -m -s /bin/bash bob
sudo useradd -m -s /bin/bash charlie
sudo passwd alice  # パスワード: pass
sudo passwd bob    # パスワード: pass
sudo passwd charlie # パスワード: pass

# ユーザー有効期限設定
sudo chage -E $(date -d "2024-12-31" +%Y-%m-%d) charlie

# グループ作成
sudo groupadd g_osaka
sudo usermod -a -G g_osaka alice
sudo usermod -a -G g_osaka bob
sudo usermod -a -G g_osaka charlie

# quota設定
sudo nano /etc/fstab
# /home パーティションに usrquota,grpquota オプションを追加
# UUID=xxx /home ext4 defaults,usrquota,grpquota 0 2

sudo mount -o remount /home
sudo quotacheck -cum /home
sudo quotaon /home
sudo setquota -u bob 100000 200000 0 0 /home  # soft: 100MB, hard: 200MB
```

### DNS設定（BIND9 - Slave）
```bash
# named.conf.local編集
sudo nano /etc/bind/named.conf.local
```

```conf
// スレーブゾーン設定
zone "osaka-skills.jp" {
    type slave;
    file "db.osaka-skills.jp";
    masters { 192.168.1.100; }; // osv1のIP
};

// 逆引きゾーン
zone "1.168.192.in-addr.arpa" {
    type slave;
    file "db.192.168.1";
    masters { 192.168.1.100; };
};

// 内部ゾーンのレコード
// A: osv1.osaka-skills.jp, osv2.osaka-skills.jp
// CNAME: in.osaka-skills.jp → osv2
// MX: osv2.osaka-skills.jp
```

```bash
# named.conf.options編集（フォワーダー設定）
sudo nano /etc/bind/named.conf.options
```

```
options{
    directory "/var/cache/bind";
    forwarders {
        192.168.1.100;  // osv1へフォワード
    };
    // 再帰問い合わせを無効化
    recursion no;
    allow-transfer { 192.168.1.100; };  // osv1のみゾーン転送許可
    dnssec-validation no;  // DNSSEC無効
    listen-on-v6 { any; };
};
```

### Apache2設定
```bash
# Aliceの個人ディレクトリ有効化
sudo a2enmod userdir
sudo a2enmod rewrite

# バックエンドサーバー設定
sudo nano /var/www/html/index.html
```

```html
<!DOCTYPE html>
<html>
<head>
    <title>Backend Server</title>
</head>
<body>
    <h1>Back-end Server</h1>
</body>
</html>
```

```bash
# バーチャルホスト設定
sudo nano /etc/apache2/sites-available/in.osaka-skills.jp.conf
```

```conf
<VirtualHost *:80>
    ServerName in.osaka-skills.jp
    DocumentRoot /var/www/html
    ErrorLog ${APACHE_LOG_DIR}/in.osaka-skills.jp-error.log
    CustomLog ${APACHE_LOG_DIR}/in.osaka-skills.jp-access.log combined
</VirtualHost>
```

```bash
# 個人ページディレクトリ作成
sudo mkdir -p /home/alice/public_html
sudo chown alice:alice /home/alice/public_html
sudo chmod 755 /home/alice/public_html

# Aliceのページ作成
sudo -u alice bash -c 'echo "<h1>Alice'\''s home page</h1>" > /home/alice/public_html/index.html'

# サイト有効化
sudo a2ensite in.osaka-skills.jp.conf
sudo systemctl restart apache2
```

### Postfix設定（メールスプール）
```bash
# main.cf編集
sudo nano /etc/postfix/main.cf
```

```conf
myhostname = osv2.osaka-skills.jp
mydomain = osaka-skills.jp
myorigin = $mydomain
inet_interfaces = all
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
home_mailbox = Maildir/
mailbox_command = 

# エイリアス設定
alias_maps = hash:/etc/aliases

# 外部宛メールをosv1へ転送
relayhost = [192.168.1.100]
```

```bash
# エイリアス設定
sudo nano /etc/aliases
```

```conf
admin: master
```

```bash
# エイリアス反映
sudo newaliases
sudo systemctl restart postfix
```

### Dovecot設定（IMAP）
```bash
# 10-auth.conf編集
sudo nano /etc/dovecot/conf.d/10-auth.conf
```

```conf
disable_plaintext_auth = no
auth_mechanisms = plain login
```

```bash
# 10-mail.conf編集
sudo nano /etc/dovecot/conf.d/10-mail.conf
```

```conf
mail_location = maildir:~/Maildir
```

```bash
sudo systemctl restart dovecot
```

### DHCP設定
```bash
# dhcpd.conf編集
sudo nano /etc/dhcp/dhcpd.conf
```

```conf
subnet 192.168.2.0 netmask 255.255.255.0 {
    range 192.168.2.101 192.168.2.110;
    option routers 192.168.2.254;  # R-Osk
    option domain-name-servers 192.168.1.101;  # osv2自身
    option domain-name "osaka-skills.jp";
    default-lease-time 600;
    max-lease-time 7200;
}
```

```bash
# インターフェース指定
sudo nano /etc/default/isc-dhcp-server
```

```conf
INTERFACESv4="eth1"
```

```bash
sudo systemctl restart isc-dhcp-server
```

### Samba設定
```bash
# Sambaユーザー設定（既存のユーザーをSambaユーザーに追加）
sudo smbpasswd -a alice  # OSと同じパスワード: pass
sudo smbpasswd -a bob    # OSと同じパスワード: pass
sudo smbpasswd -a charlie # OSと同じパスワード: pass

# 共有ディレクトリ作成
sudo mkdir -p /home/share
sudo chgrp g_osaka /home/share
sudo chmod 775 /home/share

# smb.conf編集
sudo nano /etc/samba/smb.conf
```

```conf
[global]
    workgroup = WORKGROUP
    security = user
    map to guest = bad user
    dns proxy = no
    
    # Internal2ネットワークからのみアクセス許可
    hosts allow = 192.168.2.0/24
    hosts deny = all

[share]
    path = /home/share
    browseable = yes
    writable = yes
    valid users = @g_osaka
    create mask = 0664
    directory mask = 0775
    force group = g_osaka
```

```bash
sudo systemctl restart smbd
```

### SSH設定
```bash
# sshd_config編集
sudo nano /etc/ssh/sshd_config
```

```conf
Port 10022
PasswordAuthentication no
PubkeyAuthentication yes
# Internal2ネットワークからのみアクセス許可
AllowUsers master@192.168.2.*
```

```bash
# SSH鍵設定（master用）
sudo mkdir -p /home/master/.ssh
sudo chmod 700 /home/master/.ssh
# 公開鍵を配置（クライアントからid_rsa.pubを取得）
sudo nano /home/master/.ssh/authorized_keys
# (o-clientの公開鍵を記述：C:\ssh\id_rsa.pubの内容）
sudo chmod 600 /home/master/.ssh/authorized_keys
sudo chown -R master:master /home/master/.ssh

sudo systemctl restart ssh
```

### サービス起動・有効化
```bash
# すべてのサービスが正しく設定されていることを確認
sudo systemctl enable --now bind9
sudo systemctl enable --now apache2
sudo systemctl enable --now postfix
sudo systemctl enable --now dovecot
sudo systemctl enable --now isc-dhcp-server
sudo systemctl enable --now smbd
sudo systemctl enable --now ssh

# ステータス確認
echo "DNS (bind9) status:"
sudo systemctl status bind9
echo "Web (apache2) status:"
sudo systemctl status apache2
echo "Mail (postfix) status:"
sudo systemctl status postfix
echo "IMAP (dovecot) status:"
sudo systemctl status dovecot
echo "DHCP status:"
sudo systemctl status isc-dhcp-server
echo "Samba status:"
sudo systemctl status smbd
echo "SSH status:"
sudo systemctl status ssh
```

### クライアント接続確認
#### o-client（Windows）側の設定
- DHCPでIP取得（osv2から192.168.2.101～110の範囲）
- SSH接続（Tera Term）：
  - ホスト: osv2.osaka-skills.jp:10022
  - ユーザー: master
  - 認証方法: 秘密鍵認証
  - 鍵ファイル: C:\ssh\id_rsa（パスフレーズ: Ssh2024）
- ネットワークドライブ接続：
  - 共有フォルダ: \\osv2\share
  - ユーザー: bob
  - パスワード: pass
  - ドライブレター: Z:

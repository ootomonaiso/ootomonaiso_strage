---
sidebar_position: 3
description: ユーザーのディレクトリをサイトのデフォルトにするぞ
---

# ユーザーディレクトリの設定

Apache2でユーザーのホームディレクトリを公開する設定について説明します。

## userdirモジュールの有効化

まず、`userdir`モジュールを有効化します。

```bash
sudo a2enmod userdir
sudo systemctl reload apache2
```

## 基本的なユーザーディレクトリ設定

### デフォルト設定の確認

```bash
# userdir設定ファイルの確認
sudo cat /etc/apache2/mods-available/userdir.conf
```

デフォルトでは、各ユーザーの`public_html`ディレクトリが公開されます：
- URL: `http://example.com/~username/`
- ディレクトリ: `/home/username/public_html/`

### ユーザーディレクトリの作成

```bash
# ユーザーのホームディレクトリにpublic_htmlを作成
mkdir ~/public_html

# 適切な権限を設定
chmod 755 ~/public_html
chmod 755 ~

# テストページを作成
echo "<h1>Hello from $(whoami)!</h1>" > ~/public_html/index.html
```

## カスタム設定

### 特定のディレクトリ名を使用

`/etc/apache2/mods-available/userdir.conf`を編集：

```apache
<IfModule mod_userdir.c>
    UserDir public_html
    <Directory "/home/*/public_html">
        Requiren ip 192.168.1.0/24
        Require host in.osaka-skils.jp
    </Directory>
</Directory>
```

### 特定ユーザーのみ有効化

```apache
<IfModule mod_userdir.c>
    UserDir disabled
    UserDir enabled user1 user2 user3
    
    <Directory "/home/*/public_html">
        AllowOverride All
        Options Indexes FollowSymLinks
        Require all granted
    </Directory>
</IfModule>
```

## サイトのデフォルトをユーザーディレクトリに変更

`/etc/apache2/sites-available/000-default.conf`を編集：

```apache
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /home/username/public_html
    
    <Directory "/home/username/public_html">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

### 必要な権限設定

```bash
# ユーザーのホームディレクトリ権限
chmod 755 /home/username

# public_html権限
chmod 755 /home/username/public_html

# ファイル権限
chmod 644 /home/username/public_html/*

# 実行可能ファイル権限
chmod 755 /home/username/public_html/cgi-bin/*
```

## 設定の反映

```bash
# 設定ファイルの構文チェック
sudo apache2ctl configtest

# Apache2の再起動
sudo systemctl restart apache2

# ログの確認
sudo tail -f /var/log/apache2/error.log
```

## トラブルシューティング

### よくある問題

:::warning 権限エラー
- ホームディレクトリが`755`権限になっているか確認
- `public_html`ディレクトリが存在し、適切な権限があるか確認
:::

:::tip アクセス確認
ブラウザで`http://your-server/~username/`にアクセスしてテスト
:::

:::info ログ確認
```bash
# アクセスログ
sudo tail -f /var/log/apache2/access.log

# エラーログ
sudo tail -f /var/log/apache2/error.log
```

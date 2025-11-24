---
sidebar_position: 3
description: https接続様ありがとう
---

# httpsで認証を通した状態で通信したい

まずhttpsのポートは443なので`<VirtualHost *:443>`で設定します。
```xml title="000-default.conf"
<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile "公開鍵のパス"
    SSLCertificateKeyFile "秘密鍵のパス"
    ServerName 指定しされてるドメイン
    ServerAdmin デフォルトでok
    DocumentRoot　.htmlのありかを指定
</VirtualHost>
```


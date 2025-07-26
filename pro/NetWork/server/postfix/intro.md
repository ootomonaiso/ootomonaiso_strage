---
sidebar_position: 2
description: 
---

# メールサーバーの設定
## インストール
```bash
sudo apt install postfix
sudo apt install mailutils
```

## 共通設定
設定ファイルは`/etc/postfix`配下の`main.cf`

### 認証なしで運用する
SASL認証を使わずに匿名で受けるってことだと思います

:::info SASLって何?
SASLは`Simple Authentication and Security Layer`で、認証をするための下地みたいなものです。SASLが扱える認証方式は複数あります。
:::

```config


```
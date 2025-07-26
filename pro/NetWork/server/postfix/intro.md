---
sidebar_position: 2
description: postfixさんの愛に触れる
---

# メールサーバーの設定
## インストール
```bash
sudo apt install postfix
sudo apt install mailutils
```

## 共通設定
設定ファイルは`/etc/postfix`配下の`main.cf`
- ユーザー認証はしません
- osaka-skills.jpドメインのSMTPです(POP3じゃないよごめんね)

### osv1
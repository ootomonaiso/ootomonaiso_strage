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

## 設定
設定ファイルは`/etc/postfix`配下の`main.cf`
- ユーザー認証はしません
- osaka-skills.jpドメインのSMTPです(POP3じゃないよごめんね)
### osv1
```bash title=""
# 上のほうのsmtp-tlsほにゃららはそのまま

smtpd_rekat_restrictions =　そのまま
myhostname = osv2.osaka-skills.jp
alias_maps = そのまま
alias_database = そのまま
# myorigin　いらんのでコメントアウト
relayhost = [どこどこへ転送されるのどこどこをここへ]
# 環境に合わせて変えてね
mynetworks = 192.168.1.0/24 
transport_map = hash:/etc/postfix/transport
```
#### transport_mapのつくりかた


### osv2
```bash title=""
# 上のほうのsmtp-tlsほにゃららはそのまま

smtpd_rekat_restrictions =　そのまま
myhostname = osv2.osaka-skills.jp
alias_maps = そのまま
alias_database = そのまま
# myorigin　いらんのでコメントアウト
relayhost = 
# 環境に合わせて変えてね
mynetworks = 192.168.1.0/24  

inetたちは初期のまま?
home_mailbox = Maildir/
```

#### エイリアスの設定
```bash title=""
sudo nano /etc/aliases
```

```bash title=""
ユーザー名: 実際の配送先
```
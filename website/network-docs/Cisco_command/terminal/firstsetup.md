---
sidebar_position: 3
description: 毎回やっとけ初期設定
---

# 大抵要求されてるターミナル初期設定
- いずれのコマンドもグローバルコンフィグレーションモードでやること

```bash
Router> enable
Router# configure terminal
Router(config)#
```
## ルーターのお名前変える
```bash
hostname (おこのみのおなまえ)
```

## タイムゾーンをJSTに
- 日本のタイムゾーンに大抵合わせる
```bash
clock timezone JST +9
```


## アカウント名及びパスワードの変更
- パスワードは暗号化して保存されていること

```bash
enable secret cisco
```

## 常に特権モードでアクセス(たすかる)
```bash
line console 0
privilege level 15
```


## コマンド誤入力によるDNS検索をしない
```bash
no ip domain-lookup
```
## 自動ログアウトがうざいから止める
```bash
line console 0
exec-timeout 0 0
```
## 内容表示に--More--が出るのはめんどい
```bash
line console 0
length 0
```

## 書いたコンフィグの保存(いるかどうか忘れた)
```bash
copy running-config startup-config
```
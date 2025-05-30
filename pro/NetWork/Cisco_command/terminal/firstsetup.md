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


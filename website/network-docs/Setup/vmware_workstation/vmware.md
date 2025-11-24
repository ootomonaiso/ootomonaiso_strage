---
sidebar_position: 1
description: VMwareのセットアップ
---

# VMware Workstation Proをセットアップする

## VMware Workstation Proのインストーラーのダウンロード

### 1. VMwareのページに
[VMWare Workstation](https://support.broadcom.com/group/ecx/productdownloads?subfamily=VMware+Workstation+Pro)にアクセスする。

### 2. BROADCOMアカウントを渋々作る
BROADCOMのアカウント持ってない人は[ここからBROADCOMアカウントを作成](https://profile.broadcom.com/web/registration)してからログイン。アカウント作成画面は別タブで開くと楽

### 3. インストーラーを探す
![VMWare MyDounloads](./img/1-0.png)

右のサイドメニューから**My Downloads**を選択し、検索ボックス下にある**Free Software Downloads available HERE**をクリック
下の方にある**VMWare Workstation Pro**を選択

### 4. お好みのOSを選ぶ
![VMWare製品ページ](./img/1-1.png)

Windowsで使うならばWindows。Linuxで使うならLinuxのインストーラーを選択。今回はWindows使います

![VMware製品ページ](./img/1-2.png)

バージョンは大会環境、または最新の環境を使ってください。多分ここにあるのは安定リリースだと思います。今回は思考停止した状態で一番上のやつ選びました

### 5.ダウンロード
![VMware製品ページ](./img/1-3.png)
**I agree to theTerms and Conditions**にチェックを入れた後で、雲に下向き矢印がついてるのを押します

![VMware製品ページ](./img/1-4.png)
「のファイルをダウンロードする前に、追加の検証が必要です。続行しますか?」と書かれてるので「Yes」を選択

### 6.住所情報入れるターン
![VMware住所いれるとこ](./img/1-5.png)

既に入力している場合は出てこない(と思われる)ページです。入力が完了して提出すると元のページにリダイレクトするのでもう一度ダウンロードボタン押してください

- 名前(FirstName、LastName)、Email、郵便番号(Zip/PostalCode)含む住所は一部自動入力されます
- 赤いアスタリスクがついているところは必須入力欄なので埋めといてください

## VMWare Workstation Proのインストール

### インストール手順

- インストーラーを起動します
- 管理者権限要求されます

### インストーラー操作

![インストーラー](./img/1-6.png)

- 次へを選択

### 使用許諾契約書

![インストーラー](./img/1-7.png)

- 目を通した後使用許諾契約書に同意にチェック

### 互換性セットアップ

![インストーラー](./img/1-8.png)

- Windows Hyparvisor Platform(WHP)の自動インストールにチェックを入れて

### カスタムセットアップ

![インストーラー](./img/1-9.png)

- インストール先に変更があれば変更
- 特になければ次へ

### ユーザーエクスペリエンスの設定

![インストーラー](./img/1-10.png)

- 特になければ次へ
- 更新確認にはチェック打ったままがおすすめ
- エクスペリエンス向上プログラムは適当に

### ショートカット

![インストーラー](./img/1-11.png)

- 特になければ次へ
- スタートメニューのプログラムフォルダは取っとくと良き

### VMware Workstation Proのインストール準備完了

![インストーラー](./img/1-12.png)

- なんかやらかしたら今のうちに戻る
- 大丈夫そうならインストールへ

### 完了
![インストーラー](./img/1-13.png)

- しばらくプログレスバーが動きまくったりしますが特に何かやらかしてなければ終わります
- インストールが終わったら完了してください
- このインストーラーは既にVMware Wprlstation Proが入っていると既存ソフトの修復や、Hypar-V周りの再設定に使えるので取っておくといいかもしれないです
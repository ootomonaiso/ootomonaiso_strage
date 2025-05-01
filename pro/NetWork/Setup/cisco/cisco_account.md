---
sidebar_position: 2
description: ciscoのCMLを取得する
---
# ciscoのCMLをインストールする方法

## ciscoのアカウントを作ろう
[Cisco Modeling Labs](https://mkto.cisco.com/cml-free.html) 

ここに無料版のCMLの登録ページがあります。
**cisco CCO ID** を取得していないと利用できないのでその場合は、 [ciscoのアカウント作成ページ](https://id.cisco.com/signin/register)へアクセスしてアカウント作ってください。ほとんど日本語です。たすかる。

## ファイルをダウンロード
アカウントができると登録したメールアドレスにメールが届きます。ダウンロード手順について書かれているセクションにファイルのダウンロードリンクが添付されています。会社情報は学校の内容で埋めました。[メール見るのめんどくさい方はこちらから](https://software.cisco.com/download/home/286193282/type/286326381/release/CML-Free?mkt_tok=NTY0LVdIVi0zMjMAAAGaKZwwosvxyRt0ifDU443RG8q_dY9yET75OqLaReeR_02pia7AtJjNb4bzkGngf13IilaTY3_e46tEjbqIshbXeIyvpmybEqozvIwDETFU4BsLZ1hR) 

### CMLをダウンロード
ChatGPT曰く、isoは物理マシン用でESXiに直接使えないらしい。pkgは既存のアップグレード用の差分用。
**拡張子が.ovaのファイル** と **refolatなんちゃらかんちゃら.iso.zip**をダウンロードしておく。

:::info
cml2_f_2.8.1-14_amd64-35.ovaのファイル情報を見たところVMwareへの導入用らしいです。
isoはベアメタルつまりOSとかなんもない状態で使えよなってことだそう
:::

## 
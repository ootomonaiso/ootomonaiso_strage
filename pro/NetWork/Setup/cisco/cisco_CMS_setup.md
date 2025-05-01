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

## 仮想マシンを作る
### 仮想マシンタブを開く
![CMSインスコする](.\img\1-0.png)

ここの **仮想マシンの作成/登録** 選択してください

### 作成手順
#### 作成タイプの選択
![CMSインスコする](.\img\1-1.png)

**OVFファイルまたはOVAファイルから仮想マシンをデプロイ** を選択。

#### OVFファイルとVMDKファイルの選択
![CMSインスコする](.\img\1-2.png)

仮想マシンの名前を設定した後、先ほどダウンロードしてきた.ovaファイルを選択してください。

#### デプロイのオプション
![CMSインスコする](.\img\1-3.png)

ディスク プロビジョニングは **シン** に、自動的にパワーオンにはチェックを入れて、ネットワークマッピングは **VM Network** を指定

:::info
シンは動的にディスク容量を増やす設定、シックの場合は事前に仮想マシン作成時にディスク容量を確保する。
:::
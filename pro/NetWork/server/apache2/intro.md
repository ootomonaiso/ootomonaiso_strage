---
sidebar_position: 2
description: apache2でサイトを公開したいしたい
---

# apache2をインストールする
apache2です2を忘れないでね(1敗)
```bash 
sudo apt install apache2
```
## 設定ファイルとお手本ファイルのありか
### 設定ファイル
設定ファイルは`/etc/apache2`の配下にあります
ここで`ls`コマンドをたたくと`sites-avalable`というディレクトリがあるはずです。
この配下にある`000-default.conf`をいじっていきます。

## moduleの有効化
apache2には`a2enmod`というコマンドがあり、これは`/etc/apache2/`配下にある`mods-avalable`ディレクトリと`mods-enable`ディレクトリの間で特定のモジュールを登録したり外したりするコマンドです

今回扱うのはhttpsでのリクエストで使う`ssl`と、ユーザーによってページを扱うときの`Userdir`です。
有効化された特定の機能の`.load`を呼び出した後、デフォルト設定として`mods-enable`ディレクトリの中にある`.conf`をデフォルト設定として呼び出し、最後にユーザー設定である`sites-enable`ディレクトリを読みに行きます。

### 備考: apacheにおけるavailableとenableの仕様
availableとついたフォルダにはファイルの実体がおいてあり、モジュール系なら`a2enmod`と`a2dismod`で、サイトなら`a2ensite`と`a2dissite`で操作します。同じように設定ファイルならば `a2enconf`と`a2disconf`で有効と無効をいじれるって仕組みです。

enableされたモジュールないしサイトないし設定は`〇〇-enabled`のディレクトリにシンボリックリンクが置かれます。これにより`〇〇-available`ディレクトリに設定を書いて有効化するだけでサクッと設定できるって仕組みになってますキャー素敵
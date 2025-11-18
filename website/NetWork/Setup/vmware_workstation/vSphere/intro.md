---
sidebar_position: 1
description: VMware Workstation ProにESXiの環境整備やる
---

#　VMware WorkstationにESXiを入れておうちでもネットワークできるマンになりたい

## よういするもの
- VMware Workstation Proが入っているPC
- おおらかな心

## ISOを取りに行く
ここからISOを取りにいきます[(https://support.broadcom.com/group/ecx/productfiles?subFamily=VMware%20vSphere%20Hypervisor&displayGroup=VMware%20vSphere%20Hypervisor&release=8.0U3e&os=&servicePk=&language=EN&freeDownloads=true)](https://support.broadcom.com/group/ecx/productfiles?subFamily=VMware%20vSphere%20Hypervisor&displayGroup=VMware%20vSphere%20Hypervisor&release=8.0U3e&os=&servicePk=&language=EN&freeDownloads=true)

![alt text](./img/1-1.png)

:::tip
`利用規約に同意`にチェックを入れた後、ダウンロードボタンが押せるようになります
:::

## 実際に入れてみる
![img](./img/1-2.png)

- `インストーラディスクイメージファイル`に切り替え
- ダウンロードしてきたISOを通せば`VMware ESXi 8`が検出されるはず

### 仮想マシン名と場所
![img](./img/1-3.png)

- 仮想マシン名はお好みで変更可能
- 保存場所はOneDrive配下になっているとOneDriveの仕様で大惨事になることが予想できるのでCドライブの直下にフォルダ作って保存しておくとよろし

### ディスク容量



---
sidebar_position: 5
description: 19回大会前に書いてたコード解説：interface関連
---
# インターフェース層解説
コントローラーで使うためのインターフェースをあなたに。メゾットを参照してクラスを召喚するやつ。

## Interfaces/IAdminDataAccess.cs

```csharp
using System.Collections.Generic;
using shift_making_man.Models;

namespace shift_making_man.Data
{
    public interface IAdminDataAccess
    {
        List<Admin> GetAdmins();
        Admin GetAdminByUsername(string username);
        //void AddAdmin(Admin admin);
        //void UpdateAdmin(Admin admin);
        //void DeleteAdmin(int adminId);
    }
}
```
コメントアウトしてる奴はいるかと思って置いておいたクラスがいらないことが判明したので息の根を止めてあるだけです。

### メゾット説明
```csharp
List<Admin> GetAdmins();
```
このメゾットは`Admin型`つまりAdminモデルを参照してリストを返すメゾットです。
`GetAdminByUsername`で見つかったユーザーネームとハッシュ化したパスワードを参照するためだけに存在する

```csharp
Admin GetAdminByUsername(string username);
```
もちろんこれは`Admin型`つまりAdminモデルを参照してユーザーネームを検索するコードになります。
これでユーザーネームを検索してユーザーが存在しているかどうかを判定します。

## Interfaces/IAttendanceDataAccess.cs
```csharp
using System.Collections.Generic;
using shift_making_man.Models;

namespace shift_making_man.Data
{
    public interface IAttendanceDataAccess
    {
        List<Attendance> GetAttendances();
        //Attendance GetAttendanceById(int attendanceId);
        //void AddAttendance(Attendance attendance);
        //void UpdateAttendance(Attendance attendance);
        //void DeleteAttendance(int attendanceId);
    }
}
```
コメントアウトしてるのは相変わらずやっぱいらないよねこのメゾット症候群に罹患してるやつなのでみなかったことにしてください
### メゾット説明
```csharp
List<Attendance> GetAttendances();
```
見ての通りアクション履歴の取得用のやつ。ダッシュボードの実装のデータ失くしたので心が折れてる。ここから現在労働中かどうかの判定をしたり何時間働いたのかの判定をしたりしてる。要は勤怠管理関連のテーブルってこと。

## Interfaces/IShiftDataAccess.cs
```csharp
using shift_making_man.Models;
using System.Collections.Generic;

public interface IShiftDataAccess
{
    List<Shift> GetShifts();
    Shift GetShiftById(int shiftId);
    void DeleteShift(int shiftId);
    //List<Shift> GetShiftsForStaff(int staffId);
    //List<Shift> GetShiftsForStore(int storeId);
    void SaveShift(Shift shift);
    //string ConnectionString { get; }
    void SaveShiftList(List<Shift> shifts);
    //List<ShiftRequest> GetShiftRequestsByStoreId(int storeId);
    //void UpdateShiftRequest(ShiftRequest request);
}
```
度重なる仕様変更の荒らしに揉まれて大量の要らないメゾットができた弊害でコメントアウトしたメゾットがとんでもないことになっているインターフェース。
```Csharp
void SaveShift(Shift shift);
void SaveShiftList(List<Shift> shifts);
```
その最たるはこの二つで、こいつらはシフトの新規作成と更新で戻り値が違う弊害が出てそれを解決するためにどう考えても同じような名前なのに作る羽目になった悲しきモンスターである。設計のガバ。

## Interfaces/IShiftRequestDataAccess.cs
```csharp
using System.Collections.Generic;
using shift_making_man.Models;

namespace shift_making_man.Data
{
    public interface IShiftRequestDataAccess
    {
        List<ShiftRequest> GetShiftRequests();
        //ShiftRequest GetShiftRequestById(int requestId);
        //void AddShiftRequest(ShiftRequest shiftRequest);
        void UpdateShiftRequest(ShiftRequest shiftRequest);
        //void DeleteShiftRequest(int requestId);
        //int GetPendingShiftRequestCount();
        //int GetCountByOriginalShiftID(int? originalShiftID);
        //int GetCountByOriginalShiftIDNotNull();
        //(int NewRequestCount, int ChangeRequestCount) GetPendingShiftRequestCounts();
        List<ShiftRequest> GetShiftRequestsByStoreId(int storeId);
        List<ShiftRequest> GetPendingRequests();
    }
}
```
こちらは逆に詳しく実装しまくった果てに、「あれ?これコントローラーでこねくり回しても問題なくね?」という悲しい事実に気付き大幅なダイエットを果たしたインターフェース。メゾット名見れば分かるはずとしか言いようがないというか、インターフェースよりもクラスの方で解説入れるのであしからず。
### メゾット解説
```csharp
List<ShiftRequest> GetShiftRequests();
```
リクエスト数をリストの数で判定するとて使ってるメゾット。
なお、ダッシュボードの実装が中途半端に終わってるので日の目を見ているか怪しいメゾットでもある。

```csharp
void UpdateShiftRequest(ShiftRequest shiftRequest);
```
削除してもよかったのに「ログ書き出ししたくなるかもしれないじゃん」症候群に罹患したのでStatus(0=保留、1=承認済み、2=破棄)を割り当てるために変更があったらアップデートするためのメゾット

```csharp
List<ShiftRequest> GetShiftRequestsByStoreId(int storeId);
```
StoreIDを元にリストを検索するやつ。最初これを条件式にフォームから取得してたけどめんどくさくなっちゃったからメゾットにした。

```csharp
 List<ShiftRequest> GetPendingRequests();
```
保留にしてる(Status=0)の値を取得してリストにして渡すメゾットこれでよかったんだよこれで…誰だよ複雑な内容書きしたためたあんぽんたんは

## Interfaces/IStaffDataAccess.cs
```csharp
using shift_making_man.Models;
using System.Collections.Generic;
using System;

namespace shift_making_man.Data
{
    public interface IStaffDataAccess
    {
        List<Staff> GetStaff();
        Staff GetStaffById(int staffId);
        //void AddStaff(Staff staff);
        //void UpdateStaff(Staff staff);
        //void DeleteStaff(int staffId);

        //bool IsFullTimeAvailable(DateTime shiftDate, TimeSpan startTime, TimeSpan endTime);
        List<Staff> GetStaffByStoreId(int storeId);
        List<Staff> GetStaffByEmploymentType(string employmentType); 
    }
}
```

### メゾット説明
```csharp
List<Staff> GetStaff();
```
見ての通りスタッフリストを連れてくるやつ。従業員一覧とかの実装で使うから作成してある。

```csharp
Staff GetStaffById(int staffId);
```
シフトリクエストテーブル関連。StaffIDでスタッフを取得するためのメゾット。

```csharp
List<Staff> GetStaffByStoreId(int storeId);
List<Staff> GetStaffByEmploymentType(string employmentType); 
```
`GetStaffByStoreId`はユーザーの指定したStoreIDをもとにShiftRequestテーブルを検索して、そこに紐づくStaffを連れてくるメゾット。そして、`GetStaffByEmploymentType`は、シフト作成時に就業形態について取得するためのメゾットである。

## Interfaces/IStoreDataAccess.cs
```csharp
using shift_making_man.Models;
using System.Collections.Generic;

namespace shift_making_man.Data
{
    public interface IStoreDataAccess
    {
        List<Store> GetStores();
        Store GetStoreById(int storeId);
        //TimeSpan GetStoreOpenTime(int storeId);
        //TimeSpan GetStoreCloseTime(int storeId);
        //void AddStore(Store store);
        //void UpdateStore(Store store);
        //void DeleteStore(int storeId);
    }
}
```
### メゾット説明
```csharp
List<Store> GetStores();
```
Storeテーブルを検索してすべて出すコード。店舗設定確認用。
```csharp
Store GetStoreById(int storeId);
```
ユーザの指定したStoreIDから店舗を特定してその店舗の設定を出力するメゾット。シフト作成時の制約として。
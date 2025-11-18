---
sidebar_position: 4
description: 19回大会前に書いてたコード解説：Model関連
---
# Model関連
SQLのアクセス関連のコード叩くときに楽かなって思って実装したやつ。正直多少楽になったかな???くらい

## Models/Admin.cs
Adminテーブルと対応するモデル
```csharp
namespace shift_making_man.Models
{
    public class Admin
    {
        public int AdminID { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }
}
```
文字型のところをカラムと対応させて変えてね。(n敗)

## Models/Attendance.cs
Attendanceテーブルと対応するモデル
```csharp
using System;

namespace shift_making_man.Models
{
    public class Attendance
    {
        public int AttendanceID { get; set; }
        public int? StaffID { get; set; } 
        public int? ShiftID { get; set; }
        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
    }
}

```
こっちはDateTime型を使うためにSystemのusing宣言が必要です。(n敗)
string型とint型なら何もなくても動作するのでそのノリで書いたら怒られた。

## Models/Shift.cs
Shiftテーブルと対応するモデル
```csharp
using System;

namespace shift_making_man.Models
{
    public class Shift
    {
        public int ShiftID { get; set; }
        public int? StaffID { get; set; }
        public DateTime ShiftDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int Status { get; set; }
        public int? StoreID { get; set; }

        public Staff Staff { get; set; }
    }
}
```
## Models/ShiftRequest.cs
ShiftRequestテーブルと対応するモデル
```csharp
using System;

namespace shift_making_man.Models
{
    public class ShiftRequest
    {
        public int RequestID { get; set; }
        public int StoreID { get; set; }
        public int? StaffID { get; set; }
        public int? OriginalShiftID { get; set; }
        public DateTime RequestDate { get; set; }
        public int Status { get; set; } 
        public DateTime? RequestedShiftDate { get; set; }
        public TimeSpan? RequestedStartTime { get; set; }
        public TimeSpan? RequestedEndTime { get; set; }
    }
}

```

データ型の後についてる「?」はNullである場合を示すやつ。OriginalShiftIDはNullを許容するのは、OriginalShiftIDがNullの場合は新規作成、何らかの値がある場合はShiftテーブルを参照してシフトの変更を行うことができると理解できるが、StaffIDがNullである必要性とは????となってると思う。これはその日だけ働く人とかいうイレギュラーがあるかもしれないってChatGPTに唆されたからああいうプロパティになってる。おかげでnull許容してるから直接intにできねえんだけど!って何度もVisualStudioに怒られてる。ごめんね

:::info
`DateTime型`は、日付と時間の表現をするために使うやつ。メゾットがいくつかあって現在時刻の取得や特定期間の検索、年、月、日、時間、秒などの単位でもデータを持ってこれるので時間を扱うときは脳死で使う
`TimeSpan型`は単体の時間だけではなく、期間も判定できるやつ。何時から何時の表現がポンポン出てくるもんだから使ってる
:::

## Models/Staff.cs
Staffテーブルと関連するモデル
```csharp
namespace shift_making_man.Models
{
    public class Staff
    {
        public int StaffID { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string EmploymentType { get; set; }  
    }
}
```

Staff層に関してはほとんどデータの追加やら変更やらの実装はしていないので、就業形態(EmploymentType)と従業員の本名の取得のためにFullNameを参照してるだけなのでAdminとほぼ同じ実装に落ち着いた。もっと凝るならEmploymentTypeを、アルバイトか正社員かパートかに分けて、positionとしてキッチンとかフロア担当の値を割り当てたりはできるかなとか思ったり。大会の提出物にはEmploymentTypeにハイフンで分けて2つの値を判定するって書いた。大会本番に下手にテーブル増やして焦るよりかは仕様書に仕様書くほうにシフトした感じ

## Models/Store.cs
Storeテーブルと関連するモデル
```csharp
using System;

namespace shift_making_man.Models
{
    public class Store
    {
        public int StoreID { get; set; }
        public TimeSpan OpenTime { get; set; }
        public TimeSpan CloseTime { get; set; }
        public TimeSpan BusyTimeStart { get; set; }
        public TimeSpan BusyTimeEnd { get; set; }
        public int NormalStaffCount { get; set; }
        public int BusyStaffCount { get; set; }
    }
}
```
Storeテーブルは大会側が提示してない大友内装(粒)オリジナルのテーブル。まあでもStoreとか魔改造済みなんですけども。TimeSpan型は時間の開始時間と終了時間を割り当てるときに便利な型。

---
sidebar_position: 6
description: 19回大会前に書いてたコード解説：Implementations
---

# クラス実装層解説
インターフェース層で定義されているメゾットに紐づくクラスが定義されている。

## Implementations/AdminDataAccess.cs
```csharp
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using shift_making_man.Models;

namespace shift_making_man.Data
{
    public class AdminDataAccess : IAdminDataAccess // AdminDataAccessクラスの定義
    {
        // 接続文定義
        private readonly string connectionString = "server=localhost;database=19demo;user=root;password=;";

        // すべての管理者を取得するメゾット
        public List<Admin> GetAdmins()
        {
            // リストの初期化
            List<Admin> admins = new List<Admin>();
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                // 接続を開く
                conn.Open();
                // クエリ定義
                string sql = "SELECT * FROM admins";
                // コマンドの作成
                MySqlCommand cmd = new MySqlCommand(sql, conn);

                // データリーダーでクエリの結果読み取り
                using (MySqlDataReader rdr = cmd.ExecuteReader())
                {
                    // 結果を1行ずつ読み取って管理者オブジェクトに追加
                    while (rdr.Read())
                    {
                        admins.Add(new Admin
                        {
                            AdminID = rdr.GetInt32("AdminID"),
                            Username = rdr.GetString("Username"),
                            PasswordHash = rdr.GetString("PasswordHash"),
                            FullName = rdr.GetString("FullName"),
                            Email = rdr.GetString("Email")
                        });
                    }
                }
            }
            // 管理者のリストを返す
            return admins;
        }

        // ユーザ名から管理者を取得
        public Admin GetAdminByUsername(string username)
        {
            // 管理者オブジェクトの初期化
            Admin admin = null;
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                // クエリの定義
                string query = "SELECT * FROM admins WHERE Username = @Username";
                // 
                using (MySqlCommand cmd = new MySqlCommand(query, connection))
                {
                    // パラメータに値を代入
                    cmd.Parameters.AddWithValue("@Username", username);
                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        // 結果が存在するなら管理者オブジェクトの作成
                        if (reader.Read())
                        {
                            admin = new Admin
                            {
                                AdminID = reader.GetInt32("AdminID"),
                                Username = reader.GetString("Username"),
                                PasswordHash = reader.GetString("PasswordHash"),
                                FullName = reader.GetString("FullName"),
                                Email = reader.GetString("Email")
                            };
                        }
                    }
                }
            }
            // 管理者オブジェクトを返す
            return admin;
        }
    }
}
```

## Implementations/AttendanceDataAccess.cs
```csharp
using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using shift_making_man.Models;

namespace shift_making_man.Data
{
    // Attendanceデータアクセス
    public class AttendanceDataAccess : IAttendanceDataAccess
    {
        // 接続文定義
        private readonly string connectionString = "server=localhost;database=19demo;user=root;password=;";

        // 出勤情報の取得メゾット
        public List<Attendance> GetAttendances()
        {
            // リストの初期化
            List<Attendance> attendances = new List<Attendance>();
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                // クエリ定義
                string sql = "SELECT * FROM attendance";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                using (MySqlDataReader rdr = cmd.ExecuteReader())
                {
                    // 結果を1行ずつ出力
                    while (rdr.Read())
                    {
                        attendances.Add(new Attendance
                        {
                            AttendanceID = rdr.GetInt32("AttendanceID"),
                            StaffID = rdr.IsDBNull(rdr.GetOrdinal("StaffID")) ? (int?)null : rdr.GetInt32("StaffID"),
                            ShiftID = rdr.IsDBNull(rdr.GetOrdinal("ShiftID")) ? (int?)null : rdr.GetInt32("ShiftID"),
                            CheckInTime = rdr.GetDateTime("CheckInTime"),
                            CheckOutTime = rdr.IsDBNull(rdr.GetOrdinal("CheckOutTime")) ? (DateTime?)null : rdr.GetDateTime("CheckOutTime")
                        });
                    }
                }
            }
            // リストを返す
            return attendances;
        }
    }
}
```

## Implementations/ShiftDataAccess.cs
```csharp
using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using shift_making_man.Models;

namespace shift_making_man.Data
{
    public class ShiftDataAccess : IShiftDataAccess // ShiftDataAccessクラスの定義
    {
        // 接続文定義
        private readonly string connectionString = "server=localhost;database=19demo;user=root;password=;";

        // シフトの
        public List<Shift> GetShifts()
        {
            List<Shift> shifts = new List<Shift>();
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string sql = "SELECT * FROM shifts";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                using (MySqlDataReader rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        shifts.Add(new Shift
                        {
                            ShiftID = rdr.GetInt32("ShiftID"),
                            StaffID = rdr.IsDBNull(rdr.GetOrdinal("StaffID")) ? (int?)null : rdr.GetInt32("StaffID"),
                            ShiftDate = rdr.GetDateTime("ShiftDate"),
                            StartTime = rdr.GetTimeSpan(rdr.GetOrdinal("StartTime")),
                            EndTime = rdr.GetTimeSpan(rdr.GetOrdinal("EndTime")),
                            Status = rdr.GetInt32("Status"),
                            StoreID = rdr.IsDBNull(rdr.GetOrdinal("StoreID")) ? (int?)null : rdr.GetInt32("StoreID")
                        });
                    }
                }
            }
            return shifts;
        }

        // shiftIDからシフトを取得するメゾット
        public Shift GetShiftById(int shiftId)
        {
            Shift shift = null;
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string sql = "SELECT * FROM shifts WHERE ShiftID = @ShiftID";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@ShiftID", shiftId);
                using (MySqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        shift = new Shift
                        {
                            ShiftID = rdr.GetInt32("ShiftID"),
                            StaffID = rdr.IsDBNull(rdr.GetOrdinal("StaffID")) ? (int?)null : rdr.GetInt32("StaffID"),
                            ShiftDate = rdr.GetDateTime("ShiftDate"),
                            StartTime = rdr.GetTimeSpan(rdr.GetOrdinal("StartTime")),
                            EndTime = rdr.GetTimeSpan(rdr.GetOrdinal("EndTime")),
                            Status = rdr.GetInt32("Status"),
                            StoreID = rdr.IsDBNull(rdr.GetOrdinal("StoreID")) ? (int?)null : rdr.GetInt32("StoreID")
                        };
                    }
                }
            }
            return shift;
        }

        // シフト保存用
        public void SaveShift(Shift shift)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string sql;
                if (shift.ShiftID > 0) // シフトIDが存在する場合は更新
                {
                    sql = "UPDATE shifts SET StaffID = @StaffID, ShiftDate = @ShiftDate, StartTime = @StartTime, EndTime = @EndTime, Status = @Status, StoreID = @StoreID WHERE ShiftID = @ShiftID";
                }
                else // シフトIDが存在しない場合は挿入
                {
                    sql = "INSERT INTO shifts (StaffID, ShiftDate, StartTime, EndTime, Status, StoreID) VALUES (@StaffID, @ShiftDate, @StartTime, @EndTime, @Status, @StoreID)";
                }
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@ShiftID", shift.ShiftID);
                cmd.Parameters.AddWithValue("@StaffID", shift.StaffID.HasValue ? (object)shift.StaffID.Value : DBNull.Value);
                cmd.Parameters.AddWithValue("@ShiftDate", shift.ShiftDate);
                cmd.Parameters.AddWithValue("@StartTime", shift.StartTime);
                cmd.Parameters.AddWithValue("@EndTime", shift.EndTime);
                cmd.Parameters.AddWithValue("@Status", shift.Status);
                cmd.Parameters.AddWithValue("@StoreID", shift.StoreID.HasValue ? (object)shift.StoreID.Value : DBNull.Value);
                cmd.ExecuteNonQuery();
            }
        }

        // シフトリスト保存用 SaveShiftのほうを使ってる
        public void SaveShiftList(List<Shift> shifts)
        {
            foreach (var shift in shifts)
            {
                SaveShift(shift);
            }
        }

        // シフトIDから検索して保存
        public void DeleteShift(int shiftId)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string sql = "DELETE FROM shifts WHERE ShiftID = @ShiftID";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@ShiftID", shiftId);
                cmd.ExecuteNonQuery();
            }
        }
    }
}
```
## Implementations/ShiftRequestDataAccess.cs
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using MySql.Data.MySqlClient;
using shift_making_man.Models;

namespace shift_making_man.Data
{
    public class ShiftRequestDataAccess : IShiftRequestDataAccess // シフトリクエストデータアクセス
    {
        // 接続文
        private readonly string connectionString = "server=localhost;database=19demo;user=root;password=;";

        // シフトリクエストの取得
        public List<ShiftRequest> GetShiftRequests()
        {
            return ExecuteQuery("SELECT * FROM shiftrequests");
        }

        public void UpdateShiftRequest(ShiftRequest shiftRequest)
        {
            ExecuteNonQuery(
                "UPDATE shiftrequests SET StoreID = @StoreID, StaffID = @StaffID, OriginalShiftID = @OriginalShiftID, RequestDate = @RequestDate, RequestedShiftDate = @RequestedShiftDate, RequestedStartTime = @RequestedStartTime, RequestedEndTime = @RequestedEndTime, Status = @Status WHERE RequestID = @RequestID",
                new MySqlParameter("@RequestID", shiftRequest.RequestID),
                new MySqlParameter("@StoreID", shiftRequest.StoreID),
                new MySqlParameter("@StaffID", shiftRequest.StaffID.HasValue ? (object)shiftRequest.StaffID.Value : DBNull.Value),
                new MySqlParameter("@OriginalShiftID", shiftRequest.OriginalShiftID.HasValue ? (object)shiftRequest.OriginalShiftID.Value : DBNull.Value),
                new MySqlParameter("@RequestDate", shiftRequest.RequestDate),
                new MySqlParameter("@RequestedShiftDate", shiftRequest.RequestedShiftDate.HasValue ? (object)shiftRequest.RequestedShiftDate.Value : DBNull.Value),
                new MySqlParameter("@RequestedStartTime", shiftRequest.RequestedStartTime.HasValue ? (object)shiftRequest.RequestedStartTime.Value : DBNull.Value),
                new MySqlParameter("@RequestedEndTime", shiftRequest.RequestedEndTime.HasValue ? (object)shiftRequest.RequestedEndTime.Value : DBNull.Value),
                new MySqlParameter("@Status", shiftRequest.Status));
        }

        // StoreIDで絞込検索
        public List<ShiftRequest> GetShiftRequestsByStoreId(int storeId)
        {
            return ExecuteQuery("SELECT * FROM shiftrequests WHERE StoreID = @StoreID", new MySqlParameter("@StoreID", storeId));
        }

        // クエリ実行してコマンド代入したら面白そうだからできた産物
        private List<ShiftRequest> ExecuteQuery(string sql, params MySqlParameter[] parameters)
        {
            var shiftRequests = new List<ShiftRequest>();
            using (var conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                var cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddRange(parameters);
                using (var rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        shiftRequests.Add(new ShiftRequest
                        {
                            RequestID = rdr.GetInt32("RequestID"),
                            StoreID = rdr.GetInt32("StoreID"),
                            StaffID = rdr.IsDBNull(rdr.GetOrdinal("StaffID")) ? (int?)null : rdr.GetInt32("StaffID"),
                            OriginalShiftID = rdr.IsDBNull(rdr.GetOrdinal("OriginalShiftID")) ? (int?)null : rdr.GetInt32("OriginalShiftID"),
                            RequestDate = rdr.GetDateTime("RequestDate"),
                            Status = rdr.GetInt32("Status"),
                            RequestedShiftDate = rdr.IsDBNull(rdr.GetOrdinal("RequestedShiftDate")) ? (DateTime?)null : rdr.GetDateTime("RequestedShiftDate"),
                            RequestedStartTime = rdr.IsDBNull(rdr.GetOrdinal("RequestedStartTime")) ? (TimeSpan?)null : rdr.GetTimeSpan("RequestedStartTime"),
                            RequestedEndTime = rdr.IsDBNull(rdr.GetOrdinal("RequestedEndTime")) ? (TimeSpan?)null : rdr.GetTimeSpan("RequestedEndTime")
                        });
                    }
                }
            }
            return shiftRequests;
        }

        // クエリ実行してコマンド代入したら面白そうだからできた産物の副産物
        private void ExecuteNonQuery(string sql, params MySqlParameter[] parameters)
        {
            using (var conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                var cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddRange(parameters);
                cmd.ExecuteNonQuery();
            }
        }


        // 保留中のrequestの取得
        public List<ShiftRequest> GetPendingRequests()
        {
            return ExecuteQuery("SELECT * FROM shiftrequests WHERE Status = @Status", new MySqlParameter("@Status", 0));
        }

    }
}
```

## Implementations/StaffDataAccess.cs
```csharp
using System.Collections.Generic;
using System;
using MySql.Data.MySqlClient;
using shift_making_man.Models;
using shift_making_man.Data;

public class StaffDataAccess : IStaffDataAccess
{
    // 接続文
    private readonly string connectionString = "server=localhost;database=19demo;user=root;password=;";

    // スタッフ取得
    public List<Staff> GetStaff()
    {
        var staffs = new List<Staff>();
        using (var conn = new MySqlConnection(connectionString))
        {
            conn.Open();
            var sql = "SELECT * FROM staff";
            using (var cmd = new MySqlCommand(sql, conn))
            using (var rdr = cmd.ExecuteReader())
            {
                while (rdr.Read())
                {
                    staffs.Add(new Staff
                    {
                        StaffID = rdr.GetInt32("StaffID"),
                        Username = rdr.GetString("Username"),
                        PasswordHash = rdr.GetString("PasswordHash"),
                        FullName = rdr.GetString("FullName"),
                        Email = rdr.GetString("Email"),
                        PhoneNumber = rdr.IsDBNull(rdr.GetOrdinal("PhoneNumber")) ? null : rdr.GetString("PhoneNumber"),
                        EmploymentType = rdr.IsDBNull(rdr.GetOrdinal("EmploymentType")) ? null : rdr.GetString("EmploymentType")
                    });
                }
            }
        }
        return staffs;
    }

    // IDで絞込
    public Staff GetStaffById(int staffId)
    {
        Staff staff = null;
        using (var conn = new MySqlConnection(connectionString))
        {
            conn.Open();
            var sql = "SELECT * FROM staff WHERE StaffID = @StaffID";
            using (var cmd = new MySqlCommand(sql, conn))
            {
                cmd.Parameters.AddWithValue("@StaffID", staffId);
                using (var rdr = cmd.ExecuteReader())
                {
                    if (rdr.Read())
                    {
                        staff = new Staff
                        {
                            StaffID = rdr.GetInt32("StaffID"),
                            Username = rdr.GetString("Username"),
                            PasswordHash = rdr.GetString("PasswordHash"),
                            FullName = rdr.GetString("FullName"),
                            Email = rdr.GetString("Email"),
                            PhoneNumber = rdr.IsDBNull(rdr.GetOrdinal("PhoneNumber")) ? null : rdr.GetString("PhoneNumber"),
                            EmploymentType = rdr.IsDBNull(rdr.GetOrdinal("EmploymentType")) ? null : rdr.GetString("EmploymentType")
                        };
                    }
                }
            }
        }
        return staff;
    }

    // 店舗IDで検索した結果をもとに絞込
    public List<Staff> GetStaffByStoreId(int storeId)
    {
        var staffs = new List<Staff>();
        using (var conn = new MySqlConnection(connectionString))
        {
            conn.Open();
            var sql = @"
                SELECT s.*
                FROM staff s
                JOIN shiftrequests sr ON s.StaffID = sr.StaffID
                WHERE sr.StoreID = @StoreID
                GROUP BY s.StaffID";
            using (var cmd = new MySqlCommand(sql, conn))
            {
                cmd.Parameters.AddWithValue("@StoreID", storeId);
                using (var rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        staffs.Add(new Staff
                        {
                            StaffID = rdr.GetInt32("StaffID"),
                            Username = rdr.GetString("Username"),
                            PasswordHash = rdr.GetString("PasswordHash"),
                            FullName = rdr.GetString("FullName"),
                            Email = rdr.GetString("Email"),
                            PhoneNumber = rdr.IsDBNull(rdr.GetOrdinal("PhoneNumber")) ? null : rdr.GetString("PhoneNumber"),
                            EmploymentType = rdr.IsDBNull(rdr.GetOrdinal("EmploymentType")) ? null : rdr.GetString("EmploymentType")
                        });
                    }
                }
            }
        }
        return staffs;
    }

    // シフト雇用形態ごとに絞込
    public List<Staff> GetStaffByEmploymentType(string employmentType)
    {
        var staffs = new List<Staff>();
        using (var conn = new MySqlConnection(connectionString))
        {
            conn.Open();
            var sql = "SELECT * FROM staff WHERE EmploymentType = @EmploymentType";
            using (var cmd = new MySqlCommand(sql, conn))
            {
                cmd.Parameters.AddWithValue("@EmploymentType", employmentType);
                using (var rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        staffs.Add(new Staff
                        {
                            StaffID = rdr.GetInt32("StaffID"),
                            Username = rdr.GetString("Username"),
                            PasswordHash = rdr.GetString("PasswordHash"),
                            FullName = rdr.GetString("FullName"),
                            Email = rdr.GetString("Email"),
                            PhoneNumber = rdr.IsDBNull(rdr.GetOrdinal("PhoneNumber")) ? null : rdr.GetString("PhoneNumber"),
                            EmploymentType = rdr.IsDBNull(rdr.GetOrdinal("EmploymentType")) ? null : rdr.GetString("EmploymentType")
                        });
                    }
                }
            }
        }
        return staffs;
    }
}
```

## Implementations/StoreDataAccess.cs
```csharp
//
using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using shift_making_man.Models;

namespace shift_making_man.Data
{
    public class StoreDataAccess : IStoreDataAccess
    {
        private readonly string connectionString = "server=localhost;database=19demo;user=root;password=;";

        // Storeオブジェクトを全取得
        public List<Store> GetStores()
        {
            List<Store> stores = new List<Store>();
            try
            {
                using (MySqlConnection conn = new MySqlConnection(connectionString))
                {
                    conn.Open();
                    string sql = "SELECT * FROM store";
                    MySqlCommand cmd = new MySqlCommand(sql, conn);
                    using (MySqlDataReader rdr = cmd.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            stores.Add(new Store
                            {
                                StoreID = rdr.GetInt32("StoreID"),
                                OpenTime = rdr.GetTimeSpan(rdr.GetOrdinal("OpenTime")),
                                CloseTime = rdr.GetTimeSpan(rdr.GetOrdinal("CloseTime")),
                                BusyTimeStart = rdr.GetTimeSpan(rdr.GetOrdinal("BusyTimeStart")),
                                BusyTimeEnd = rdr.GetTimeSpan(rdr.GetOrdinal("BusyTimeEnd")),
                                NormalStaffCount = rdr.GetInt32("NormalStaffCount"),
                                BusyStaffCount = rdr.GetInt32("BusyStaffCount")
                            });
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"MySQLエラー: {ex.Message}");
            }
            catch (FormatException ex)
            {
                Console.WriteLine($"TimeSpan変換エラー: {ex.Message}");
            }
            return stores;
        }

        // ID絞り込み
        public Store GetStoreById(int storeId)
        {
            Store store = null;
            try
            {
                using (MySqlConnection conn = new MySqlConnection(connectionString))
                {
                    conn.Open();
                    string sql = "SELECT * FROM store WHERE StoreID = @StoreID";
                    MySqlCommand cmd = new MySqlCommand(sql, conn);
                    cmd.Parameters.AddWithValue("@StoreID", storeId);
                    using (MySqlDataReader rdr = cmd.ExecuteReader())
                    {
                        if (rdr.Read())
                        {
                            store = new Store
                            {
                                StoreID = rdr.GetInt32("StoreID"),
                                OpenTime = rdr.GetTimeSpan(rdr.GetOrdinal("OpenTime")),
                                CloseTime = rdr.GetTimeSpan(rdr.GetOrdinal("CloseTime")),
                                BusyTimeStart = rdr.GetTimeSpan(rdr.GetOrdinal("BusyTimeStart")),
                                BusyTimeEnd = rdr.GetTimeSpan(rdr.GetOrdinal("BusyTimeEnd")),
                                NormalStaffCount = rdr.GetInt32("NormalStaffCount"),
                                BusyStaffCount = rdr.GetInt32("BusyStaffCount")
                            };
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"MySQLエラー: {ex.Message}");
            }
            catch (FormatException ex)
            {
                Console.WriteLine($"TimeSpan変換エラー: {ex.Message}");
            }
            return store;
        }
    }
}
```
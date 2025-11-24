---
sidebar_position: 3
description: 19回大会前に書いてたコード解説：Proglam.cs
---

### DataAccessFacade.cs
```csharp
using shift_making_man.Controllers.ShiftServices;

namespace shift_making_man.Data
{
    public class DataAccessFacade
    {
        public IAdminDataAccess AdminDataAccess { get; }
        public IShiftDataAccess ShiftDataAccess { get; }
        public IStaffDataAccess StaffDataAccess { get; }
        public IAttendanceDataAccess AttendanceDataAccess { get; }
        public IStoreDataAccess StoreDataAccess { get; }
        public IShiftRequestDataAccess ShiftRequestDataAccess { get; }
        public ShiftCreationService ShiftCreationService { get; }
        public ShiftValidationService ShiftValidationService { get; }
        public ShiftOptimizationService ShiftOptimizationService { get; }
        public ShiftModificationService ShiftModificationService { get; }

        public DataAccessFacade(
            IAdminDataAccess adminDataAccess,
            IShiftDataAccess shiftDataAccess,
            IStaffDataAccess staffDataAccess,
            IAttendanceDataAccess attendanceDataAccess,
            IStoreDataAccess storeDataAccess,
            IShiftRequestDataAccess shiftRequestDataAccess,
            ShiftCreationService shiftCreationService,
            ShiftValidationService shiftValidationService,
            ShiftOptimizationService shiftOptimizationService,
            ShiftModificationService shiftModificationService)
        {
            AdminDataAccess = adminDataAccess;
            ShiftDataAccess = shiftDataAccess;
            StaffDataAccess = staffDataAccess;
            AttendanceDataAccess = attendanceDataAccess;
            StoreDataAccess = storeDataAccess;
            ShiftRequestDataAccess = shiftRequestDataAccess;
            ShiftCreationService = shiftCreationService;
            ShiftValidationService = shiftValidationService;
            ShiftOptimizationService = shiftOptimizationService;
            ShiftModificationService = shiftModificationService;
        }

        public DataAccessFacade(IAdminDataAccess adminDataAccess, IShiftDataAccess shiftDataAccess, IStaffDataAccess staffDataAccess, IStoreDataAccess storeDataAccess, IShiftRequestDataAccess shiftRequestDataAccess, ShiftCreationService shiftCreationService, ShiftValidationService shiftValidationService, ShiftOptimizationService shiftOptimizationService, ShiftModificationService shiftModificationService)
        {
            AdminDataAccess = adminDataAccess;
            ShiftDataAccess = shiftDataAccess;
            StaffDataAccess = staffDataAccess;
            StoreDataAccess = storeDataAccess;
            ShiftRequestDataAccess = shiftRequestDataAccess;
            ShiftCreationService = shiftCreationService;
            ShiftValidationService = shiftValidationService;
            ShiftOptimizationService = shiftOptimizationService;
            ShiftModificationService = shiftModificationService;
        }
    }
}

```
データアクセスオブジェクトやらサービスのインスタンスを保持するプロパティコンストラクタが2つあるのはIAttendanceDataAccessがあるやつとないやつで分けちゃったから。ダイエットできるよねポイント高い部分。サブシステムが多くて心が折れたので保守性を高めるためにもファサードにまとめてみた。
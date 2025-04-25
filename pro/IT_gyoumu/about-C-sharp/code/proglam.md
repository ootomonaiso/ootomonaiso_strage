---
sidebar_position: 2
description: 19回大会前に書いてたコード解説：Proglam.cs
---

# Proglam.cs解説
アプリ動かしたりデータ渡したりしてる本体。こいつがいないと話は始まらない。作成した時にもうすでにあるプログラムファイルで、中身を書き換えて変更するタイプのやつ。
```csharp
using System;
using System.Windows.Forms;
using Microsoft.Extensions.DependencyInjection;
using shift_making_man.Controllers;
using shift_making_man.Controllers.ShiftServices;
using shift_making_man.Data;
using shift_making_man.Views;

namespace shift_making_man
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            var serviceProvider = ConfigureServices();
            Application.Run(serviceProvider.GetRequiredService<LoginForm>());
        }

        private static IServiceProvider ConfigureServices()
        {
            var services = new ServiceCollection();

            // データアクセスオブジェクトの登録
            services.AddSingleton<IAdminDataAccess, AdminDataAccess>()
                    .AddSingleton<IShiftDataAccess>(provider =>
                        new ShiftDataAccess("server=localhost;database=19demo;user=root;password=")) 
                    .AddSingleton<IStaffDataAccess, StaffDataAccess>()
                    .AddSingleton<IStoreDataAccess, StoreDataAccess>()
                    .AddSingleton<IShiftRequestDataAccess, ShiftRequestDataAccess>();

            // サービスの登録
            services.AddSingleton<ShiftValidationService>(provider =>
                new ShiftValidationService(
                    provider.GetRequiredService<IStoreDataAccess>(),
                    provider.GetRequiredService<IShiftDataAccess>(),
                    provider.GetRequiredService<IStaffDataAccess>()
                ))
                .AddSingleton<ShiftCreationService>(provider =>
                    new ShiftCreationService(
                        provider.GetRequiredService<IStoreDataAccess>(),
                        provider.GetRequiredService<IStaffDataAccess>(),
                        provider.GetRequiredService<IShiftDataAccess>(),
                        provider.GetRequiredService<IShiftRequestDataAccess>(),
                        provider.GetRequiredService<ShiftValidationService>(),
                        provider.GetRequiredService<ShiftOptimizationService>()
                    ))
                .AddSingleton<ShiftOptimizationService>()
                .AddSingleton<ShiftModificationService>();

            // DataAccessFacadeの登録
            services.AddSingleton<DataAccessFacade>(provider =>
                new DataAccessFacade(
                    provider.GetRequiredService<IAdminDataAccess>(),
                    provider.GetRequiredService<IShiftDataAccess>(),
                    provider.GetRequiredService<IStaffDataAccess>(),
                    provider.GetRequiredService<IStoreDataAccess>(),
                    provider.GetRequiredService<IShiftRequestDataAccess>(),
                    provider.GetRequiredService<ShiftCreationService>(),
                    provider.GetRequiredService<ShiftValidationService>(),
                    provider.GetRequiredService<ShiftOptimizationService>(),
                    provider.GetRequiredService<ShiftModificationService>()
                ));

            // コントローラの登録
            services.AddSingleton<ShiftSchedulerController>(provider =>
                new ShiftSchedulerController(
                    provider.GetRequiredService<ShiftCreationService>(),
                    provider.GetRequiredService<ShiftModificationService>(),
                    provider.GetRequiredService<ShiftValidationService>(),
                    provider.GetRequiredService<ShiftOptimizationService>(),
                    provider.GetRequiredService<IStoreDataAccess>(),
                    provider.GetRequiredService<IShiftDataAccess>()
                ));

            // フォームの登録
            services.AddTransient<LoginForm>()
                    .AddTransient<MainForm>(provider =>
                        new MainForm(provider.GetRequiredService<DataAccessFacade>()))
                    .AddTransient<DashboardForm>(provider =>
                        new DashboardForm(provider.GetRequiredService<DataAccessFacade>()))
                    .AddTransient<ShiftSchedulerForm>(provider =>
                        new ShiftSchedulerForm(
                            provider.GetRequiredService<ShiftSchedulerController>()
                        ));

            return services.BuildServiceProvider();
        }
    }
}

```
#### Mainメゾット
Mainメゾットはアプリケーションの開始地点です。

```csharp
static void Main()
{
    Application.EnableVisualStyles();
    Application.SetCompatibleTextRenderingDefault(false);
    var serviceProvider = ConfigureServices();
    Application.Run(serviceProvider.GetRequiredService<LoginForm>());
}
```
下に示す部分ではアプリケーションの見た目を設定するための構文です。確かソリューション作ったタイミングでもうすでにある
```csharp
    Application.EnableVisualStyles();
    Application.SetCompatibleTextRenderingDefault(false);
```
サービスプロバイダーとして`var serviceProvider = ConfigureServices();`メゾットを呼び出してます
```csharp
var serviceProvider = ConfigureServices();
```
最後に`LoginForm`を表示してアプリケーションを開始します
```csharp
    Application.Run(serviceProvider.GetRequiredService<LoginForm>());
```

#### ConfigureServices メソッド
```csharp
private static IServiceProvider ConfigureServices()
{
    var services = new ServiceCollection();

    // データアクセスオブジェクトの登録
    services.AddSingleton<IAdminDataAccess, AdminDataAccess>()
            .AddSingleton<IShiftDataAccess>(provider =>
                new ShiftDataAccess("server=localhost;database=19demo;user=root;password=")) 
            .AddSingleton<IStaffDataAccess, StaffDataAccess>()
            .AddSingleton<IStoreDataAccess, StoreDataAccess>()
            .AddSingleton<IShiftRequestDataAccess, ShiftRequestDataAccess>();

    // サービスの登録
    services.AddSingleton<ShiftValidationService>(provider =>
        new ShiftValidationService(
            provider.GetRequiredService<IStoreDataAccess>(),
            provider.GetRequiredService<IShiftDataAccess>(),
            provider.GetRequiredService<IStaffDataAccess>()
        ))
        .AddSingleton<ShiftCreationService>(provider =>
            new ShiftCreationService(
                provider.GetRequiredService<IStoreDataAccess>(),
                provider.GetRequiredService<IStaffDataAccess>(),
                provider.GetRequiredService<IShiftDataAccess>(),
                provider.GetRequiredService<IShiftRequestDataAccess>(),
                provider.GetRequiredService<ShiftValidationService>(),
                provider.GetRequiredService<ShiftOptimizationService>()
            ))
        .AddSingleton<ShiftOptimizationService>()
        .AddSingleton<ShiftModificationService>();

    // DataAccessFacadeの登録
    services.AddSingleton<DataAccessFacade>(provider =>
        new DataAccessFacade(
            provider.GetRequiredService<IAdminDataAccess>(),
            provider.GetRequiredService<IShiftDataAccess>(),
            provider.GetRequiredService<IStaffDataAccess>(),
            provider.GetRequiredService<IStoreDataAccess>(),
            provider.GetRequiredService<IShiftRequestDataAccess>(),
            provider.GetRequiredService<ShiftCreationService>(),
            provider.GetRequiredService<ShiftValidationService>(),
            provider.GetRequiredService<ShiftOptimizationService>(),
            provider.GetRequiredService<ShiftModificationService>()
        ));

    // コントローラの登録
    services.AddSingleton<ShiftSchedulerController>(provider =>
        new ShiftSchedulerController(
            provider.GetRequiredService<ShiftCreationService>(),
            provider.GetRequiredService<ShiftModificationService>(),
            provider.GetRequiredService<ShiftValidationService>(),
            provider.GetRequiredService<ShiftOptimizationService>(),
            provider.GetRequiredService<IStoreDataAccess>(),
            provider.GetRequiredService<IShiftDataAccess>()
        ));

    // フォームの登録
    services.AddTransient<LoginForm>()
            .AddTransient<MainForm>(provider =>
                new MainForm(provider.GetRequiredService<DataAccessFacade>()))
            .AddTransient<DashboardForm>(provider =>
                new DashboardForm(provider.GetRequiredService<DataAccessFacade>()))
            .AddTransient<ShiftSchedulerForm>(provider =>
                new ShiftSchedulerForm(
                    provider.GetRequiredService<ShiftSchedulerController>()
                ));

    return services.BuildServiceProvider();
}
```
データアクセスオブジェクトを登録し、サービスを登録し、DataAccessFacadeを複数のデータアクセスオブジェクトをまとめて扱うオブジェクトを登録して、コントローラ、及びフォームを登録しまくるところです。ダイエットできた気がしてきてる。誰だよファサード実装したいとか言ったの。私ですごめんなさい。
---
sidebar_position: 7
description: 19回大会前に書いてたコード解説：Adminログイン関連
---
# Adminログインを構成しているコントローラーとビュー
コントローラーとForm実装を大公開

## Admin権限のログイン用のコントローラー
```csharp
using shift_making_man.Data;
using shift_making_man.Models;

namespace shift_making_man.Controllers
{
    // AuthController クラスは管理者の認証を担当します
    public class AuthController
    {
        // データアクセス用のインターフェース
        private readonly IAdminDataAccess _dataAccess;

        // コンストラクタでデータアクセスの依存性を注入します
        public AuthController(IAdminDataAccess dataAccess)
        {
            _dataAccess = dataAccess;
        }

        // 管理者のログイン処理を行います
        public Admin Login(string username, string password)
        {
            // ユーザー名で管理者情報を取得
            Admin admin = _dataAccess.GetAdminByUsername(username);
            // パスワードが一致するか確認
            if (admin != null && BCrypt.Net.BCrypt.Verify(password, admin.PasswordHash))
            {
                // 一致した場合、管理者情報を返します
                return admin;
            }
            // 一致しない場合、nullを返します
            return null;
        }
    }
}
```
見ての通りというか…ユーザーIDとパスワードの一致したかしてないかの判定とってるだけです。

## Adminログイン用のフォーム
```csharp
//
using System;
using System.Windows.Forms;
using shift_making_man.Controllers;
using shift_making_man.Models;
using shift_making_man.Data;

namespace shift_making_man.Views
{
    public partial class LoginForm : Form
    {
        private readonly DataAccessFacade _dataAccessFacade;
        private readonly AuthController _authController;

        public LoginForm(DataAccessFacade dataAccessFacade)
        {
            InitializeComponent();
            _dataAccessFacade = dataAccessFacade;
            _authController = new AuthController(_dataAccessFacade.AdminDataAccess);
        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            string username = txtUsername.Text;
            string password = txtPassword.Text;
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                MessageBox.Show("ユーザー名とパスワードを入力してください。", "エラー", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            Admin loggedInUser = _authController.Login(username, password);
            if (loggedInUser != null)
            {
                MessageBox.Show("ログイン成功！", "成功", MessageBoxButtons.OK, MessageBoxIcon.Information);
                MainForm mainForm = new MainForm(_dataAccessFacade);
                mainForm.Show();
                this.Hide();
            }
            else
            {
                MessageBox.Show("ユーザー名またはパスワードが間違っています。", "エラー", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
```
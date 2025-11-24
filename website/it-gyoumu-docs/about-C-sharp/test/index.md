---
sidebar_position: 1
description: 謗･邯夂｢ｺ隱阪ｒ蜿悶ｋ
---

# MySQLServer蛛ｴ縺ｨ繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺ｮ謗･邯夂｢ｺ隱阪ｒ陦後≧
縺ｾ縺壹ョ繝ｼ繧ｿ繝吶・繧ｹ縺ｨ繧ｳ繝阪け繧ｷ繝ｧ繝ｳ繧貞叙繧峨↑縺・％縺ｨ縺ｫ縺ｯ縺願ｩｱ縺ｫ縺ｪ繧峨↑縺・・縺ｧ縲√→繧翫≠縺医★謗･邯壹・遒ｺ隱阪ｒ縺励∪縺励ｇ縺・荳九↓豺ｻ莉倥☆繧九さ繝ｼ繝峨ｒ縲訓roglam.cs縲阪↓繧ｳ繝斐・縺励※縺上□縺輔＞

``` Csharp
using System;
using MySql.Data.MySqlClient;

namespace Testproject
{
    internal static class Program
    {
        /// <summary>
        /// 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ縺ｮ繝｡繧､繝ｳ 繧ｨ繝ｳ繝医Μ 繝昴う繝ｳ繝医〒縺吶・        /// </summary>
        [STAThread]
        static void Main()
        {
            // MySQL繝・・繧ｿ繝吶・繧ｹ縺ｸ縺ｮ謗･邯壽枚蟄怜・ 
            string connectionString = "server=localhost;database=mydatabase;user=root;password=myPassword;";
            // MySqlConnection繧ｪ繝悶ず繧ｧ繧ｯ繝医・菴懈・
            MySqlConnection connection = new MySqlConnection(connectionString);

            try
            {
                // 繝・・繧ｿ繝吶・繧ｹ謗･邯壹ｒ髢九￥
                connection.Open();
                // 謗･邯壹′謌仙粥縺励◆蝣ｴ蜷医・ok"縺ｨ蜃ｺ蜉・                Console.WriteLine("ok");
            }
            catch (Exception)
            {
                // 謗･邯壹′螟ｱ謨励＠縺溷ｴ蜷医・no"縺ｨ蜃ｺ蜉・                Console.WriteLine("no");
            }
            finally
            {
                // 謗･邯壹′髢九°繧後※縺・ｋ蝣ｴ蜷医∵磁邯壹ｒ髢峨§繧・                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
            }
        }
    }
}

```
## 豕ｨ諢冗せ
``` Csharp
// MySQL繝・・繧ｿ繝吶・繧ｹ縺ｸ縺ｮ謗･邯壽枚蟄怜・ 
string connectionString = "server=localhost;database=mydatabase;user=root;password=myPassword;";
```
縺薙％縺ｮ驛ｨ蛻・〒縺吶′縲《erver縺ｯMySQLServer縺後≠繧句ｴ謇縲‥atabase縺ｯMySQLWorkBench縺ｧ縺ｮ繧ｹ繧ｭ繝ｼ繝槭「ser縺ｯ繝ｦ繝ｼ繧ｶ繝ｼ繝阪・繝縲｝assword縺ｯ繝ｦ繝ｼ繧ｶ繝ｼ縺ｮ繝代せ繝ｯ繝ｼ繝峨ｒ蜈･繧後ｋ驛ｨ蛻・〒縺吶ゅ≠縺ｪ縺溘・迺ｰ蠅・↓蜷医ｏ縺帙※螟画峩縺励※縺上□縺輔＞縲・![VisualStudio 2022](/img/it-gyoumu-docs/jpg)

縺薙・繧医≧縺ｫ縲経k縲阪→陦ｨ遉ｺ縺輔ｌ繧後・謌仙粥

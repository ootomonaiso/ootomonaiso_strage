# ネットワーク構成図

```
[仮想インターネットエリア]
      └── sv
      └── ex-client
        ↑
     ┌───────┐
     │  ISP  │
     └──┬────┘
        │
        ├── R-Tky1 ── R-Tky2 ── t-client
        │           │
        │         [Internal: 192.168.1.0/24]
        │
        ├── R-Gnm ── g-client
        │
        └── R-Osk
              ├── osv1（DMZ）
              ├── osv2（Internal1: 192.168.1.0/24）
              └── o-client（Internal2: 192.168.2.0/24）
```

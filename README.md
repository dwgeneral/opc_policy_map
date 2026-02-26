# 🗺️ OPC 政策地图 (OPC Policy Map)

> 中国一人企业（OPC）政策与园区信息开源汇总平台 · 社区驱动 · 持续更新

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Data License: CC BY 4.0](https://img.shields.io/badge/Data%20License-CC%20BY%204.0-blue.svg)](https://creativecommons.org/licenses/by/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/dwgeneral/opc_policy_map?style=social)](https://github.com/dwgeneral/opc_policy_map)

**[🌐 在线访问](https://opc-policy-map-dwgeneral.vercel.app)** · **[📋 提交新政策](https://github.com/dwgeneral/opc_policy_map/issues/new?template=new-policy.md)** · **[💬 讨论区](https://github.com/dwgeneral/opc_policy_map/discussions)**

---

## 📖 项目简介

随着中国各地相继出台 **一人企业（One Person Company，OPC）** 配套扶持政策，政策信息分散、更新不及时、难以横向比较等问题日益突出。

本项目旨在打造一个**开源、社区驱动**的 OPC 政策信息聚合平台，帮助独立开发者、自由职业者、创业者：

- 🔍 **快速查询** 各地 OPC 政策详情
- 📊 **横向对比** 不同城市/园区的政策优惠
- 📅 **跟踪动态** 政策发布与更新时间线
- 📝 **指导申请** 提供详细申请流程与材料清单

## ✨ 功能特性

| 功能              | 描述                                     |
| ----------------- | ---------------------------------------- |
| 🗺️ **可视化地图** | 中国地图展示各城市政策分布，点击即可查看 |
| 📋 **政策列表**   | 多维度筛选、全文搜索政策信息             |
| 🏢 **园区汇总**   | 各地 OPC 配套园区信息、入驻条件、费用    |
| ⚖️ **政策对比**   | 横向对比多个城市/园区政策差异            |
| 📰 **最新动态**   | 政策发布时间线，订阅更新通知             |
| 📖 **申请指南**   | 手把手教程，申请材料清单                 |

## 📊 数据概览

> 以下数据由社区贡献，持续更新中

| 指标     | 数量       |
| -------- | ---------- |
| 覆盖城市 | 持续增加中 |
| 收录政策 | 持续增加中 |
| 收录园区 | 持续增加中 |
| 申请指南 | 持续增加中 |

## 🚀 快速开始

### 本地运行

```bash
# 克隆项目
git clone https://github.com/dwgeneral/opc_policy_map.git
cd opc-policy-map

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🤝 如何贡献

我们欢迎任何形式的贡献！请阅读 [贡献指南](CONTRIBUTING.md) 了解详情。

### 快速贡献方式

1. **提交新政策** → [新建 Issue](https://github.com/dwgeneral/opc_policy_map/issues/new?template=new-policy.md) 或直接提 PR
2. **更新政策状态** → 政策过期或信息变更时提交 PR
3. **添加园区信息** → 补充各地 OPC 配套园区数据
4. **完善申请指南** → 分享申请经验，丰富指南内容
5. **报告错误** → [提交 Issue](https://github.com/dwgeneral/opc_policy_map/issues/new)

### 数据格式

政策数据使用 YAML 格式存储在 `data/policies/<城市>/` 目录下。请参考：

- [数据格式说明](data/policies/_schema.yaml)
- [政策示例文件](data/policies/beijing/zhongguancun-ai-opc-2025.yaml)
- [贡献指南](CONTRIBUTING.md)

## 📁 目录结构

```
opc-policy-map/
├── data/                    # 📊 政策数据
│   ├── policies/            # 各地政策 (YAML)
│   ├── parks/               # 各地园区 (YAML)
│   └── guides/              # 申请指南 (Markdown)
├── src/
│   ├── app/                 # Next.js App Router 页面
│   ├── components/          # React 组件
│   ├── lib/                 # 工具函数
│   └── types/               # TypeScript 类型定义
├── scripts/                 # 数据校验脚本
├── .github/                 # GitHub 模板与 Actions
│   ├── ISSUE_TEMPLATE/      # Issue 模板
│   └── workflows/           # CI/CD 工作流
├── CONTRIBUTING.md          # 贡献指南
├── CODE_OF_CONDUCT.md       # 行为准则
└── LICENSE                  # 开源协议
```

## 📄 开源协议

- **代码**：[MIT License](LICENSE)
- **数据**：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

使用本项目数据时，请注明来源：`OPC Policy Map (https://github.com/dwgeneral/opc_policy_map)`

## ⚠️ 免责声明

本项目收录的政策信息**仅供参考**，不构成法律或财务建议。政策内容以各地官方发布为准，请在申请前核实最新政策详情。

## 🌟 贡献者

感谢所有为本项目做出贡献的朋友！

---

<p align="center">
  如果本项目对你有帮助，请给一个 ⭐ Star 支持！
</p>

# Contributing

感谢你帮助维护 Diffusion + Flow Reading Map。我们欢迎新增论文、修正元数据、补充官方代码链接，以及改进阅读路径。

## 收录范围

论文应直接推进扩散生成、score-based modeling、Flow Matching、Rectified Flow，或提供理解这些方法所必需的理论、求解器、评测与跨领域应用。普通生成模型或仅在背景中提及 diffusion / flow 的工作不进入核心论文库。

## 新增论文

1. 搜索完整标题和 canonical arXiv ID，确认没有重复。
2. 优先使用不带 `v1` / `v2` 的 arXiv abstract URL。
3. `published` 使用首次公开日期；`year` 使用该首次公开年份。
4. 每篇论文选择一个主 `category`，用多个 `tags` 表示交叉关系。
5. 不复制论文摘要。Core 条目必须写原创、具体的 `whyReadZh`。
6. 将记录加入 `data/papers.json`，然后运行：

```bash
npm run validate:data
npm run lint
npm run build
```

## 分类判断

- `foundations`：score matching、SDE/ODE、CNF 与数学基础；
- `objectives`：噪声日程、参数化、预条件与训练目标；
- `sampling`：采样器、数值求解器与并行采样；
- `guidance`：条件引导、结构控制、个性化与编辑；
- `latent`：在压缩潜空间中的 diffusion / flow；
- `architectures`：U-Net、DiT 与规模化设计；
- `distillation`：consistency、蒸馏与少步生成；
- `flow`：Flow Matching、Conditional Flow Matching、Rectified Flow 与 stochastic interpolants；
- `geometry`：流形、离散、等变和结构数据；
- `applications`：视频、音频、三维、机器人与科学应用；
- `evaluation`：理论分析、泛化、记忆与评测；
- `surveys`：综述、教程与统一视角。

## PR 说明

请说明论文为什么相关、主分类的理由、是否有官方代码或模型，以及元数据的一手核对来源。维护者可能调整 tier 或 tags，以保持整个阅读地图一致。

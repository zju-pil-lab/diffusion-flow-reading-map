# Diffusion + Flow Reading Map

面向学生与研究者的扩散模型与 Flow Matching 开放论文导航。

在线阅读：[Diffusion + Flow Reading Map](https://zju-pil-lab.github.io/diffusion-flow-reading-map/)

项目以研究问题和方法类别为主线，以论文首次公开时间为排序维度。首版收录 105 篇经一手页面核对的论文，覆盖 diffusion、score/SDE、guidance、latent diffusion、sampling、distillation、Flow Matching、Rectified Flow、结构空间与跨领域应用。

## 设计原则

- **先建立主干**：12 篇 Core Reading Path 构成可完成的入门路径。
- **类别为主，时间为辅**：避免将快速增长的领域压成一份超长时间表。
- **一个记录，多组标签**：每篇论文只有一个主类别，并通过 tags 交叉检索。
- **一手元数据**：标题、作者、首次公开日期和链接优先以 arXiv 或正式 proceedings 为准。
- **自动发现，人工收录**：定时任务只创建候选 issue，最终分类与阅读层级由维护者确认。
- **中文导读，英文标题**：便于实验室教学、检索和引用。

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

发布前检查：

```bash
npm run validate:data
npm run lint
npm run build
GITHUB_PAGES=true PAGES_BASE_PATH=/diffusion-flow-reading-map npm run build:pages
```

## 数据与更新

- `data/papers.json`：网站唯一论文数据源。
- `scripts/build_seed_library.py`：用 arXiv Atom API 重建首版元数据；分类、tier 与中文导读为独立编辑数据。
- `scripts/discover_arxiv.py`：每周搜索新候选，不会自动发布论文。
- `scripts/validate-data.mjs`：检查 schema、重复项、类别和 12 篇核心路径。

更新流程：每周 workflow 生成候选 issue → 维护者核对一手记录与主分类 → PR 通过数据、lint 和构建检查 → GitHub Pages 自动发布。

提交新论文或修正元数据，请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 来源与致谢

- [Stanford Diffusion Models Reading List](https://web.stanford.edu/~mrifaki/diffusion-models-readings.html)：用于交叉核对基础阅读主线。
- [Awesome Diffusion Models](https://github.com/diff-usion/Awesome-Diffusion-Models)：扩散模型方向的广域 watchlist。
- [Awesome Flow Matching](https://github.com/billzi2016/awesome-flow-matching)：Flow Matching、Rectified Flow 与结构空间分支的 watchlist。
- 论文元数据最终回到 arXiv / proceedings 等一手记录核对；本站不转载论文摘要或正文。

## License

网站代码采用 [MIT License](LICENSE)。本站原创的数据组织与中文导读采用 [CC BY 4.0](LICENSE-DATA.md)。第三方论文、标题、作者信息、商标和链接仍遵循各自权利声明。

import PaperExplorer from '@/components/paper-explorer';
import {
  categories,
  categoryById,
  essentialPapers,
  formatAuthors,
  latestPapers,
  papers,
} from '@/lib/papers';

const coreCategoryIds = [
  'foundations', 'objectives', 'sampling', 'guidance',
  'latent', 'architectures', 'distillation', 'flow',
];

export default function Home() {
  const coreCategories = coreCategoryIds.map((id) => categoryById[id]);

  return (
    <main>
      <nav className="site-nav" aria-label="主导航">
        <a className="wordmark" href="#top" aria-label="Diffusion and Flow Reading Map 首页">
          <span className="wordmark-mark" aria-hidden="true" />
          diffusion + flow / map
        </a>
        <div className="nav-links">
          <a href="#start">核心路径</a>
          <a href="#map">方法地图</a>
          <a href="#library">论文库</a>
          <a href="#updates">更新机制</a>
        </div>
        <a
          className="nav-github"
          href="https://github.com/zju-pil-lab/diffusion-flow-reading-map"
          target="_blank"
          rel="noreferrer"
        >
          Open source ↗
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> A RESEARCH READING MAP · SEP 2026</p>
          <h1>
            从 <em>Diffusion</em> 到 <em>Flow</em>，<br />
            建立生成模型主线。
          </h1>
          <p className="hero-deck">
            面向学生与研究者的扩散模型与 Flow Matching 论文导航。
            以研究问题组织方法，以首次公开时间追踪进展。
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#start">从 12 篇开始 <span>→</span></a>
            <a className="button button-secondary" href="#library">浏览全部论文</a>
          </div>
        </div>

        <div className="denoise-card" aria-label="从噪声分布到数据分布的概率路径示意">
          <div className="denoise-head">
            <span>PROBABILITY PATH</span><span>t →</span>
          </div>
          <div className="trace-row trace-muted"><span>0.00</span><code>p₀ = Gaussian noise</code></div>
          <div className="trace-row"><span>0.33</span><code>ẋₜ = vθ(xₜ, t)</code></div>
          <div className="trace-row"><span>0.67</span><code>transport · denoise · guide</code></div>
          <div className="trace-row trace-final"><span>1.00</span><code>p₁ = data distribution</code></div>
          <div className="noise-field" aria-hidden="true" />
          <p className="trace-caption">A compact intuition — not a complete numerical solver.</p>
        </div>
      </section>

      <section className="stats" aria-label="论文库概况">
        <div><strong>{papers.length}</strong><span>篇精选论文<br />统一数据源</span></div>
        <div><strong>12</strong><span>篇核心主干<br />可完成路径</span></div>
        <div><strong>{categories.length}</strong><span>研究方向<br />交叉索引</span></div>
        <div className="stats-note"><span className="status-dot" />VERIFIED<br />2026.09.12</div>
      </section>

      <section className="section path-section" id="start">
        <div className="section-heading sticky-heading">
          <p className="eyebrow"><span /> CORE READING PATH</p>
          <h2>核心论文<br />阅读路径</h2>
          <p>12 篇论文覆盖 diffusion、score/SDE、引导、潜空间、Flow Matching 与 Rectified Flow。建议按编号阅读，再进入专题分支。</p>
          <div className="scope-note">
            <span>READING LEVELS</span>
            <p><b>必读</b>建立主干；<b>推荐</b>补齐方法；<b>前沿</b>追踪新进展；<b>背景</b>提供统一视角。</p>
          </div>
        </div>
        <div className="paper-list">
          {essentialPapers.map((paper) => (
            <article className="paper-row" key={paper.id}>
              <span className="paper-index">{String(paper.essentialOrder).padStart(2, '0')}</span>
              <div>
                <p className="paper-year">{paper.year} · {categoryById[paper.category]?.label}</p>
                <h3><a href={paper.url} target="_blank" rel="noreferrer">{paper.title}</a></h3>
                <p>{paper.whyReadZh}</p>
              </div>
              <a href={paper.url} target="_blank" rel="noreferrer" aria-label={`打开论文：${paper.title}`}>↗</a>
            </article>
          ))}
          <a className="view-all" href="#library">完成主干后，进入完整论文库 <span>{papers.length} papers</span><b>→</b></a>
        </div>
      </section>

      <section className="latest-section" aria-labelledby="latest-title">
        <div className="latest-intro">
          <p className="eyebrow"><span /> LATEST VERIFIED</p>
          <h2 id="latest-title">最近收录</h2>
          <p>按论文首次公开日期排序，而不是最新版提交日期；自动发现只生成候选，人工核对后才进入论文库。</p>
        </div>
        <div className="latest-grid">
          {latestPapers.map((paper, index) => (
            <article className="latest-card" key={paper.id}>
              <div className="latest-meta">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <time dateTime={paper.published}>{paper.published}</time>
              </div>
              <p className="latest-category">{categoryById[paper.category]?.zh}</p>
              <h3><a href={paper.url} target="_blank" rel="noreferrer">{paper.title}</a></h3>
              <p>{formatAuthors(paper.authors, 3)}</p>
              <a className="latest-link" href={paper.url} target="_blank" rel="noreferrer" aria-label={`打开论文：${paper.title}`}>Paper ↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section map-section" id="map">
        <div className="section-heading">
          <p className="eyebrow"><span /> METHOD MAP</p>
          <h2>核心方法<br />分类地图</h2>
          <p>主地图按研究问题组织：训练什么、怎样采样、如何控制、在哪个空间生成，以及怎样从随机扩散连接到确定性传输。</p>
        </div>
        <div className="family-grid">
          {coreCategories.map((category, index) => {
            const count = papers.filter((paper) => paper.category === category.id).length;
            return (
              <a
                className="family-card"
                href={`?category=${category.id}#library`}
                key={category.id}
              >
                <span className="family-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="family-label">{category.label}</span>
                <h3>{category.zh}</h3>
                <p>{category.description}</p>
                <div className="family-foot"><code>{category.formula}</code><span>{count} papers ↘</span></div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="catalog-section" id="library">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow"><span /> FULL LIBRARY</p>
            <h2>完整论文库</h2>
          </div>
          <p>按标题、作者或标签搜索；按 12 个研究方向、阅读层级与首次公开时间筛选。每条记录均链接到论文一手页面。</p>
        </div>
        <PaperExplorer papers={papers} />
      </section>

      <section className="update-section" id="updates">
        <div className="update-lead">
          <p className="eyebrow"><span /> UPDATE PIPELINE</p>
          <h2>论文收录与<br />更新机制</h2>
        </div>
        <div className="update-steps">
          <article><span>01 / DISCOVER</span><h3>每周检索</h3><p>GitHub Actions 定期检索 diffusion model、score-based model、flow matching、rectified flow 等 arXiv 关键词。</p></article>
          <article><span>02 / REVIEW</span><h3>人工审核</h3><p>自动化只创建候选 issue；相关性、主分类、阅读层级与元数据由实验室成员确认。</p></article>
          <article><span>03 / PUBLISH</span><h3>合并发布</h3><p>数据校验、重复检查与构建通过后，GitHub Pages 自动更新；发布日期统一使用 first-posted。</p></article>
        </div>
      </section>

      <section className="source-section" id="contribute">
        <div>
          <p className="eyebrow"><span /> SOURCES & CREDIT</p>
          <h2>资料来源与<br />引用说明</h2>
        </div>
        <div className="source-list">
          <a href="https://web.stanford.edu/~mrifaki/diffusion-models-readings.html" target="_blank" rel="noreferrer">
            <span>01</span><div><b>Stanford · Diffusion Models Reading List</b><p>用于交叉核对基础阅读主线；本站扩展了 Flow Matching 与 2024–2026 年工作。</p></div><i>↗</i>
          </a>
          <a href="https://github.com/diff-usion/Awesome-Diffusion-Models" target="_blank" rel="noreferrer">
            <span>02</span><div><b>Awesome Diffusion Models</b><p>作为扩散模型方向的广域 watchlist；本站重新核对一手链接并独立分类。</p></div><i>↗</i>
          </a>
          <a href="https://github.com/billzi2016/awesome-flow-matching" target="_blank" rel="noreferrer">
            <span>03</span><div><b>Awesome Flow Matching</b><p>用于跟踪 flow matching、rectified flow、几何方法及应用分支。</p></div><i>↗</i>
          </a>
          <div className="source-item">
            <span>04</span><div><b>Primary records · arXiv / proceedings</b><p>标题、作者、首次公开日期与论文链接以一手记录为准；不转载论文摘要。</p></div><i>✓</i>
          </div>
        </div>
      </section>

      <footer>
        <div><span className="wordmark-mark" />DIFFUSION + FLOW / MAP</div>
        <p>OPEN · CURATED · BUILT FOR LEARNING</p>
        <p>
          <a href="https://github.com/zju-pil-lab/diffusion-flow-reading-map" target="_blank" rel="noreferrer">GITHUB ↗</a>
          {' · '}LAST VERIFIED · 2026.09.12
        </p>
      </footer>
    </main>
  );
}

import paperData from '@/data/papers.json';

export type PaperTier = 'essential' | 'recommended' | 'frontier' | 'context';

export type Paper = {
  id: string;
  arxivId?: string;
  title: string;
  authors: string[];
  year: number;
  published: string;
  venue: string;
  url: string;
  category: string;
  tags: string[];
  tier: PaperTier;
  essentialOrder: number | null;
  whyReadZh: string | null;
  sourceCollections: string[];
  lastVerified: string;
};

export type Category = {
  id: string;
  label: string;
  zh: string;
  description: string;
  formula: string;
};

export const categories: Category[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    zh: '基础理论与分数模型',
    description: '从热力学、score matching、SDE 与 continuous normalizing flow 建立统一数学背景。',
    formula: 'score · SDE · ODE',
  },
  {
    id: 'objectives',
    label: 'Objectives',
    zh: '训练目标与参数化',
    description: '噪声日程、预测目标、损失加权、预条件与训练稳定性。',
    formula: 'ε · x₀ · v',
  },
  {
    id: 'sampling',
    label: 'Sampling',
    zh: '采样与数值求解',
    description: 'DDIM、ODE/SDE solver、并行采样与速度—质量权衡。',
    formula: 'NFE ↓ · quality ↑',
  },
  {
    id: 'guidance',
    label: 'Guidance',
    zh: '条件引导与可控生成',
    description: 'classifier-free guidance、结构控制、个性化与图像编辑。',
    formula: 'condition → trajectory',
  },
  {
    id: 'latent',
    label: 'Latent diffusion',
    zh: '潜空间扩散',
    description: '在压缩表示中训练扩散或 flow，以降低大规模生成成本。',
    formula: 'x ↔ z',
  },
  {
    id: 'architectures',
    label: 'Architectures',
    zh: '架构与规模化',
    description: '从 U-Net 到 Diffusion Transformer，以及高分辨率训练和系统扩展。',
    formula: 'U-Net → DiT',
  },
  {
    id: 'distillation',
    label: 'Distillation',
    zh: '蒸馏与少步生成',
    description: 'progressive distillation、consistency、distribution matching 与单步生成。',
    formula: 'many steps → one',
  },
  {
    id: 'flow',
    label: 'Flow matching',
    zh: '流匹配与矫正流',
    description: 'Flow Matching、Conditional Flow Matching、Rectified Flow 与 stochastic interpolants。',
    formula: 'dxₜ / dt = vθ',
  },
  {
    id: 'geometry',
    label: 'Structured spaces',
    zh: '几何、离散与结构数据',
    description: '把 flow matching 推广到流形、离散状态、等变结构与混合空间。',
    formula: 'ℝᵈ → 𝓜 / 𝒱',
  },
  {
    id: 'applications',
    label: 'Applications',
    zh: '视频、音频、三维与科学',
    description: '追踪生成模型在跨模态、机器人、分子、蛋白与时间序列中的迁移。',
    formula: 'image · audio · science',
  },
  {
    id: 'evaluation',
    label: 'Analysis',
    zh: '理论分析与评测',
    description: '泛化、记忆、几何解释、相变以及评测方法。',
    formula: 'quality × cost × risk',
  },
  {
    id: 'surveys',
    label: 'Surveys',
    zh: '综述与教程',
    description: '用于建立全局术语、统一视角和研究问题的入口材料。',
    formula: 'map the field',
  },
];

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<string, Category>;

export const papers = paperData as Paper[];

export const essentialPapers = papers
  .filter((paper) => paper.essentialOrder !== null)
  .sort((a, b) => (a.essentialOrder ?? 99) - (b.essentialOrder ?? 99));

export const latestPapers = [...papers]
  .filter((paper) => paper.published.includes('-'))
  .sort((a, b) => b.published.localeCompare(a.published))
  .slice(0, 6);

export function formatAuthors(authors: string[], limit = 4) {
  if (authors.length <= limit) return authors.join(', ');
  return `${authors.slice(0, limit).join(', ')} +${authors.length - limit}`;
}

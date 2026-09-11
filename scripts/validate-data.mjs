import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const papers = JSON.parse(await readFile(new URL('data/papers.json', root), 'utf8'));

const allowedCategories = new Set([
  'foundations', 'objectives', 'sampling', 'guidance', 'latent', 'architectures',
  'distillation', 'flow', 'geometry', 'applications', 'evaluation', 'surveys',
]);
const allowedTiers = new Set(['essential', 'recommended', 'frontier', 'context']);
const required = [
  'id', 'title', 'authors', 'year', 'published', 'venue', 'url', 'category',
  'tags', 'tier', 'sourceCollections', 'lastVerified',
];
const errors = [];
const seenIds = new Map();
const seenTitles = new Map();

if (papers.length < 80) errors.push(`The seed library should contain at least 80 records; found ${papers.length}.`);

for (const [index, paper] of papers.entries()) {
  const label = paper.id || `record ${index + 1}`;
  for (const field of required) {
    if (paper[field] === undefined || paper[field] === null || paper[field] === '') {
      errors.push(`${label}: missing ${field}.`);
    }
  }
  if (!Array.isArray(paper.authors) || paper.authors.length === 0) errors.push(`${label}: authors must be a non-empty array.`);
  if (!Array.isArray(paper.tags) || paper.tags.length === 0) errors.push(`${label}: tags must be a non-empty array.`);
  if (!Array.isArray(paper.sourceCollections) || paper.sourceCollections.length === 0) errors.push(`${label}: sourceCollections must be a non-empty array.`);
  if (!allowedCategories.has(paper.category)) errors.push(`${label}: unknown category ${paper.category}.`);
  if (!allowedTiers.has(paper.tier)) errors.push(`${label}: unknown tier ${paper.tier}.`);
  if (!/^https:\/\//.test(paper.url)) errors.push(`${label}: URL must use HTTPS.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(paper.published)) errors.push(`${label}: invalid first-posted date ${paper.published}.`);
  if (paper.arxivId && paper.url !== `https://arxiv.org/abs/${paper.arxivId}`) errors.push(`${label}: arXiv URL and arxivId disagree.`);

  if (seenIds.has(paper.id)) errors.push(`${label}: duplicate id (also record ${seenIds.get(paper.id)}).`);
  seenIds.set(paper.id, index + 1);

  const normalizedTitle = paper.title.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (seenTitles.has(normalizedTitle)) errors.push(`${label}: duplicate normalized title (also ${seenTitles.get(normalizedTitle)}).`);
  seenTitles.set(normalizedTitle, label);
}

for (const category of allowedCategories) {
  if (!papers.some((paper) => paper.category === category)) errors.push(`Category ${category} is empty.`);
}

const essential = papers.filter((paper) => paper.tier === 'essential');
const essentialOrder = essential.map((paper) => paper.essentialOrder).sort((a, b) => a - b);
if (essential.length !== 12 || essentialOrder.some((value, index) => value !== index + 1)) {
  errors.push('Core reading path must contain exactly 12 records ordered 1–12.');
}
for (const paper of essential) {
  if (!paper.whyReadZh) errors.push(`${paper.id}: essential paper needs whyReadZh.`);
}

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${papers.length} unique papers across ${allowedCategories.size} categories (${essential.length} core papers).`);

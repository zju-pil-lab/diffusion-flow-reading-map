import type { Metadata } from 'next';
import './globals.css';

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zju-pil-lab.github.io/diffusion-flow-reading-map/',
);
const canonicalUrl = siteUrl.toString();
const iconUrl = new URL('favicon.png', siteUrl);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: 'Diffusion + Flow Reading Map · 扩散模型与流匹配论文导航',
  description: '105 篇扩散模型与 Flow Matching 论文：12 篇核心路径、方法分类、时间筛选与持续更新。',
  alternates: { canonical: canonicalUrl },
  icons: { icon: iconUrl },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteUrl,
    title: 'Diffusion + Flow Reading Map · 扩散模型与流匹配论文导航',
    description: '从 Diffusion 到 Flow：为学生与研究者整理的开放阅读地图。',
    siteName: 'Diffusion + Flow Reading Map',
  },
  twitter: {
    card: 'summary',
    title: 'Diffusion + Flow Reading Map · 扩散模型与流匹配论文导航',
    description: '从 Diffusion 到 Flow：为学生与研究者整理的开放阅读地图。',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

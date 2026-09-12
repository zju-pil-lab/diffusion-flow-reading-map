import resourceData from '@/data/resources.json';

export type ResourceType = 'book' | 'blog' | 'course' | 'tutorial' | 'code';

export type LearningResource = {
  id: string;
  type: ResourceType;
  title: string;
  creators: string[];
  source: string;
  year: number;
  url: string;
  level: string;
  descriptionZh: string;
  tags: string[];
  featured: boolean;
  lastVerified: string;
};

export const resources = resourceData as LearningResource[];

export const resourceTypeLabels: Record<ResourceType, string> = {
  book: 'Book · 专著',
  blog: 'Blog · 长文',
  course: 'Course · 课程',
  tutorial: 'Tutorial · 教程',
  code: 'Code & Lab · 代码',
};

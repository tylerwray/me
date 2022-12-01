interface FrontmatterImage {
  src: string;
  alt: string;
  creditName: string;
  creditUrl: string;
}

export interface Frontmatter {
  minutesToRead: number;
  title: string;
  description: string;
  draft?: boolean
  tags?: string[];
  author: string;
  publishedOn: string;
  image: FrontmatterImage;
}
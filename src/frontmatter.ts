interface FrontmatterImage {
  src: string;
  alt: string;
  creditName: string;
  creditUrl: string;
}

export interface Frontmatter {
  // Injected from plugin
  minutesToRead: number;
  title: string;
  description: string;
  draft?: boolean
  tags?: string[];
  publishedOn: string;
  image: FrontmatterImage;
}
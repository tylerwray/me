interface FrontmatterImage {
  src: string;
  alt: string;
  creditName: string;
  creditUrl: string;
}

export interface Frontmatter {
  title: string;
  description: string;
  draft?: boolean
  tags?: string[];
  author: string;
  publishedOn: string;
  image: FrontmatterImage;
}
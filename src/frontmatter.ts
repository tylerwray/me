interface FrontmatterImage {
  src: string;
  alt: string;
  creditName: string;
  creditUrl: string;
}

export type Tag =
  | "elixir"
  | "phoenix"
  | "javascript"
  | "react"
  | "gatsby"
  | "mdx"
  | "typescript"
  | "tailwind";

export interface Frontmatter {
  // Injected from plugin
  minutesToRead: number;
  title: string;
  description: string;
  draft?: boolean;
  tags?: Tag[];
  publishedOn: string;
  image: FrontmatterImage;
}

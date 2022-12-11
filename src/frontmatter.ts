interface FrontmatterImage {
  src: string;
  alt: string;
  creditName: string;
  creditUrl: string;
}

export type Tag =
  | "elixir"
  | "gatsby"
  | "javascript"
  | "mdx"
  | "phoenix live view"
  | "phoenix"
  | "react"
  | "stripe"
  | "tailwind"
  | "typescript";

export interface Frontmatter {
  // Injected from plugin
  minutesToRead: number;
  title: string;
  description: string;
  draft?: boolean;
  isSubpage?: boolean;
  tags?: Tag[];
  publishedOn: string;
  image: FrontmatterImage;
}

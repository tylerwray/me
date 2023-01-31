export interface FrontmatterImage {
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
  | "personal"
  | "react"
  | "stripe"
  | "tailwind"
  | "typescript";

export interface FrontmatterTutorial {
  title: string;
  slug: string;
  homePage?: boolean
}

export interface Frontmatter {
  // Injected from plugin
  minutesToRead: number;
  title: string;
  description: string;
  draft?: boolean;
  tags?: Tag[];
  publishedOn: string;
  image: FrontmatterImage;
  tutorial?: FrontmatterTutorial
}

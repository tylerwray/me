import { z } from "astro:content";

const TagSchema = z.enum([
  "elixir",
  "gatsby",
  "javascript",
  "mdx",
  "phoenix",
  "personal",
  "react",
  "stripe",
  "tailwindcss",
  "typescript",
]);

const ImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  creditName: z.string(),
  creditUrl: z.string(),
});

export type Step = { href: string; title: string };

export const MinutesToReadSchema = z.number();

export const HeadingsSchema = z.array(
  z.object({
    depth: z.number().min(1).max(6),
    slug: z.string(),
    text: z.string(),
  })
);

export type Headings = z.infer<typeof HeadingsSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type Image = z.infer<typeof ImageSchema>;

export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  draft: z.boolean().optional(),
  tags: z.array(TagSchema),
  publishedOn: z.date(),
  image: ImageSchema,
});

export const tutorialsSchema = blogSchema.extend({
  tutorial: z.object({
    title: z.string(),
    slug: z.string(),
    homePage: z.boolean().optional(),
  }),
});

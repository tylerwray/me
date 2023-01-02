import type { Frontmatter } from "./frontmatter";
import type { MarkdownInstance } from "astro";

export function filterTutorials(tutorials: MarkdownInstance<Frontmatter>[]) {
  return (
    tutorials
      .filter(draftPost)
      // Don't show child pages
      .filter((post) => post.frontmatter.tutorial?.homePage)
      .sort(
        (a, b) =>
          new Date(b.frontmatter.publishedOn).getTime() -
          new Date(a.frontmatter.publishedOn).getTime()
      )
  );
}

export function filterBlogPosts(posts: MarkdownInstance<Frontmatter>[]) {
  return posts
    .filter(draftPost)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedOn).getTime() -
        new Date(a.frontmatter.publishedOn).getTime()
    );
}

function draftPost(post: MarkdownInstance<Frontmatter>) {
  // Exclude draft posts in production
  if (import.meta.env.PROD) {
    return !post.frontmatter.draft;
  }

  return true;
}

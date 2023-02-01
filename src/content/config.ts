import { defineCollection, z } from "astro:content";
import { blogSchema, tutorialsSchema } from "../schemas";

const blogCollection = defineCollection({ schema: blogSchema });
const tutorialsCollection = defineCollection({ schema: tutorialsSchema });

export const collections = {
  blog: blogCollection,
  tutorials: tutorialsCollection,
};

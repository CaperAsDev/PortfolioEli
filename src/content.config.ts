import { defineCollection, z, reference, type SchemaContext } from "astro:content";
import { glob, file } from "astro/loaders";

const BlogsSchema = ({image}: SchemaContext) =>z.object({
    lang: z.enum(["es", "en", "pt"]),
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: reference("authors"),
    tags: z.array(z.string()),
    slug: z.string().optional(),
    cover: image(),
  })

// Define the collections

// Blogs
const science = defineCollection({
  loader: glob({pattern: "**/*.{mdx,md}", base: "src/blogs/science"}),
  schema: BlogsSchema,
});
const education = defineCollection({
  loader: glob({pattern: "**/*.{mdx,md}", base: "src/blogs/education"}),
  schema: BlogsSchema,
});
const social = defineCollection({
  loader: glob({pattern: "**/*.{mdx,md}", base: "src/blogs/social"}),
  schema: BlogsSchema
});

// Books
const books = defineCollection({
  loader: glob({pattern: "**/*.{mdx,md}", base: "src/blogs/books"}),
  schema: z.object({
    lang: z.enum(["es", "en", "pt"]),
    isbn: z.number(),
    intro: z.string(),
  }),
});

// Authors
const authors = defineCollection({
  loader: file("src/data/authors/index.json"),
  schema: ({image}) => z.object({
    id: z.string(),
    name: z.string(),
    lastName: z.string(),
    city: z.string(),
    country: z.object({
      es: z.string(),
      en: z.string(),
      pt: z.string(),
    }),
    occupation: z.object({
      es: z.string(),
      en: z.string(),
      pt: z.string(),
    }),
    email: z.string(),
    social: z.array(
      z.object({
        label: z.string(),
        icon: z.string(),
        link: z.string().nullable(),
      })
    ),
    bio: z.string().nullable(),
    avatar: image(),
    website: z.string().nullable()
  }),
});

export const collections = {
  science,
  books,
  education,
  social,
  authors,
};
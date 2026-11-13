import blogsData from "@/data/blogs.json";

export type BlogAuthor = {
  name: string;
  role: string;
  avatar: string;
};

export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: BlogAuthor;
  tags: string[];
  content: BlogContentBlock[];
  relatedProductSlug?: string;
};

export function getAllBlogs(): BlogPost[] {
  return blogsData as BlogPost[];
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  const blogs = getAllBlogs();
  return blogs.find((blog) => blog.slug === slug);
}

export function getRecentBlogs(limit: number = 3): BlogPost[] {
  return getAllBlogs().slice(0, limit);
}

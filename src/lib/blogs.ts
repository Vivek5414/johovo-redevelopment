import blogsData from "@/data/blogs.json";
import { getProductBySlug } from "@/lib/products-db";

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

async function resolveBlogCoverImage(blog: BlogPost): Promise<string> {
  if (blog.coverImage?.startsWith("/blog/")) {
    return blog.coverImage;
  }

  if (!blog.relatedProductSlug) {
    return blog.coverImage;
  }

  try {
    const product = await getProductBySlug(blog.relatedProductSlug);
    const coverFromProduct =
      product?.productImages.find((image) => image.src && image.role !== "ingredient")?.src ??
      product?.showcaseImage ??
      product?.productImages[0]?.src;

    if (coverFromProduct) {
      return coverFromProduct;
    }
  } catch {
    // fall back to the original blog cover image below
  }

  return blog.coverImage;
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  const blogs = blogsData as BlogPost[];

  return Promise.all(
    blogs.map(async (blog) => ({
      ...blog,
      coverImage: await resolveBlogCoverImage(blog),
    })),
  );
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const blogs = await getAllBlogs();
  return blogs.find((blog) => blog.slug === slug);
}

export async function getRecentBlogs(limit: number = 3): Promise<BlogPost[]> {
  return (await getAllBlogs()).slice(0, limit);
}

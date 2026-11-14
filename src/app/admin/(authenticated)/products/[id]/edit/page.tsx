import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { sql } from "@/lib/db";
import { EditProductForm } from "./edit-product-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    title: `Edit Product #${id} | Admin Dashboard`,
  };
}

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) {
    notFound();
  }

  const rows = await sql`
    SELECT
      id,
      name,
      slug,
      brand,
      sku,
      category,
      selling_price,
      mrp,
      net_quantity,
      short_description,
      full_description,
      ingredients,
      benefits,
      usage_instructions,
      image_url,
      drive_file_id,
      gallery_images,
      videos,
      amazon_url,
      flipkart_url
    FROM custom_products
    WHERE id = ${productId}
    LIMIT 1;
  `;

  if (!rows || rows.length === 0) {
    notFound();
  }

  const p = rows[0];
  const initialProduct = {
    id: Number(p.id),
    name: String(p.name || ""),
    slug: String(p.slug || ""),
    brand: String(p.brand || "JOHOVO"),
    sku: String(p.sku || ""),
    category: String(p.category || "Face Care"),
    selling_price: Number(p.selling_price || 0),
    mrp: Number(p.mrp || 0),
    net_quantity: String(p.net_quantity || "Standard"),
    short_description: String(p.short_description || ""),
    full_description: String(p.full_description || ""),
    ingredients: String(p.ingredients || ""),
    benefits: String(p.benefits || ""),
    usage_instructions: String(p.usage_instructions || ""),
    image_url: String(p.image_url || ""),
    drive_file_id: String(p.drive_file_id || ""),
    gallery_images: Array.isArray(p.gallery_images) ? p.gallery_images : [],
    videos: Array.isArray(p.videos) ? p.videos : [],
    amazon_url: String(p.amazon_url || ""),
    flipkart_url: String(p.flipkart_url || ""),
  };

  return <EditProductForm initialProduct={initialProduct} />;
}

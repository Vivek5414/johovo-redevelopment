import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { getOrCreateFolder, uploadFileToDrive } from "@/lib/drive";
import { logServiceError, retryTransientRequest } from "@/lib/upload-service";

export async function ensureProductsTable() {
  await retryTransientRequest(async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS custom_products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        brand VARCHAR(120) NOT NULL DEFAULT 'JOHOVO',
        sku VARCHAR(100),
        category VARCHAR(150) NOT NULL DEFAULT 'General',
        selling_price NUMERIC(10,2) NOT NULL DEFAULT 0,
        mrp NUMERIC(10,2) NOT NULL DEFAULT 0,
        net_quantity VARCHAR(100) DEFAULT 'Standard',
        short_description TEXT,
        full_description TEXT,
        ingredients TEXT,
        benefits TEXT,
        usage_instructions TEXT,
        image_url TEXT,
        drive_file_id VARCHAR(255),
        gallery_images JSONB DEFAULT '[]'::jsonb,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_custom_products_slug ON custom_products(slug);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_custom_products_created_at ON custom_products(created_at DESC);`;
  });
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * GET /api/admin/products
 * Fetches all custom products created in Neon DB
 */
export async function GET() {
  try {
    await requireAdmin();
    await ensureProductsTable();

    const rows = await retryTransientRequest(async () => sql`
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
        is_active,
        created_at,
        updated_at
      FROM custom_products
      ORDER BY created_at DESC;
    `);

    return NextResponse.json({
      success: true,
      products: rows.map((r: any) => ({
        ...r,
        id: Number(r.id),
        selling_price: Number(r.selling_price || 0),
        mrp: Number(r.mrp || 0),
      })),
    });
  } catch (error: any) {
    console.error("Failed to fetch custom products:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Creates a new product: uploads image to Google Drive under "products/<ProductName>"
 * and persists all fields to Neon PostgreSQL table `custom_products`.
 */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    await ensureProductsTable();

    const formData = await req.formData();
    const name = (formData.get("name") as string)?.trim();
    const brand = (formData.get("brand") as string)?.trim() || "JOHOVO";
    const category = (formData.get("category") as string)?.trim() || "Herbal Care";
    const sku = (formData.get("sku") as string)?.trim() || "";
    const sellingPrice = Number(formData.get("sellingPrice") || 0);
    const mrp = Number(formData.get("mrp") || sellingPrice);
    const netQuantity = (formData.get("netQuantity") as string)?.trim() || "Standard";
    const shortDescription = (formData.get("shortDescription") as string)?.trim() || "";
    const fullDescription = (formData.get("fullDescription") as string)?.trim() || "";
    const ingredients = (formData.get("ingredients") as string)?.trim() || "";
    const benefits = (formData.get("benefits") as string)?.trim() || "";
    const usageInstructions = (formData.get("usageInstructions") as string)?.trim() || "";
    const file = formData.get("image") as File | null;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!sellingPrice || sellingPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "A valid selling price is required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    if (!baseSlug) baseSlug = `product-${Date.now()}`;
    let finalSlug = baseSlug;

    // Check slug collision
    const existing = await sql`
      SELECT id FROM custom_products WHERE slug = ${finalSlug} LIMIT 1;
    `;
    if (existing && existing.length > 0) {
      finalSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    let imageUrl = "/images/products/iyalmooligai-herbal-hair-oil.png";
    let driveFileId = "";

    // If an image was uploaded, store it in Google Drive under products/<ProductName>
    if (file && file.size > 0) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1. Get or create "products" parent folder inside root Google Drive folder
        const productsParentFolderId = await getOrCreateFolder("products");

        // 2. Get or create the specific product's subfolder inside "products"
        const targetFolderId = await getOrCreateFolder(name, productsParentFolderId);

        // 3. Upload file to that subfolder
        const driveResult = await uploadFileToDrive({
          fileName: file.name,
          mimeType: file.type || "image/jpeg",
          buffer,
          folderId: targetFolderId,
        });

        driveFileId = driveResult.fileId;
        // Direct view/embed link or preview URL
        imageUrl = driveResult.previewUrl;

        // Also record to product_files for historical traceability
        await sql`
          INSERT INTO product_files (product_name, file_name, file_id, mime_type, file_size, preview_url, download_url)
          VALUES (${name}, ${file.name}, ${driveResult.fileId}, ${file.type || "image/jpeg"}, ${file.size}, ${driveResult.previewUrl}, ${driveResult.downloadUrl});
        `;
      } catch (driveErr) {
        logServiceError("[admin-products] Failed to upload image to Google Drive", driveErr);
        // Fall back gracefully if Drive throws an auth error
      }
    }

    // Insert into Neon custom_products
    const insertResult = await sql`
      INSERT INTO custom_products (
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
        drive_file_id
      ) VALUES (
        ${name},
        ${finalSlug},
        ${brand},
        ${sku || `JH-${Math.floor(100000 + Math.random() * 900000)}`},
        ${category},
        ${sellingPrice},
        ${mrp},
        ${netQuantity},
        ${shortDescription},
        ${fullDescription},
        ${ingredients},
        ${benefits},
        ${usageInstructions},
        ${imageUrl},
        ${driveFileId}
      )
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Product created and saved to Neon and Google Drive successfully!",
      product: insertResult[0],
    });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

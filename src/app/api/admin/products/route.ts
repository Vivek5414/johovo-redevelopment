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
        videos JSONB DEFAULT '[]'::jsonb,
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
        videos,
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
        gallery_images: Array.isArray(r.gallery_images) ? r.gallery_images : [],
        videos: Array.isArray(r.videos) ? r.videos : [],
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
 * Creates a new product: uploads primary image + multiple gallery images + videos to Google Drive
 * and saves structured data to Neon PostgreSQL table `custom_products`.
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

    // Primary image file
    const primaryFile = formData.get("image") as File | null;
    // Multiple gallery images
    const galleryFiles = formData.getAll("gallery_images") as File[];
    // Video files uploaded to Google Drive
    const videoFiles = formData.getAll("video_files") as File[];

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

    const existing = await sql`
      SELECT id FROM custom_products WHERE slug = ${finalSlug} LIMIT 1;
    `;
    if (existing && existing.length > 0) {
      finalSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    let imageUrl = "/images/products/iyalmooligai-herbal-hair-oil.png";
    let driveFileId = "";
    const galleryImages: { url: string; drive_file_id: string; name: string }[] = [];
    const videos: { url: string; drive_file_id?: string; title?: string }[] = [];

    // Prepare Google Drive product target folder
    let targetFolderId: string | undefined;
    try {
      const productsParentFolderId = await getOrCreateFolder("products");
      targetFolderId = await getOrCreateFolder(name, productsParentFolderId);
    } catch (fErr) {
      logServiceError("[admin-products] Could not create target Drive folder", fErr);
    }

    // 1. Upload Primary Image
    if (primaryFile && primaryFile.size > 0 && targetFolderId) {
      try {
        const arrayBuffer = await primaryFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const driveResult = await uploadFileToDrive({
          fileName: primaryFile.name,
          mimeType: primaryFile.type || "image/jpeg",
          buffer,
          folderId: targetFolderId,
        });

        driveFileId = driveResult.fileId;
        imageUrl = driveResult.previewUrl;

        await sql`
          INSERT INTO product_files (product_name, file_name, file_id, mime_type, file_size, preview_url, download_url)
          VALUES (${name}, ${primaryFile.name}, ${driveResult.fileId}, ${primaryFile.type || "image/jpeg"}, ${primaryFile.size}, ${driveResult.previewUrl}, ${driveResult.downloadUrl});
        `;
      } catch (driveErr) {
        logServiceError("[admin-products] Failed to upload primary image to Google Drive", driveErr);
      }
    }

    // 2. Upload Multiple Gallery Images
    if (galleryFiles && galleryFiles.length > 0 && targetFolderId) {
      for (const gFile of galleryFiles) {
        if (gFile && gFile.size > 0) {
          try {
            const buf = Buffer.from(await gFile.arrayBuffer());
            const gRes = await uploadFileToDrive({
              fileName: gFile.name,
              mimeType: gFile.type || "image/jpeg",
              buffer: buf,
              folderId: targetFolderId,
            });

            galleryImages.push({
              url: gRes.previewUrl,
              drive_file_id: gRes.fileId,
              name: gFile.name,
            });

            await sql`
              INSERT INTO product_files (product_name, file_name, file_id, mime_type, file_size, preview_url, download_url)
              VALUES (${name}, ${gFile.name}, ${gRes.fileId}, ${gFile.type || "image/jpeg"}, ${gFile.size}, ${gRes.previewUrl}, ${gRes.downloadUrl});
            `;
          } catch (gErr) {
            logServiceError(`[admin-products] Failed to upload gallery image ${gFile.name}`, gErr);
          }
        }
      }
    }

    // 3. Upload Video Files (MP4, WebM, etc.) to Google Drive
    if (videoFiles && videoFiles.length > 0 && targetFolderId) {
      for (const vFile of videoFiles) {
        if (vFile && vFile.size > 0) {
          try {
            const buf = Buffer.from(await vFile.arrayBuffer());
            const vRes = await uploadFileToDrive({
              fileName: vFile.name,
              mimeType: vFile.type || "video/mp4",
              buffer: buf,
              folderId: targetFolderId,
            });

            videos.push({
              url: vRes.previewUrl,
              drive_file_id: vRes.fileId,
              title: vFile.name,
            });

            await sql`
              INSERT INTO product_files (product_name, file_name, file_id, mime_type, file_size, preview_url, download_url)
              VALUES (${name}, ${vFile.name}, ${vRes.fileId}, ${vFile.type || "video/mp4"}, ${vFile.size}, ${vRes.previewUrl}, ${vRes.downloadUrl});
            `;
          } catch (vErr) {
            logServiceError(`[admin-products] Failed to upload video file ${vFile.name}`, vErr);
          }
        }
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
        drive_file_id,
        gallery_images,
        videos
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
        ${driveFileId},
        ${JSON.stringify(galleryImages)}::jsonb,
        ${JSON.stringify(videos)}::jsonb
      )
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Product created with multi-image & video assets synced to Google Drive and Neon!",
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

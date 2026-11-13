import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { getOrCreateFolder, uploadFileToDrive } from "@/lib/drive";
import { logServiceError, retryTransientRequest } from "@/lib/upload-service";

type Params = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/admin/products/[id]
 * Fetch single product details by id
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

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
        is_active,
        created_at,
        updated_at
      FROM custom_products
      WHERE id = ${productId}
      LIMIT 1;
    `);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: {
        ...rows[0],
        id: Number(rows[0].id),
        selling_price: Number(rows[0].selling_price || 0),
        mrp: Number(rows[0].mrp || 0),
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products/[id]
 * Updates product details and optionally uploads a new image to Google Drive
 */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    // Fetch existing product
    const existing = await sql`
      SELECT * FROM custom_products WHERE id = ${productId} LIMIT 1;
    `;

    if (!existing || existing.length === 0) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const currentProduct = existing[0];
    const formData = await req.formData();

    const name = (formData.get("name") as string)?.trim() || currentProduct.name;
    const brand = (formData.get("brand") as string)?.trim() || currentProduct.brand;
    const category = (formData.get("category") as string)?.trim() || currentProduct.category;
    const sku = (formData.get("sku") as string)?.trim() || currentProduct.sku;
    const sellingPrice = Number(formData.get("sellingPrice") || currentProduct.selling_price);
    const mrp = Number(formData.get("mrp") || currentProduct.mrp);
    const netQuantity = (formData.get("netQuantity") as string)?.trim() || currentProduct.net_quantity;
    const shortDescription = (formData.get("shortDescription") as string)?.trim() ?? currentProduct.short_description;
    const fullDescription = (formData.get("fullDescription") as string)?.trim() ?? currentProduct.full_description;
    const ingredients = (formData.get("ingredients") as string)?.trim() ?? currentProduct.ingredients;
    const benefits = (formData.get("benefits") as string)?.trim() ?? currentProduct.benefits;
    const usageInstructions = (formData.get("usageInstructions") as string)?.trim() ?? currentProduct.usage_instructions;
    const file = formData.get("image") as File | null;

    let imageUrl = currentProduct.image_url;
    let driveFileId = currentProduct.drive_file_id;

    // If new image uploaded, upload to Google Drive
    if (file && file.size > 0) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const productsParentFolderId = await getOrCreateFolder("products");
        const targetFolderId = await getOrCreateFolder(name, productsParentFolderId);

        const driveResult = await uploadFileToDrive({
          fileName: file.name,
          mimeType: file.type || "image/jpeg",
          buffer,
          folderId: targetFolderId,
        });

        driveFileId = driveResult.fileId;
        imageUrl = driveResult.previewUrl;

        await sql`
          INSERT INTO product_files (product_name, file_name, file_id, mime_type, file_size, preview_url, download_url)
          VALUES (${name}, ${file.name}, ${driveResult.fileId}, ${file.type || "image/jpeg"}, ${file.size}, ${driveResult.previewUrl}, ${driveResult.downloadUrl});
        `;
      } catch (driveErr) {
        logServiceError("[admin-products] Failed to upload updated image to Google Drive", driveErr);
      }
    }

    const updated = await sql`
      UPDATE custom_products
      SET
        name = ${name},
        brand = ${brand},
        category = ${category},
        sku = ${sku},
        selling_price = ${sellingPrice},
        mrp = ${mrp},
        net_quantity = ${netQuantity},
        short_description = ${shortDescription},
        full_description = ${fullDescription},
        ingredients = ${ingredients},
        benefits = ${benefits},
        usage_instructions = ${usageInstructions},
        image_url = ${imageUrl},
        drive_file_id = ${driveFileId},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${productId}
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Product updated successfully!",
      product: updated[0],
    });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Deletes a custom product from Neon DB
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM custom_products
      WHERE id = ${productId}
      RETURNING id, name;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, error: "Product not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Product "${result[0].name}" successfully deleted from catalog!`,
      deletedId: result[0].id,
    });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

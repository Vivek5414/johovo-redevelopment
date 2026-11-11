import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getOrCreateFolder, uploadFileToDrive } from '@/lib/drive';

// Ensure table exists
async function ensureProductTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS product_files (
      id SERIAL PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_id VARCHAR(255) NOT NULL,
      mime_type VARCHAR(120),
      file_size BIGINT,
      preview_url TEXT NOT NULL,
      download_url TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function GET(req: NextRequest) {
  try {
    await ensureProductTable();
    const { searchParams } = new URL(req.url);
    const productName = searchParams.get('product_name');

    let rows;
    if (productName) {
      rows = await sql`
        SELECT id, product_name, file_name, file_id, mime_type, file_size, preview_url, download_url, created_at
        FROM product_files
        WHERE product_name ILIKE ${'%' + productName + '%'}
        ORDER BY created_at DESC;
      `;
    } else {
      rows = await sql`
        SELECT id, product_name, file_name, file_id, mime_type, file_size, preview_url, download_url, created_at
        FROM product_files
        ORDER BY created_at DESC
        LIMIT 50;
      `;
    }

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('Error fetching product files:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureProductTable();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const productName = formData.get('product_name') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!productName || !productName.trim()) {
      return NextResponse.json({ success: false, error: 'Product name is required' }, { status: 400 });
    }

    const trimmedProductName = productName.trim();

    // 1. Get or create "products" parent folder inside root Google Drive folder
    const productsParentFolderId = await getOrCreateFolder('products');

    // 2. Get or create the specific product's subfolder inside "products"
    const targetFolderId = await getOrCreateFolder(trimmedProductName, productsParentFolderId);

    // 3. Upload file to that subfolder
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { fileId, previewUrl, downloadUrl } = await uploadFileToDrive({
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      buffer,
      folderId: targetFolderId,
    });

    // 4. Save metadata to Neon DB
    const insertResult = await sql`
      INSERT INTO product_files (product_name, file_name, file_id, mime_type, file_size, preview_url, download_url)
      VALUES (${trimmedProductName}, ${file.name}, ${fileId}, ${file.type || 'application/octet-stream'}, ${file.size}, ${previewUrl}, ${downloadUrl})
      RETURNING id, product_name, file_name, file_id, mime_type, file_size, preview_url, download_url, created_at;
    `;

    return NextResponse.json({
      success: true,
      message: `File uploaded to products/${trimmedProductName} and saved to Neon!`,
      data: insertResult[0],
    });
  } catch (error: any) {
    console.error('Error in /api/products/upload:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

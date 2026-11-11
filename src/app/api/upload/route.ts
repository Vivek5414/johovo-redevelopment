import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { uploadFileToDrive } from '@/lib/drive';

// Ensure table exists on first run
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS uploaded_files (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      file_id VARCHAR(255) NOT NULL,
      mime_type VARCHAR(120),
      file_size BIGINT,
      preview_url TEXT NOT NULL,
      download_url TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`
      SELECT id, name, file_id, mime_type, file_size, preview_url, download_url, created_at
      FROM uploaded_files
      ORDER BY created_at DESC
      LIMIT 50;
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('Error fetching uploaded files:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Google Drive root folder (GOOGLE_DRIVE_FOLDER_ID)
    const { fileId, previewUrl, downloadUrl } = await uploadFileToDrive({
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      buffer,
    });

    // Save metadata to Neon DB
    const insertResult = await sql`
      INSERT INTO uploaded_files (name, file_id, mime_type, file_size, preview_url, download_url)
      VALUES (${file.name}, ${fileId}, ${file.type || 'application/octet-stream'}, ${file.size}, ${previewUrl}, ${downloadUrl})
      RETURNING id, name, file_id, mime_type, file_size, preview_url, download_url, created_at;
    `;

    return NextResponse.json({
      success: true,
      message: 'File successfully uploaded and stored!',
      data: insertResult[0],
    });
  } catch (error: any) {
    console.error('Error in /api/upload:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getDriveClient } from "@/lib/drive";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    if (!fileId) {
      return new NextResponse("File ID required", { status: 400 });
    }

    const drive = getDriveClient();

    // 1. Get metadata for content-type and caching
    const metaRes = await drive.files.get({
      fileId,
      fields: "id, name, mimeType, size",
    });

    const mimeType = metaRes.data.mimeType || "image/jpeg";

    // 2. Stream the file content directly from Google Drive
    const mediaRes = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    const stream = mediaRes.data as unknown as Readable;

    // Convert Node.js readable stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        stream.on("end", () => {
          controller.close();
        });
        stream.on("error", (err) => {
          controller.error(err);
        });
      },
      cancel() {
        stream.destroy();
      },
    });

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("[drive-image-proxy] Failed to serve file from Google Drive:", error);
    return new NextResponse("Failed to load image from Drive", { status: 404 });
  }
}

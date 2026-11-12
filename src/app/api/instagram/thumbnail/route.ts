import { generateInstagramImageUrlFromUrl } from "@/lib/instagram";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return Response.json({ error: "Missing instagram url" }, { status: 400 });
  }

  try {
    const thumbnail = await generateInstagramImageUrlFromUrl(targetUrl);

    if (!thumbnail) {
      return Response.json({ error: "No thumbnail found" }, { status: 404 });
    }

    return Response.json({ thumbnail });
  } catch {
    return Response.json({ error: "Failed to fetch Instagram thumbnail" }, { status: 500 });
  }
}

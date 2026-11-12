export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return Response.json({ error: "Missing image URL" }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        accept: "image/*,*/*;q=0.8",
        "user-agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json({ error: "Failed to fetch Instagram image" }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch {
    return Response.json({ error: "Failed to proxy Instagram image" }, { status: 500 });
  }
}

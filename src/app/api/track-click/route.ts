import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sql } from "@/lib/db";

// Table setup for tracking clicks
async function ensureTrackingTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS whatsapp_clicks (
      id SERIAL PRIMARY KEY,
      page_url TEXT NOT NULL,
      ip_address VARCHAR(100),
      browser VARCHAR(150),
      machine VARCHAR(150),
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS call_clicks (
      id SERIAL PRIMARY KEY,
      page_url TEXT NOT NULL,
      ip_address VARCHAR(100),
      browser VARCHAR(150),
      machine VARCHAR(150),
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

// User-agent parser helper
function parseUserAgent(ua: string): { browser: string; machine: string } {
  if (!ua) return { browser: "Unknown Browser", machine: "Unknown Device" };

  // Parse Machine / Device / OS
  let machine = "Desktop (Other)";
  if (/android/i.test(ua)) {
    machine = "Mobile (Android)";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    machine = /ipad/i.test(ua) ? "Tablet (iPad)" : "Mobile (iPhone)";
  } else if (/windows nt/i.test(ua)) {
    machine = "Desktop (Windows)";
  } else if (/macintosh|mac os x/i.test(ua)) {
    machine = "Desktop (macOS)";
  } else if (/linux/i.test(ua)) {
    machine = "Desktop (Linux)";
  }

  // Parse Browser
  let browser = "Other Browser";
  if (/edg\//i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/opr\/|opera/i.test(ua)) {
    browser = "Opera";
  } else if (/chrome|crios/i.test(ua)) {
    browser = "Google Chrome";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Mozilla Firefox";
  } else if (/safari/i.test(ua)) {
    browser = "Apple Safari";
  }

  return { browser, machine };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, pageUrl } = body;

    if (!type || (type !== "whatsapp" && type !== "call")) {
      return NextResponse.json(
        { error: "Invalid click type. Must be 'whatsapp' or 'call'." },
        { status: 400 }
      );
    }

    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "";
    
    // Extract client IP address (supporting standard proxies, Cloudflare, etc.)
    const forwardedFor = headerList.get("x-forwarded-for");
    const realIp = headerList.get("x-real-ip");
    const cfConnectingIp = headerList.get("cf-connecting-ip");
    const ipAddress = (cfConnectingIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : null) || realIp || "127.0.0.1").slice(0, 100);

    const { browser, machine } = parseUserAgent(userAgent);
    const cleanPageUrl = String(pageUrl || "/").trim();

    await ensureTrackingTables();

    let result;
    if (type === "whatsapp") {
      result = await sql`
        INSERT INTO whatsapp_clicks (page_url, ip_address, browser, machine, user_agent)
        VALUES (${cleanPageUrl}, ${ipAddress}, ${browser}, ${machine}, ${userAgent})
        RETURNING id, created_at;
      `;
    } else {
      result = await sql`
        INSERT INTO call_clicks (page_url, ip_address, browser, machine, user_agent)
        VALUES (${cleanPageUrl}, ${ipAddress}, ${browser}, ${machine}, ${userAgent})
        RETURNING id, created_at;
      `;
    }

    return NextResponse.json(
      {
        success: true,
        type,
        clickId: result[0]?.id,
        recordedAt: result[0]?.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error logging click tracking event:", error);
    return NextResponse.json(
      { error: "Failed to record click." },
      { status: 500 }
    );
  }
}

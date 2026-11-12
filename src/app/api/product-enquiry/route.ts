import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Ensure table exists on Neon database
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS product_enquiries (
      id SERIAL PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productName, name, email, phone, message } = body;

    if (!productName || typeof productName !== "string" || !productName.trim()) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const cleanProductName = productName.trim();
    const cleanName = name.trim();
    const cleanEmail = email && typeof email === "string" && email.trim() ? email.trim() : null;
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();

    // Ensure the table exists
    await ensureTable();

    // Insert into product_enquiries table in Neon
    const result = await sql`
      INSERT INTO product_enquiries (product_name, name, email, phone, message)
      VALUES (${cleanProductName}, ${cleanName}, ${cleanEmail}, ${cleanPhone}, ${cleanMessage})
      RETURNING id, created_at;
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Product enquiry submitted successfully.",
        enquiryId: result[0]?.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving product enquiry to Neon:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again later." },
      { status: 500 }
    );
  }
}

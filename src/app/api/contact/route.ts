import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, product, message } = body;

    // Validate required fields
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

    const cleanName = name.trim();
    const cleanEmail = email && typeof email === "string" && email.trim() ? email.trim() : null;
    const cleanPhone = phone.trim();
    const cleanProduct = product && typeof product === "string" && product.trim() ? product.trim() : null;
    const cleanMessage = message && typeof message === "string" && message.trim() ? message.trim() : null;

    // Insert into Neon Database
    const result = await sql`
      INSERT INTO contact_enquiries (name, email, phone, product, message)
      VALUES (${cleanName}, ${cleanEmail}, ${cleanPhone}, ${cleanProduct}, ${cleanMessage})
      RETURNING id, created_at;
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
        enquiryId: result[0]?.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact enquiry to Neon:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again later." },
      { status: 500 }
    );
  }
}

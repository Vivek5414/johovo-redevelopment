import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

async function createAdmin() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const adminName = process.env.ADMIN_NAME?.trim() || "JOHOVO Administrator";
  const adminEmail = process.env.ADMIN_EMAIL?.trim()?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!databaseUrl) {
    console.error("Error: DATABASE_URL is required in environment variables.");
    process.exit(1);
  }

  if (!adminEmail || !adminPassword) {
    console.error("Error: ADMIN_EMAIL and ADMIN_PASSWORD are required in environment variables.");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log("Checking Neon database connection and admins table...");

  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'admin',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      last_login_at TIMESTAMPTZ
    );
  `;

  // Check if admin already exists
  const existing = await sql`
    SELECT id, email, role, is_active FROM admins WHERE email = ${adminEmail};
  `;

  if (existing.length > 0) {
    console.log(`Notice: Admin record for email "${adminEmail}" already exists. (ID: ${existing[0].id})`);
    console.log("Existing admin password was NOT overwritten.");
    process.exit(0);
  }

  // Hash password using bcrypt
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  const inserted = await sql`
    INSERT INTO admins (name, email, password_hash, role, is_active)
    VALUES (${adminName}, ${adminEmail}, ${passwordHash}, 'admin', TRUE)
    RETURNING id, name, email, role, is_active, created_at;
  `;

  console.log("✓ Initial administrator created successfully!");
  console.log({
    id: inserted[0].id,
    name: inserted[0].name,
    email: inserted[0].email,
    role: inserted[0].role,
    isActive: inserted[0].is_active,
    createdAt: inserted[0].created_at,
  });
}

createAdmin().catch((err) => {
  console.error("Admin initialization failed:", err);
  process.exit(1);
});

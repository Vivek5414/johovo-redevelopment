import jwt from "jsonwebtoken";

export const ADMIN_COOKIE_NAME = "johovo_admin_token";

export type AdminJwtPayload = {
  sub: string; // admin UUID
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET is not configured in environment variables.");
  }
  return secret;
}

export function signAdminToken(admin: { id: string; email: string; name: string; role: string }): string {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN?.trim() || "1d";

  return jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
    secret,
    { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] }
  );
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as AdminJwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

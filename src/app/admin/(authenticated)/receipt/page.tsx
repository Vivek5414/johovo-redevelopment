import { requireAdmin } from "@/lib/auth/admin-auth";
import { catalogProducts } from "@/lib/catalog/migrated-catalog";
import { ReceiptClient } from "./receipt-client";

export const dynamic = "force-dynamic";

export default async function AdminReceiptPage() {
  await requireAdmin();

  const products = catalogProducts.map((p) => ({
    name: p.name,
    price: p.sellingPrice || 720,
  }));

  return <ReceiptClient products={products} />;
}

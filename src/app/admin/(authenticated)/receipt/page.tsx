import { requireAdmin } from "@/lib/auth/admin-auth";
import { getAllProducts } from "@/lib/products-db";
import { ReceiptClient } from "./receipt-client";

export const dynamic = "force-dynamic";

export default async function AdminReceiptPage() {
  await requireAdmin();

  const allProducts = await getAllProducts();
  const products = allProducts.map((p) => ({
    name: p.name,
    price: p.sellingPrice || 720,
  }));

  return <ReceiptClient products={products} />;
}

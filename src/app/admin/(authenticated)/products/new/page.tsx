import { requireAdmin } from "@/lib/auth/admin-auth";
import { NewProductForm } from "./new-product-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add New Product | Admin Dashboard",
  description: "Create and publish new products with Google Drive asset upload and Neon DB integration.",
};

export default async function NewProductPage() {
  await requireAdmin();
  return <NewProductForm />;
}

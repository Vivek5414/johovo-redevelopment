"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import styles from "../../new/new-product.module.css";

type EditProductFormProps = {
  initialProduct: {
    id: number;
    name: string;
    slug: string;
    brand: string;
    sku: string;
    category: string;
    selling_price: number;
    mrp: number;
    net_quantity: string;
    short_description: string;
    full_description: string;
    ingredients: string;
    benefits: string;
    usage_instructions: string;
    image_url: string;
    drive_file_id: string;
  };
};

export function EditProductForm({ initialProduct }: EditProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialProduct.name || "");
  const [brand, setBrand] = useState(initialProduct.brand || "JOHOVO");
  const [category, setCategory] = useState(initialProduct.category || "Face Care");
  const [sku, setSku] = useState(initialProduct.sku || "");
  const [sellingPrice, setSellingPrice] = useState(String(initialProduct.selling_price || ""));
  const [mrp, setMrp] = useState(String(initialProduct.mrp || ""));
  const [netQuantity, setNetQuantity] = useState(initialProduct.net_quantity || "100g");
  const [shortDescription, setShortDescription] = useState(initialProduct.short_description || "");
  const [fullDescription, setFullDescription] = useState(initialProduct.full_description || "");
  const [ingredients, setIngredients] = useState(initialProduct.ingredients || "");
  const [benefits, setBenefits] = useState(initialProduct.benefits || "");
  const [usageInstructions, setUsageInstructions] = useState(initialProduct.usage_instructions || "");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(initialProduct.image_url || null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(initialProduct.image_url || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatus({ type: "error", message: "Please enter a product title." });
      return;
    }
    if (!sellingPrice || Number(sellingPrice) <= 0) {
      setStatus({ type: "error", message: "Please enter a valid selling price." });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("sku", sku);
      formData.append("sellingPrice", sellingPrice);
      formData.append("mrp", mrp || sellingPrice);
      formData.append("netQuantity", netQuantity);
      formData.append("shortDescription", shortDescription);
      formData.append("fullDescription", fullDescription);
      formData.append("ingredients", ingredients);
      formData.append("benefits", benefits);
      formData.append("usageInstructions", usageInstructions);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch(`/api/admin/products/${initialProduct.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update product");
      }

      setStatus({
        type: "success",
        message: "Product updated successfully!",
      });

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      console.error("Product update failed:", err);
      setStatus({
        type: "error",
        message: err?.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from the catalog?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${initialProduct.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      alert(err?.message || "Failed to delete product");
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Edit Product: {initialProduct.name}</h1>
          <p className={styles.desc}>
            Update pricing, formulations, and imagery synced across Google Drive and Neon DB.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            disabled={isDeleting}
            onClick={handleDelete}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-danger)",
              background: "var(--color-danger-surface)",
              color: "var(--color-danger-text)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
            type="button"
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
            <span>{isDeleting ? "Deleting..." : "Delete Product"}</span>
          </button>
          <Link className={styles.backBtn} href="/admin/products">
            <ArrowBackRoundedIcon fontSize="small" />
            <span>Back to Catalog</span>
          </Link>
        </div>
      </div>

      {status && (
        <div
          className={`${styles.statusMessage} ${
            status.type === "success" ? styles.statusSuccess : styles.statusError
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Form Card */}
      <form className={styles.formCard} onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <div className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <SpaRoundedIcon className={styles.sectionIcon} />
            <span>Product Identity &amp; Categorization</span>
          </h2>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Product Title / Name <span style={{ color: "var(--color-brand-pink)" }}>*</span>
              </label>
              <input
                className={styles.input}
                onChange={(e) => setName(e.target.value)}
                required
                type="text"
                value={name}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Brand Identity</label>
              <select
                className={styles.select}
                onChange={(e) => setBrand(e.target.value)}
                value={brand}
              >
                <option value="JOHOVO">JOHOVO</option>
                <option value="IyalMooligai">IyalMooligai</option>
              </select>
            </div>
          </div>

          <div className={styles.grid3}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Category</label>
              <select
                className={styles.select}
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="Face Care">Face Care</option>
                <option value="Facepack">Face Pack</option>
                <option value="Hair Care">Hair Care</option>
                <option value="Hair Oil">Hair Oil</option>
                <option value="Body Care">Body Care</option>
                <option value="Herbal Care">Herbal Care</option>
                <option value="Trending">Trending</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>SKU / Code</label>
              <input
                className={styles.input}
                onChange={(e) => setSku(e.target.value)}
                type="text"
                value={sku}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Net Quantity / Size</label>
              <input
                className={styles.input}
                onChange={(e) => setNetQuantity(e.target.value)}
                type="text"
                value={netQuantity}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing */}
        <div className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <LocalOfferRoundedIcon className={styles.sectionIcon} />
            <span>Pricing &amp; Valuation (INR)</span>
          </h2>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Selling Price (₹) <span style={{ color: "var(--color-brand-pink)" }}>*</span>
              </label>
              <input
                className={styles.input}
                min={1}
                onChange={(e) => setSellingPrice(e.target.value)}
                required
                step="any"
                type="number"
                value={sellingPrice}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Maximum Retail Price / MRP (₹)
              </label>
              <input
                className={styles.input}
                min={1}
                onChange={(e) => setMrp(e.target.value)}
                step="any"
                type="number"
                value={mrp}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Media Upload */}
        <div className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <AddPhotoAlternateRoundedIcon className={styles.sectionIcon} />
            <span>Product Media (Google Drive Synced)</span>
          </h2>

          <input
            accept="image/*"
            hidden
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />

          {filePreview ? (
            <div className={styles.previewCard}>
              <img alt="Preview" className={styles.previewThumb} src={filePreview} />
              <div className={styles.previewInfo}>
                <span className={styles.previewName}>
                  {selectedFile ? selectedFile.name : "Current Image (Google Drive Synced)"}
                </span>
                <span className={styles.previewSize}>
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to replace on Google Drive`
                    : "Click below if you wish to upload and replace with a new image"}
                </span>
              </div>
              <button
                className={styles.removeImgBtn}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div
              className={styles.uploadDropzone}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadRoundedIcon className={styles.cloudIcon} />
              <p className={styles.dropzoneText}>Click to select new product image</p>
            </div>
          )}
        </div>

        {/* Section 4: Descriptions */}
        <div className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <DescriptionRoundedIcon className={styles.sectionIcon} />
            <span>Botanical Details &amp; Descriptions</span>
          </h2>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Short Summary / Overview</label>
            <input
              className={styles.input}
              onChange={(e) => setShortDescription(e.target.value)}
              type="text"
              value={shortDescription}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Full Botanical Description</label>
            <textarea
              className={styles.textarea}
              onChange={(e) => setFullDescription(e.target.value)}
              rows={3}
              value={fullDescription}
            />
          </div>

          <div className={styles.grid3}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Key Herbal Ingredients</label>
              <textarea
                className={styles.textarea}
                onChange={(e) => setIngredients(e.target.value)}
                rows={2}
                value={ingredients}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Key Benefits</label>
              <textarea
                className={styles.textarea}
                onChange={(e) => setBenefits(e.target.value)}
                rows={2}
                value={benefits}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Directions for Use</label>
              <textarea
                className={styles.textarea}
                onChange={(e) => setUsageInstructions(e.target.value)}
                rows={2}
                value={usageInstructions}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Link className={styles.cancelBtn} href="/admin/products">
            Cancel
          </Link>
          <button className={styles.submitBtn} disabled={isLoading} type="submit">
            {isLoading ? (
              <span>Updating Product...</span>
            ) : (
              <>
                <CheckCircleRoundedIcon fontSize="small" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

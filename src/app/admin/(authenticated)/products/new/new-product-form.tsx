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
import styles from "./new-product.module.css";

export function NewProductForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("JOHOVO");
  const [category, setCategory] = useState("Face Care");
  const [sku, setSku] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [netQuantity, setNetQuantity] = useState("100g");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [benefits, setBenefits] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
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
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
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

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create product");
      }

      setStatus({
        type: "success",
        message: "Product created successfully! Image uploaded to Google Drive and saved to Neon.",
      });

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      console.error("Product submission failed:", err);
      setStatus({
        type: "error",
        message: err?.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Add New Product</h1>
          <p className={styles.desc}>
            Upload product details, herbal formulations, and high-res imagery directly to Google Drive and Neon DB.
          </p>
        </div>
        <Link className={styles.backBtn} href="/admin/products">
          <ArrowBackRoundedIcon fontSize="small" />
          <span>Back to Catalog</span>
        </Link>
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
                placeholder="e.g. IyalMooligai Pure Kasthuri Manjal Face Pack"
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
              <label className={styles.label}>
                SKU / Code <span className={styles.optional}>(Auto-generated if empty)</span>
              </label>
              <input
                className={styles.input}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. JH-FP-002"
                type="text"
                value={sku}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Net Quantity / Size</label>
              <input
                className={styles.input}
                onChange={(e) => setNetQuantity(e.target.value)}
                placeholder="e.g. 100g, 200ml, Pack of 2"
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
                placeholder="e.g. 720"
                required
                step="any"
                type="number"
                value={sellingPrice}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Maximum Retail Price / MRP (₹) <span className={styles.optional}>(For discount calculation)</span>
              </label>
              <input
                className={styles.input}
                min={1}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="e.g. 899"
                step="any"
                type="number"
                value={mrp}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Media Upload (Google Drive) */}
        <div className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <AddPhotoAlternateRoundedIcon className={styles.sectionIcon} />
            <span>Product Media (Uploaded to Google Drive)</span>
          </h2>

          <input
            accept="image/*"
            hidden
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />

          {!selectedFile ? (
            <div
              className={styles.uploadDropzone}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadRoundedIcon className={styles.cloudIcon} />
              <p className={styles.dropzoneText}>Click to select product image</p>
              <p className={styles.dropzoneHint}>
                PNG, JPG, WEBP up to 25MB. File automatically uploads to Google Drive under folder:
                <strong> products/{name.trim() || "[Product Name]"}</strong>
              </p>
            </div>
          ) : (
            <div className={styles.previewCard}>
              {filePreview && (
                <img alt="Preview" className={styles.previewThumb} src={filePreview} />
              )}
              <div className={styles.previewInfo}>
                <span className={styles.previewName}>{selectedFile.name}</span>
                <span className={styles.previewSize}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Google Drive sync
                </span>
              </div>
              <button className={styles.removeImgBtn} onClick={removeFile} type="button">
                <DeleteOutlineRoundedIcon fontSize="small" />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Descriptions & Herbal Formulation */}
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
              placeholder="Brief tagline or 1-sentence product summary"
              type="text"
              value={shortDescription}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Full Botanical Description</label>
            <textarea
              className={styles.textarea}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed description of the product, formulation origin, and craft..."
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
                placeholder="e.g. Kasthuri Manjal, Red Sandalwood, Neem, Rose Petals"
                rows={2}
                value={ingredients}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Key Benefits</label>
              <textarea
                className={styles.textarea}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="e.g. Brightens skin, reduces blemishes, improves barrier moisture"
                rows={2}
                value={benefits}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Directions for Use</label>
              <textarea
                className={styles.textarea}
                onChange={(e) => setUsageInstructions(e.target.value)}
                placeholder="e.g. Mix 1 tbsp with rose water, apply evenly, wash off after 15 mins"
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
              <span>Uploading to Drive &amp; Neon...</span>
            ) : (
              <>
                <CheckCircleRoundedIcon fontSize="small" />
                <span>Save &amp; Publish Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

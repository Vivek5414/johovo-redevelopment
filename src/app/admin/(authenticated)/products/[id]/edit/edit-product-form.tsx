"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { getDirectImageUrl } from "@/lib/drive-image-utils";
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
    gallery_images?: any[];
    videos?: any[];
  };
};

export function EditProductForm({ initialProduct }: EditProductFormProps) {
  const router = useRouter();
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  // Media
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(
    getDirectImageUrl(initialProduct.image_url, initialProduct.drive_file_id)
  );

  const [existingGallery, setExistingGallery] = useState<{ url: string; drive_file_id?: string }[]>(
    Array.isArray(initialProduct.gallery_images)
      ? initialProduct.gallery_images.map((img) =>
          typeof img === "string"
            ? { url: img }
            : { url: img.url || img.src || "", drive_file_id: img.drive_file_id || img.fileId }
        )
      : []
  );

  const [galleryFiles, setGalleryFiles] = useState<{ file: File; preview: string }[]>([]);
  const [videoFiles, setVideoFiles] = useState<{ file: File; name: string }[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryFile(file);
      setPrimaryPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newItems = Array.from(files).map((f) => ({
        file: f,
        preview: URL.createObjectURL(f),
      }));
      setGalleryFiles((prev) => [...prev, ...newItems]);
    }
  };

  const removeGalleryItem = (index: number) => {
    setGalleryFiles((prev) => {
      const target = prev[index];
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newVids = Array.from(files).map((f) => ({
        file: f,
        name: f.name,
      }));
      setVideoFiles((prev) => [...prev, ...newVids]);
    }
  };

  const removeVideoItem = (index: number) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
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

      if (primaryFile) {
        formData.append("image", primaryFile);
      }

      formData.append("existing_gallery", JSON.stringify(existingGallery));

      for (const item of galleryFiles) {
        formData.append("gallery_images", item.file);
      }

      for (const vItem of videoFiles) {
        formData.append("video_files", vItem.file);
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
        message: "Product and media updated successfully!",
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
            Update pricing, descriptions, multiple photos, and videos synced across Google Drive and Neon DB.
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
                <option value="Herbal Products">Herbal Products</option>
                <option value="Hair Care">Hair Care Range</option>
                <option value="Face Care">Face Care Range</option>
                <option value="Lip Care">Lip Care Kits</option>
                <option value="Body Care">Body Care Range</option>
                <option value="Wellness Snacks">Wellness Healthy Snacks</option>
                <option value="Cold Pressed Oils">Cold Pressed Oils (Marachekku)</option>
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
              <label className={styles.label}>Maximum Retail Price / MRP (₹)</label>
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
            <span>Product Photos (Primary &amp; Multiple Gallery Images)</span>
          </h2>

          {/* Primary Cover */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Main Cover Image</label>
            <input
              accept="image/*"
              hidden
              onChange={handlePrimaryChange}
              ref={primaryInputRef}
              type="file"
            />
            {primaryPreview ? (
              <div className={styles.mediaGrid}>
                <div className={styles.mediaItemCard}>
                  <span className={styles.mediaItemBadge}>COVER</span>
                  <img alt="Primary Preview" className={styles.mediaItemThumb} src={primaryPreview} />
                  <span className={styles.mediaItemName}>
                    {primaryFile ? primaryFile.name : "Current Cover Image"}
                  </span>
                  <button
                    className={styles.removeMiniBtn}
                    onClick={() => primaryInputRef.current?.click()}
                    type="button"
                  >
                    Change Cover
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={styles.uploadDropzone}
                onClick={() => primaryInputRef.current?.click()}
              >
                <CloudUploadRoundedIcon className={styles.cloudIcon} />
                <p className={styles.dropzoneText}>Select Main Cover Image</p>
              </div>
            )}
          </div>

          {/* Additional Gallery Images */}
          <div className={styles.fieldGroup} style={{ marginTop: "1rem" }}>
            <label className={styles.label}>
              Gallery Images <span className={styles.optional}>(Existing photos and add more)</span>
            </label>

            {/* Existing Gallery Photos */}
            {existingGallery.length > 0 && (
              <div className={styles.mediaGrid} style={{ marginBottom: "1rem" }}>
                {existingGallery.map((img, idx) => (
                  <div className={styles.mediaItemCard} key={`existing-${idx}`}>
                    <span className={styles.mediaItemBadge}>SAVED #{idx + 1}</span>
                    <img
                      alt={`Saved Gallery ${idx + 1}`}
                      className={styles.mediaItemThumb}
                      src={getDirectImageUrl(img.url, img.drive_file_id)}
                    />
                    <button
                      className={styles.removeMiniBtn}
                      onClick={() => setExistingGallery((prev) => prev.filter((_, i) => i !== idx))}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              accept="image/*"
              hidden
              multiple
              onChange={handleGalleryChange}
              ref={galleryInputRef}
              type="file"
            />
            <div
              className={styles.uploadDropzone}
              onClick={() => galleryInputRef.current?.click()}
              style={{ padding: "1.2rem" }}
            >
              <AddPhotoAlternateRoundedIcon className={styles.cloudIcon} style={{ fontSize: "1.8rem" }} />
              <p className={styles.dropzoneText}>Add More Gallery Images</p>
            </div>

            {galleryFiles.length > 0 && (
              <div className={styles.mediaGrid}>
                {galleryFiles.map((item, idx) => (
                  <div className={styles.mediaItemCard} key={idx}>
                    <span className={styles.mediaItemBadge}>NEW #{idx + 1}</span>
                    <img alt={`New Gallery ${idx + 1}`} className={styles.mediaItemThumb} src={item.preview} />
                    <span className={styles.mediaItemName}>{item.file.name}</span>
                    <button
                      className={styles.removeMiniBtn}
                      onClick={() => removeGalleryItem(idx)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Videos */}
        <div className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <VideoLibraryRoundedIcon className={styles.sectionIcon} />
            <span>Product Videos</span>
          </h2>

          <input
            accept="video/mp4,video/webm,video/quicktime"
            hidden
            multiple
            onChange={handleVideoChange}
            ref={videoInputRef}
            type="file"
          />

          <div
            className={styles.uploadDropzone}
            onClick={() => videoInputRef.current?.click()}
            style={{ padding: "1.2rem" }}
          >
            <VideoLibraryRoundedIcon className={styles.cloudIcon} style={{ fontSize: "1.8rem" }} />
            <p className={styles.dropzoneText}>Upload Video Demonstration File</p>
          </div>

          {videoFiles.length > 0 && (
            <div className={styles.mediaGrid}>
              {videoFiles.map((v, vIdx) => (
                <div className={styles.mediaItemCard} key={vIdx}>
                  <span className={styles.mediaItemBadge}>VIDEO</span>
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      background: "#161616",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                  >
                    <VideoLibraryRoundedIcon />
                  </div>
                  <span className={styles.mediaItemName}>{v.name}</span>
                  <button
                    className={styles.removeMiniBtn}
                    onClick={() => removeVideoItem(vIdx)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Descriptions */}
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
              <span>Updating Product &amp; Media...</span>
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

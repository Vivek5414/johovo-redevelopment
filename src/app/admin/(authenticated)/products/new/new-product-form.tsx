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
import styles from "./new-product.module.css";

export function NewProductForm() {
  const router = useRouter();
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  // Media States
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<{ file: File; preview: string }[]>([]);
  const [videoFiles, setVideoFiles] = useState<{ file: File; name: string }[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Handlers
  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryFile(file);
      setPrimaryPreview(URL.createObjectURL(file));
    }
  };

  const removePrimary = () => {
    setPrimaryFile(null);
    if (primaryPreview) URL.revokeObjectURL(primaryPreview);
    setPrimaryPreview(null);
    if (primaryInputRef.current) primaryInputRef.current.value = "";
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

      // Primary file
      if (primaryFile) {
        formData.append("image", primaryFile);
      }

      // Multiple gallery files
      for (const item of galleryFiles) {
        formData.append("gallery_images", item.file);
      }

      // Video files
      for (const vItem of videoFiles) {
        formData.append("video_files", vItem.file);
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
        message: "Product created successfully! All images and videos synced to Google Drive and Neon DB.",
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
            Add full product specifications, multiple high-res gallery images, and videos synced to Google Drive.
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

        {/* Section 3: Media Upload (Primary + Multiple Images) */}
        <div className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <AddPhotoAlternateRoundedIcon className={styles.sectionIcon} />
            <span>Product Photos (Primary &amp; Multiple Gallery Images)</span>
          </h2>

          {/* 3A: Primary Featured Image */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Main Featured Cover Image <span className={styles.optional}>(Front showcase)</span>
            </label>

            <input
              accept="image/*"
              hidden
              onChange={handlePrimaryChange}
              ref={primaryInputRef}
              type="file"
            />

            {!primaryFile ? (
              <div
                className={styles.uploadDropzone}
                onClick={() => primaryInputRef.current?.click()}
              >
                <CloudUploadRoundedIcon className={styles.cloudIcon} />
                <p className={styles.dropzoneText}>Select Main Cover Image</p>
                <p className={styles.dropzoneHint}>
                  Uploads directly to Google Drive under folder:
                  <strong> products/{name.trim() || "[Product Name]"}</strong>
                </p>
              </div>
            ) : (
              <div className={styles.mediaGrid}>
                <div className={styles.mediaItemCard}>
                  <span className={styles.mediaItemBadge}>MAIN COVER</span>
                  {primaryPreview && (
                    <img alt="Primary" className={styles.mediaItemThumb} src={primaryPreview} />
                  )}
                  <span className={styles.mediaItemName}>{primaryFile.name}</span>
                  <button className={styles.removeMiniBtn} onClick={removePrimary} type="button">
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3B: Multiple Gallery Images */}
          <div className={styles.fieldGroup} style={{ marginTop: "1rem" }}>
            <label className={styles.label}>
              Additional Gallery Images <span className={styles.optional}>(Select multiple photos)</span>
            </label>

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
              <p className={styles.dropzoneText}>Add Gallery Images (Hold Ctrl/Shift to multi-select)</p>
              <p className={styles.dropzoneHint}>
                Add packaging angles, texture shots, and ingredients. All files upload directly to Google Drive.
              </p>
            </div>

            {galleryFiles.length > 0 && (
              <div className={styles.mediaGrid}>
                {galleryFiles.map((item, idx) => (
                  <div className={styles.mediaItemCard} key={idx}>
                    <span className={styles.mediaItemBadge}>PHOTO #{idx + 1}</span>
                    <img alt={`Gallery ${idx + 1}`} className={styles.mediaItemThumb} src={item.preview} />
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

        {/* Section 4: Video Uploads & URLs */}
        <div className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <VideoLibraryRoundedIcon className={styles.sectionIcon} />
            <span>Product Videos &amp; Reels</span>
          </h2>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Upload Video Files <span className={styles.optional}>(MP4, MOV, WebM - Uploaded to Google Drive)</span>
            </label>

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
              <p className={styles.dropzoneText}>Select Video Clip / Demo</p>
              <p className={styles.dropzoneHint}>
                Demonstration clips, application rituals, or texture videos.
              </p>
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
        </div>

        {/* Section 5: Descriptions & Herbal Formulation */}
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
              <span>Uploading Media to Drive &amp; Neon...</span>
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

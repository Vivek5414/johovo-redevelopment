'use client';

import React, { useState, useEffect } from 'react';

interface UploadedFileItem {
  id: number;
  name: string;
  file_id: string;
  mime_type: string;
  file_size: number;
  preview_url: string;
  download_url: string;
  created_at: string;
}

interface ProductFileItem {
  id: number;
  product_name: string;
  file_name: string;
  file_id: string;
  mime_type: string;
  file_size: number;
  preview_url: string;
  download_url: string;
  created_at: string;
}

export default function UploadTestingPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'product'>('general');

  // General Upload State
  const [generalFile, setGeneralFile] = useState<File | null>(null);
  const [isGeneralUploading, setIsGeneralUploading] = useState(false);
  const [generalFilesList, setGeneralFilesList] = useState<UploadedFileItem[]>([]);

  // Product Upload State
  const [productName, setProductName] = useState('');
  const [productFile, setProductFile] = useState<File | null>(null);
  const [isProductUploading, setIsProductUploading] = useState(false);
  const [productFilesList, setProductFilesList] = useState<ProductFileItem[]>([]);

  // Status/Feedback
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchGeneralFiles();
    fetchProductFiles();
  }, []);

  const fetchGeneralFiles = async () => {
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      if (data.success) {
        setGeneralFilesList(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProductFiles = async () => {
    try {
      const res = await fetch('/api/products/upload');
      const data = await res.json();
      if (data.success) {
        setProductFilesList(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generalFile) return;

    setIsGeneralUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', generalFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Document uploaded successfully to Google Drive & saved to Neon DB!' });
        setGeneralFile(null);
        // Reset file input
        const fileInput = document.getElementById('general-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchGeneralFiles();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error occurred' });
    } finally {
      setIsGeneralUploading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFile || !productName.trim()) return;

    setIsProductUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', productFile);
    formData.append('product_name', productName.trim());

    try {
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: `Product file stored inside "products/${productName.trim()}" on Drive & recorded in Neon DB!`,
        });
        setProductFile(null);
        setProductName('');
        const fileInput = document.getElementById('product-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchProductFiles();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload product file' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error occurred' });
    } finally {
      setIsProductUploading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          Google Drive + Neon DB Upload Console
        </h1>
        <p style={{ color: '#4b5563', marginTop: '6px' }}>
          Upload files to Google Drive, create product-specific folders, and automatically store preview &amp; download URLs in Neon PostgreSQL.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={() => { setActiveTab('general'); setMessage(null); }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              backgroundColor: activeTab === 'general' ? '#2563eb' : '#f3f4f6',
              color: activeTab === 'general' ? '#ffffff' : '#374151',
            }}
          >
            General Document Upload
          </button>
          <button
            onClick={() => { setActiveTab('product'); setMessage(null); }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              backgroundColor: activeTab === 'product' ? '#2563eb' : '#f3f4f6',
              color: activeTab === 'product' ? '#ffffff' : '#374151',
            }}
          >
            Product Specific Upload (Folder: products/&lt;name&gt;)
          </button>
        </div>
      </header>

      {/* Alert Notification */}
      {message && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '8px',
            marginBottom: '25px',
            backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* General Upload Section */}
      {activeTab === 'general' && (
        <div>
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              marginBottom: '35px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: 0, marginBottom: '15px' }}>
              Upload Any Document
            </h2>
            <form onSubmit={handleGeneralSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                  Choose Document / File
                </label>
                <input
                  id="general-file-input"
                  type="file"
                  onChange={(e) => setGeneralFile(e.target.files?.[0] || null)}
                  style={{
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isGeneralUploading || !generalFile}
                style={{
                  padding: '12px 20px',
                  backgroundColor: isGeneralUploading || !generalFile ? '#9ca3af' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: isGeneralUploading || !generalFile ? 'not-allowed' : 'pointer',
                  width: 'fit-content',
                }}
              >
                {isGeneralUploading ? 'Uploading to Drive & Saving to Neon...' : 'Upload Document'}
              </button>
            </form>
          </section>

          {/* Files List Table */}
          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px' }}>
              Uploaded Documents in Neon DB ({generalFilesList.length})
            </h3>
            {generalFilesList.length === 0 ? (
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No files recorded yet.</p>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '12px 16px' }}>ID</th>
                      <th style={{ padding: '12px 16px' }}>Filename</th>
                      <th style={{ padding: '12px 16px' }}>Size</th>
                      <th style={{ padding: '12px 16px' }}>Drive File ID</th>
                      <th style={{ padding: '12px 16px' }}>Preview</th>
                      <th style={{ padding: '12px 16px' }}>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generalFilesList.map((f) => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 16px' }}>{f.id}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{f.name}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{formatBytes(f.file_size)}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280', fontFamily: 'monospace' }}>
                          {f.file_id ? `${f.file_id.slice(0, 10)}...` : '-'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <a
                            href={f.preview_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#2563eb', textDecoration: 'underline' }}
                          >
                            View
                          </a>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <a
                            href={f.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#059669', textDecoration: 'underline' }}
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Product Upload Section */}
      {activeTab === 'product' && (
        <div>
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              marginBottom: '35px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: 0, marginBottom: '15px' }}>
              Upload Product Document / Asset
            </h2>
            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                  Product Name (Will create/use Drive folder: &quot;products/&lt;Product Name&gt;&quot;)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nike Air Max, Solar Inverter 5kW"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                  Product File (Document, Image, Brochure, etc.)
                </label>
                <input
                  id="product-file-input"
                  type="file"
                  onChange={(e) => setProductFile(e.target.files?.[0] || null)}
                  style={{
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProductUploading || !productFile || !productName.trim()}
                style={{
                  padding: '12px 20px',
                  backgroundColor: isProductUploading || !productFile || !productName.trim() ? '#9ca3af' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: isProductUploading || !productFile || !productName.trim() ? 'not-allowed' : 'pointer',
                  width: 'fit-content',
                }}
              >
                {isProductUploading ? 'Creating Folder & Uploading...' : 'Upload Product File'}
              </button>
            </form>
          </section>

          {/* Product Files List Table */}
          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px' }}>
              Product Files in Neon DB ({productFilesList.length})
            </h3>
            {productFilesList.length === 0 ? (
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No product files recorded yet.</p>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '12px 16px' }}>ID</th>
                      <th style={{ padding: '12px 16px' }}>Product</th>
                      <th style={{ padding: '12px 16px' }}>File</th>
                      <th style={{ padding: '12px 16px' }}>Size</th>
                      <th style={{ padding: '12px 16px' }}>Drive Folder Path</th>
                      <th style={{ padding: '12px 16px' }}>Preview</th>
                      <th style={{ padding: '12px 16px' }}>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productFilesList.map((f) => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 16px' }}>{f.id}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1f2937' }}>
                          <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px' }}>
                            {f.product_name}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{f.file_name}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{formatBytes(f.file_size)}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px' }}>
                          products/{f.product_name}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <a
                            href={f.preview_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#2563eb', textDecoration: 'underline' }}
                          >
                            View
                          </a>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <a
                            href={f.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#059669', textDecoration: 'underline' }}
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

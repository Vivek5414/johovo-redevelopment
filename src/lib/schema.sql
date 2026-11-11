-- Migration script for Neon PostgreSQL

-- 1. Table for generic uploaded documents/files (/upload)
CREATE TABLE IF NOT EXISTS uploaded_files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_id VARCHAR(255) NOT NULL,
    mime_type VARCHAR(120),
    file_size BIGINT,
    preview_url TEXT NOT NULL,
    download_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table for products uploaded documents / media
CREATE TABLE IF NOT EXISTS product_files (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_id VARCHAR(255) NOT NULL,
    mime_type VARCHAR(120),
    file_size BIGINT,
    preview_url TEXT NOT NULL,
    download_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_uploaded_files_created_at ON uploaded_files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_files_product_name ON product_files(product_name);
CREATE INDEX IF NOT EXISTS idx_product_files_created_at ON product_files(created_at DESC);

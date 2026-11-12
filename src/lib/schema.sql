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

-- 3. Table for customer contact enquiries (/contact)
CREATE TABLE IF NOT EXISTS contact_enquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    product VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table for customer tax receipts / invoices
CREATE TABLE IF NOT EXISTS receipt (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(120) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    payment_method VARCHAR(120),
    discount_percent NUMERIC(5,2) DEFAULT 0,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_receipt_created_at ON receipt(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_receipt_invoice_number ON receipt(invoice_number);

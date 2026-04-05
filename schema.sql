-- schema.sql
-- Run this in your Supabase SQL Editor

-- 1. customers table
CREATE TABLE IF NOT EXISTS public.customers (
    customer_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    signup_date DATE NOT NULL
);

-- 2. products table
CREATE TABLE IF NOT EXISTS public.products (
    product_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price FLOAT NOT NULL,
    stock INT NOT NULL
);

-- 3. orders table
CREATE TABLE IF NOT EXISTS public.orders (
    order_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(customer_id) ON DELETE CASCADE,
    order_date TIMESTAMP NOT NULL,
    total_amount FLOAT NOT NULL,
    discount FLOAT DEFAULT 0
);

-- 4. order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(order_id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_order_date ON public.orders(order_date);
CREATE INDEX IF NOT EXISTS idx_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_id ON public.order_items(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Basic public read for now (adjust policies as needed for production)
CREATE POLICY "Public read available for customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Public read available for products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read available for orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public read available for order_items" ON public.order_items FOR SELECT USING (true);

-- Adding insert capability for scripts to generate data easily (remove in production if restricted)
CREATE POLICY "Public insert available for customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert available for products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert available for orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert available for order_items" ON public.order_items FOR INSERT WITH CHECK (true);

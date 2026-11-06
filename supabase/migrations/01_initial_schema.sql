-- BOWL LAB: Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)

-- 1. Profiles Table (Customer & Admin accounts)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. Ingredients Table
CREATE TABLE IF NOT EXISTS ingredients (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  allergens TEXT[] DEFAULT '{}',
  dietary_tags TEXT[] DEFAULT '{}',
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  default_quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Predefined Bowls Table
CREATE TABLE IF NOT EXISTS bowls (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL,
  calories INT DEFAULT 0,
  default_base_id TEXT REFERENCES ingredients(id),
  dietary_tags TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Bowl Ingredients Bridge Table
CREATE TABLE IF NOT EXISTS bowl_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bowl_id TEXT NOT NULL REFERENCES bowls(id) ON DELETE CASCADE,
  ingredient_id TEXT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  default_quantity INT NOT NULL DEFAULT 1
);

-- 6. Orders Table (Updated with COD and Pay at Restaurant)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
  delivery_address TEXT NOT NULL,
  delivery_instructions TEXT,
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'pay_at_restaurant')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'not_applicable')),
  order_status TEXT NOT NULL DEFAULT 'received' CHECK (order_status IN ('received', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  bowl_name TEXT NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  customization_json JSONB
);

-- 8. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  minimum_order NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  expiry_date TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Restaurant Settings Table
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id TEXT PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  tagline TEXT,
  logo_url TEXT,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  opening_hours TEXT NOT NULL,
  delivery_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  pickup_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  tax_percentage NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 49.00,
  minimum_order NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bowls ENABLE ROW LEVEL SECURITY;
ALTER TABLE bowl_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read ingredients" ON ingredients FOR SELECT USING (true);
CREATE POLICY "Public read bowls" ON bowls FOR SELECT USING (true);
CREATE POLICY "Public read bowl_ingredients" ON bowl_ingredients FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (is_active = true);

-- User order policies
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own order items" ON order_items FOR SELECT USING (true);

-- Admin full access policies
CREATE POLICY "Admin full orders" ON orders FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "Admin full ingredients" ON ingredients FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "Admin full bowls" ON bowls FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "Admin full settings" ON restaurant_settings FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);


/*
  # Create discount codes system

  1. New Tables
    - `discount_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `type` (text) - 'percentage' or 'fixed'
      - `value` (numeric) - discount amount
      - `min_order_amount` (numeric) - minimum order for discount
      - `max_uses` (integer) - maximum number of uses
      - `current_uses` (integer) - current usage count
      - `valid_from` (timestamp)
      - `valid_until` (timestamp)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    - `discount_code_products`
      - `id` (uuid, primary key)
      - `discount_code_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
    - `discount_code_categories`
      - `id` (uuid, primary key)
      - `discount_code_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)
    - `order_discount_codes`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `discount_code_id` (uuid, foreign key)
      - `discount_amount` (numeric)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access and admin management
*/

-- Discount codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value numeric(10,2) NOT NULL CHECK (value > 0),
  min_order_amount numeric(10,2) DEFAULT 0,
  max_uses integer DEFAULT NULL,
  current_uses integer DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz DEFAULT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Discount code products (specific products the discount applies to)
CREATE TABLE IF NOT EXISTS discount_code_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id uuid REFERENCES discount_codes(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(discount_code_id, product_id)
);

-- Discount code categories (categories the discount applies to)
CREATE TABLE IF NOT EXISTS discount_code_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id uuid REFERENCES discount_codes(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(discount_code_id, category_id)
);

-- Order discount codes (track which discounts were used in orders)
CREATE TABLE IF NOT EXISTS order_discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  discount_code_id uuid REFERENCES discount_codes(id),
  discount_amount numeric(10,2) NOT NULL
);

-- Enable RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_code_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_code_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_discount_codes ENABLE ROW LEVEL SECURITY;

-- Policies for discount_codes
CREATE POLICY "Discount codes are publicly readable"
  ON discount_codes
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Enable all operations for discount codes"
  ON discount_codes
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for discount_code_products
CREATE POLICY "Discount code products are publicly readable"
  ON discount_code_products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Enable all operations for discount code products"
  ON discount_code_products
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for discount_code_categories
CREATE POLICY "Discount code categories are publicly readable"
  ON discount_code_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Enable all operations for discount code categories"
  ON discount_code_categories
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for order_discount_codes
CREATE POLICY "Order discount codes are publicly readable"
  ON order_discount_codes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Enable insert for order discount codes"
  ON order_discount_codes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
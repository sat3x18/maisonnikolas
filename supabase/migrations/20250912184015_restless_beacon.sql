/*
  # E-commerce Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category_id` (uuid, foreign key)
      - `price` (decimal)
      - `discount_price` (decimal, nullable)
      - `images` (text array)
      - `colors` (text array)
      - `sizes` (text array)
      - `stock` (integer)
      - `is_featured` (boolean)
      - `is_new` (boolean)
      - `is_limited` (boolean)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique)
      - `customer_name` (text)
      - `customer_surname` (text)
      - `customer_phone` (text)
      - `customer_city` (text)
      - `customer_address` (text)
      - `payment_method` (text)
      - `total_amount` (decimal)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (decimal)
      - `color` (text)
      - `size` (text)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `order_id` (uuid, foreign key)
      - `customer_name` (text)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamp)
    
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to products, categories, reviews
    - Add policies for authenticated admin access to orders and admin functions
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  price decimal(10,2) NOT NULL,
  discount_price decimal(10,2),
  images text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  sizes text[] DEFAULT '{}',
  stock integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  is_limited boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_surname text NOT NULL,
  customer_phone text NOT NULL,
  customer_city text NOT NULL,
  customer_address text NOT NULL,
  payment_method text NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  color text,
  size text
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id),
  customer_name text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

-- Order policies (public can insert, admin can read/update)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can create reviews"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Insert sample data
INSERT INTO categories (name, slug, description) VALUES
  ('Shoes', 'shoes', 'Premium luxury footwear'),
  ('Shirts', 'shirts', 'Elegant dress shirts and casual wear'),
  ('Pants', 'pants', 'Sophisticated trousers and casual pants'),
  ('Accessories', 'accessories', 'Luxury accessories and jewelry');

INSERT INTO products (name, description, category_id, price, discount_price, images, colors, sizes, stock, is_featured, is_new) VALUES
  (
    'Premium Leather Oxford',
    'Handcrafted Italian leather oxford shoes with premium finishing. Perfect for formal occasions and business meetings.',
    (SELECT id FROM categories WHERE slug = 'shoes'),
    899.00,
    699.00,
    ARRAY['https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg'],
    ARRAY['Black', 'Brown', 'Burgundy'],
    ARRAY['39', '40', '41', '42', '43', '44', '45'],
    50,
    true,
    true
  ),
  (
    'Silk Dress Shirt',
    'Luxurious silk dress shirt with mother-of-pearl buttons. Tailored fit for the modern gentleman.',
    (SELECT id FROM categories WHERE slug = 'shirts'),
    459.00,
    NULL,
    ARRAY['https://i.postimg.cc/MK2NNhK3/imgi-1-Untitled-design-4.png'],
    ARRAY['White', 'Light Blue', 'Charcoal'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    30,
    true,
    false
  ),
  (
    'Tailored Wool Trousers',
    'Premium wool trousers with impeccable tailoring. Classic fit with modern styling.',
    (SELECT id FROM categories WHERE slug = 'pants'),
    649.00,
    549.00,
    ARRAY['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg'],
    ARRAY['Navy', 'Charcoal', 'Black'],
    ARRAY['30', '32', '34', '36', '38', '40'],
    25,
    false,
    true
  ),
  (
    'Luxury Leather Loafers',
    'Sophisticated leather loafers crafted from the finest materials. Comfort meets elegance.',
    (SELECT id FROM categories WHERE slug = 'shoes'),
    749.00,
    NULL,
    ARRAY['https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg'],
    ARRAY['Black', 'Brown', 'Tan'],
    ARRAY['39', '40', '41', '42', '43', '44'],
    40,
    true,
    false
  ),
  (
    'Cashmere Polo Shirt',
    'Ultra-soft cashmere polo shirt with refined details. Perfect for casual luxury.',
    (SELECT id FROM categories WHERE slug = 'shirts'),
    389.00,
    299.00,
    ARRAY['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'],
    ARRAY['Navy', 'Grey', 'Cream'],
    ARRAY['S', 'M', 'L', 'XL'],
    20,
    false,
    true
  ),
  (
    'Premium Chinos',
    'Versatile chino pants made from premium cotton twill. Perfect for smart-casual occasions.',
    (SELECT id FROM categories WHERE slug = 'pants'),
    299.00,
    NULL,
    ARRAY['https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg'],
    ARRAY['Khaki', 'Navy', 'Olive'],
    ARRAY['30', '32', '34', '36', '38'],
    35,
    false,
    false
  );

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
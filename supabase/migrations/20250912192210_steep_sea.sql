/*
  # Add Sample Data for Tbilisi Wear

  1. Sample Categories
    - Men's Watches
    - Women's Watches
    - Limited Edition
    - Classic Collection

  2. Sample Products
    - Various luxury watches with different categories
    - Mix of featured, new, and regular products
    - Proper pricing and descriptions

  3. Security
    - Uses existing RLS policies
*/

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Men''s Watches', 'mens-watches', 'Sophisticated timepieces for the modern gentleman'),
('Women''s Watches', 'womens-watches', 'Elegant watches designed for the discerning woman'),
('Limited Edition', 'limited-edition', 'Exclusive timepieces in limited quantities'),
('Classic Collection', 'classic-collection', 'Timeless designs that never go out of style');

-- Insert sample products
INSERT INTO products (name, description, category_id, price, discount_price, images, colors, sizes, stock, is_featured, is_new, is_limited) VALUES
(
  'Chronographe Royal',
  'A masterpiece of horological excellence featuring a Swiss automatic movement and sapphire crystal.',
  (SELECT id FROM categories WHERE slug = 'mens-watches'),
  2850.00,
  NULL,
  ARRAY['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg'],
  ARRAY['Gold', 'Silver', 'Black'],
  ARRAY['42mm', '44mm'],
  15,
  true,
  false,
  false
),
(
  'Dame Élégante',
  'Refined femininity meets precision engineering in this exquisite ladies'' timepiece.',
  (SELECT id FROM categories WHERE slug = 'womens-watches'),
  1950.00,
  1750.00,
  ARRAY['https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg', 'https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg'],
  ARRAY['Rose Gold', 'White Gold', 'Silver'],
  ARRAY['32mm', '36mm'],
  8,
  true,
  true,
  false
),
(
  'Heritage Prestige',
  'A tribute to our founding heritage, this limited edition piece embodies 130 years of craftsmanship.',
  (SELECT id FROM categories WHERE slug = 'limited-edition'),
  4200.00,
  NULL,
  ARRAY['https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg', 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg'],
  ARRAY['Platinum', 'Gold'],
  ARRAY['40mm', '42mm'],
  5,
  true,
  true,
  true
),
(
  'Classique Intemporel',
  'Simple elegance defines this classic dress watch, perfect for any occasion.',
  (SELECT id FROM categories WHERE slug = 'classic-collection'),
  1450.00,
  NULL,
  ARRAY['https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg', 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'],
  ARRAY['Black', 'Brown', 'Navy'],
  ARRAY['38mm', '40mm'],
  20,
  false,
  false,
  false
),
(
  'Sport Dynamique',
  'Built for the active lifestyle, this sports watch combines durability with sophisticated design.',
  (SELECT id FROM categories WHERE slug = 'mens-watches'),
  2100.00,
  1890.00,
  ARRAY['https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg', 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg'],
  ARRAY['Steel', 'Black', 'Blue'],
  ARRAY['42mm', '44mm', '46mm'],
  12,
  false,
  true,
  false
),
(
  'Bijou Précieux',
  'Adorned with carefully selected diamonds, this piece is jewelry and timepiece in perfect harmony.',
  (SELECT id FROM categories WHERE slug = 'womens-watches'),
  3750.00,
  NULL,
  ARRAY['https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg', 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg'],
  ARRAY['White Gold', 'Rose Gold'],
  ARRAY['28mm', '32mm'],
  6,
  true,
  false,
  true
),
(
  'Vintage Collector',
  'Inspired by our 1950s archives, this vintage-style piece captures the golden age of watchmaking.',
  (SELECT id FROM categories WHERE slug = 'classic-collection'),
  2650.00,
  2385.00,
  ARRAY['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg'],
  ARRAY['Gold', 'Silver', 'Bronze'],
  ARRAY['39mm', '41mm'],
  10,
  false,
  true,
  false
),
(
  'Moonphase Mystique',
  'Featuring a romantic moonphase complication, this watch celebrates the celestial dance above.',
  (SELECT id FROM categories WHERE slug = 'limited-edition'),
  5200.00,
  NULL,
  ARRAY['https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg', 'https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg'],
  ARRAY['Blue', 'Black', 'Silver'],
  ARRAY['40mm', '42mm'],
  3,
  true,
  true,
  true
);
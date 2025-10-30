/*
  # Add clothing categories with gender field

  1. New Tables
    - Add gender field to categories table
    - Insert clothing categories for men and women
  
  2. Categories
    - Men's: Shirts, Suits, Casual Wear, Accessories
    - Women's: Dresses, Blouses, Skirts, Accessories
  
  3. Products
    - Update existing products to match clothing theme
    - Add proper clothing categories
*/

-- Add gender field to categories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'gender'
  ) THEN
    ALTER TABLE categories ADD COLUMN gender text;
  END IF;
END $$;

-- Clear existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM reviews;
DELETE FROM products;
DELETE FROM categories;

-- Insert clothing categories
INSERT INTO categories (name, slug, description, gender) VALUES
('Shirts', 'shirts', 'Premium dress shirts and casual shirts', 'men'),
('Suits', 'suits', 'Luxury tailored suits and formal wear', 'men'),
('Casual Wear', 'casual-wear', 'Comfortable casual clothing', 'men'),
('Men''s Accessories', 'mens-accessories', 'Ties, belts, and accessories', 'men'),
('Dresses', 'dresses', 'Elegant dresses for every occasion', 'women'),
('Blouses', 'blouses', 'Designer blouses and tops', 'women'),
('Skirts', 'skirts', 'Premium skirts and bottoms', 'women'),
('Women''s Accessories', 'womens-accessories', 'Scarves, jewelry, and accessories', 'women');

-- Insert clothing products
INSERT INTO products (name, description, category_id, price, discount_price, images, colors, sizes, stock, is_featured, is_new, is_limited) VALUES
(
  'Premium Cotton Dress Shirt',
  'Luxurious Egyptian cotton dress shirt with mother-of-pearl buttons and French cuffs. Perfect for business or formal occasions.',
  (SELECT id FROM categories WHERE slug = 'shirts'),
  285,
  225,
  ARRAY[
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
  ],
  ARRAY['White', 'Light Blue', 'Navy', 'Pink'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  25,
  true,
  false,
  false
),
(
  'Silk Evening Dress',
  'Elegant silk evening dress with hand-sewn details and flowing silhouette. Perfect for special occasions and formal events.',
  (SELECT id FROM categories WHERE slug = 'dresses'),
  850,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
  ],
  ARRAY['Black', 'Navy', 'Burgundy', 'Emerald'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  12,
  true,
  true,
  false
),
(
  'Tailored Business Suit',
  'Hand-tailored wool suit with peak lapels and custom lining options. Made from premium Italian wool.',
  (SELECT id FROM categories WHERE slug = 'suits'),
  1850,
  1450,
  ARRAY[
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
  ],
  ARRAY['Charcoal', 'Navy', 'Black', 'Grey'],
  ARRAY['38', '40', '42', '44', '46', '48'],
  8,
  false,
  true,
  true
),
(
  'Cashmere Blend Sweater',
  'Luxurious cashmere blend sweater with ribbed details and perfect fit. Ideal for casual elegance.',
  (SELECT id FROM categories WHERE slug = 'casual-wear'),
  425,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
  ],
  ARRAY['Cream', 'Navy', 'Grey', 'Camel'],
  ARRAY['S', 'M', 'L', 'XL'],
  18,
  false,
  false,
  false
),
(
  'Designer Silk Blouse',
  'Sophisticated silk blouse with French seams and pearl button details. Crafted from premium mulberry silk.',
  (SELECT id FROM categories WHERE slug = 'blouses'),
  385,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
  ],
  ARRAY['Ivory', 'Blush', 'Navy', 'Black'],
  ARRAY['XS', 'S', 'M', 'L'],
  15,
  true,
  false,
  true
),
(
  'Pleated Midi Skirt',
  'Elegant pleated midi skirt in premium wool blend with hidden zipper and lined interior.',
  (SELECT id FROM categories WHERE slug = 'skirts'),
  295,
  235,
  ARRAY[
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
  ],
  ARRAY['Black', 'Navy', 'Camel', 'Grey'],
  ARRAY['XS', 'S', 'M', 'L'],
  22,
  false,
  true,
  false
),
(
  'Italian Leather Oxford Shoes',
  'Handcrafted Italian leather Oxford shoes with Goodyear welt construction. Perfect for formal occasions.',
  (SELECT id FROM categories WHERE slug = 'mens-accessories'),
  650,
  520,
  ARRAY[
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
  ],
  ARRAY['Black', 'Brown', 'Burgundy'],
  ARRAY['7', '8', '9', '10', '11', '12'],
  14,
  true,
  false,
  false
),
(
  'Luxury Cashmere Scarf',
  'Ultra-soft cashmere scarf with hand-finished edges. A timeless accessory for any wardrobe.',
  (SELECT id FROM categories WHERE slug = 'womens-accessories'),
  320,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
  ],
  ARRAY['Cream', 'Grey', 'Navy', 'Camel', 'Black'],
  ARRAY['One Size'],
  30,
  false,
  true,
  false
);
/*
  # Add Unisex Category Support

  1. Updates
    - Add 'unisex' as a valid gender option for categories
    - Insert sample unisex categories

  2. Security
    - Maintains existing RLS policies
*/

-- Add unisex gender option to categories
ALTER TABLE categories 
DROP CONSTRAINT IF EXISTS categories_gender_check;

ALTER TABLE categories 
ADD CONSTRAINT categories_gender_check 
CHECK (gender IN ('men', 'women', 'unisex'));

-- Insert sample unisex categories
INSERT INTO categories (name, slug, description, gender) VALUES
  ('Accessories', 'accessories', 'Premium accessories for everyone', 'unisex'),
  ('Bags', 'bags', 'Luxury bags and leather goods', 'unisex'),
  ('Watches', 'watches', 'Timepieces for all occasions', 'unisex'),
  ('Sunglasses', 'sunglasses', 'Designer eyewear collection', 'unisex')
ON CONFLICT (slug) DO NOTHING
/*
  # Add RLS policies for categories table

  1. Security Policies
    - Add policy for anyone to insert categories (for admin functionality)
    - Add policy for anyone to update categories (for admin functionality)
    - Add policy for anyone to delete categories (for admin functionality)
  
  Note: In production, these should be restricted to authenticated admin users only.
*/

-- Allow anyone to insert categories (for admin panel)
CREATE POLICY "Anyone can create categories"
  ON categories
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to update categories (for admin panel)
CREATE POLICY "Anyone can update categories"
  ON categories
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete categories (for admin panel)
CREATE POLICY "Anyone can delete categories"
  ON categories
  FOR DELETE
  TO anon, authenticated
  USING (true);
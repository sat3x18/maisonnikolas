/*
  # Create function to increment discount code usage

  1. New Functions
    - `increment_discount_usage` - Safely increments the current_uses counter for a discount code
  
  2. Security
    - Function is accessible to authenticated users
    - Returns updated discount code data
*/

CREATE OR REPLACE FUNCTION increment_discount_usage(discount_id uuid)
RETURNS TABLE(
  id uuid,
  code text,
  type text,
  value numeric,
  min_order_amount numeric,
  max_uses integer,
  current_uses integer,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE discount_codes 
  SET current_uses = current_uses + 1
  WHERE discount_codes.id = discount_id;
  
  RETURN QUERY
  SELECT 
    discount_codes.id,
    discount_codes.code,
    discount_codes.type,
    discount_codes.value,
    discount_codes.min_order_amount,
    discount_codes.max_uses,
    discount_codes.current_uses,
    discount_codes.valid_from,
    discount_codes.valid_until,
    discount_codes.is_active,
    discount_codes.created_at
  FROM discount_codes 
  WHERE discount_codes.id = discount_id;
END;
$$;
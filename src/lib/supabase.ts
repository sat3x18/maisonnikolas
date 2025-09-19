import { createClient } from '@supabase/supabase-js';

// -----------------------------
// Supabase clients
// -----------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// For normal frontend usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server/admin usage (service role)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// -----------------------------
// Types
// -----------------------------
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  gender?: 'men' | 'women';
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  price: number;
  discount_price?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  is_limited: boolean;
  created_at: string;
  category?: Category;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_surname: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  order_id: string;
  customer_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount: number;
  max_uses?: number;
  current_uses: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  applicable_products?: Product[];
  applicable_categories?: Category[];
}

export interface DiscountCodeApplication {
  discount_code_id: string;
  discount_amount: number;
}


// -----------------------------
// API Functions
// -----------------------------
export const api = {
  // -------- Categories --------
  getCategories: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  createCategory: async (categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert(categoryData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateCategory: async (id: string, categoryData: Partial<Omit<Category, 'id' | 'created_at'>>): Promise<Category> => {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // -------- Products --------
  getProducts: async (categoryId?: string, search?: string): Promise<Product[]> => {
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });
    if (categoryId) query = query.eq('category_id', categoryId);
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  getProduct: async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  createProduct: async (productData: Omit<Product, 'id' | 'created_at' | 'category'>): Promise<Product> => {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select('*, category:categories(*)')
      .single();
    if (error) throw error;
    return data;
  },

  updateProduct: async (id: string, productData: Partial<Omit<Product, 'id' | 'created_at' | 'category'>>): Promise<Product> => {
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(productData)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();
    if (error) throw error;
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // -------- Orders --------
  createOrder: async (orderData: Omit<Order, 'id' | 'created_at'>, items: Omit<OrderItem, 'id' | 'order_id'>[]): Promise<Order> => {
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    if (orderError) throw orderError;

    const orderItems = items.map(item => ({ ...item, order_id: order.id }));
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);
    if (itemsError) throw itemsError;

  
    return order;
  },

  getOrder: async (orderNumber: string): Promise<Order | null> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items:order_items(*, product:products(*))')
      .eq('order_number', orderNumber)
      .single();
    if (error) throw error;
    return data;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items:order_items(*, product:products(*))')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  updateOrderStatus: async (orderId: string, newStatus: string): Promise<void> => {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw error;

    await api.sendOrderStatusUpdate(order, newStatus);
  },

  // -------- Reviews --------
  getProductReviews: async (productId: string): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  createReview: async (reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // -------- Newsletter --------
  subscribeToNewsletter: async (email: string): Promise<NewsletterSubscriber> => {
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({ email })
      .select()
      .single();
    if (error) throw error;

    await api.sendNewsletterWebhook(email);
    return data;
  },

  getNewsletterSubscribers: async (): Promise<NewsletterSubscriber[]> => {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // -------- Discount Codes --------
  getDiscountCodes: async (): Promise<DiscountCode[]> => {
    const { data, error } = await supabase
      .from('discount_codes')
      .select(`
        *,
        discount_code_products(product_id, product:products(*)),
        discount_code_categories(category_id, category:categories(*))
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    
    return (data || []).map(code => ({
      ...code,
      applicable_products: code.discount_code_products?.map((dcp: any) => dcp.product) || [],
      applicable_categories: code.discount_code_categories?.map((dcc: any) => dcc.category) || []
    }));
  },

  validateDiscountCode: async (code: string, orderTotal: number, cartItems: CartItem[]): Promise<{ valid: boolean; discount?: DiscountCode; error?: string }> => {
    try {
      const { data: discountCode, error } = await supabase
        .from('discount_codes')
        .select(`
          *,
          discount_code_products(product_id),
          discount_code_categories(category_id)
        `)
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !discountCode) {
        return { valid: false, error: 'Invalid discount code' };
      }

      // Check if code is still valid (dates)
      const now = new Date();
      const validFrom = new Date(discountCode.valid_from);
      const validUntil = discountCode.valid_until ? new Date(discountCode.valid_until) : null;

      if (now < validFrom) {
        return { valid: false, error: 'Discount code is not yet active' };
      }

      if (validUntil && now > validUntil) {
        return { valid: false, error: 'Discount code has expired' };
      }

      // Check usage limits
      if (discountCode.max_uses && discountCode.current_uses >= discountCode.max_uses) {
        return { valid: false, error: 'Discount code has reached its usage limit' };
      }

      // Check minimum order amount
      if (orderTotal < discountCode.min_order_amount) {
        return { valid: false, error: `Minimum order amount is ₾${discountCode.min_order_amount}` };
      }

      // Check if discount applies to cart items
      const hasApplicableProducts = discountCode.discount_code_products?.length > 0;
      const hasApplicableCategories = discountCode.discount_code_categories?.length > 0;

      if (hasApplicableProducts || hasApplicableCategories) {
        const applicableProductIds = discountCode.discount_code_products?.map((dcp: any) => dcp.product_id) || [];
        const applicableCategoryIds = discountCode.discount_code_categories?.map((dcc: any) => dcc.category_id) || [];

        const hasApplicableItem = cartItems.some(item => 
          applicableProductIds.includes(item.product.id) ||
          applicableCategoryIds.includes(item.product.category_id)
        );

        if (!hasApplicableItem) {
          return { valid: false, error: 'Discount code does not apply to items in your cart' };
        }
      }

      return { valid: true, discount: discountCode };
    } catch (error) {
      console.error('Error validating discount code:', error);
      return { valid: false, error: 'Error validating discount code' };
    }
  },

  calculateDiscountAmount: (discountCode: any, orderTotal: number, cartItems: CartItem[]): number => {
    const hasApplicableProducts = discountCode.discount_code_products?.length > 0;
    const hasApplicableCategories = discountCode.discount_code_categories?.length > 0;

    let applicableTotal = orderTotal;

    // If discount is limited to specific products/categories, calculate applicable total
    if (hasApplicableProducts || hasApplicableCategories) {
      const applicableProductIds = discountCode.discount_code_products?.map((dcp: any) => dcp.product_id) || [];
      const applicableCategoryIds = discountCode.discount_code_categories?.map((dcc: any) => dcc.category_id) || [];

      applicableTotal = cartItems
        .filter(item => 
          applicableProductIds.includes(item.product.id) ||
          applicableCategoryIds.includes(item.product.category_id)
        )
        .reduce((total, item) => {
          const price = item.product.discount_price || item.product.price;
          return total + (price * item.quantity);
        }, 0);
    }

    if (discountCode.type === 'percentage') {
      return Math.min(applicableTotal * (discountCode.value / 100), applicableTotal);
    } else {
      return Math.min(discountCode.value, applicableTotal);
    }
  },

  createDiscountCode: async (discountData: Omit<DiscountCode, 'id' | 'created_at' | 'current_uses'>, productIds: string[] = [], categoryIds: string[] = []): Promise<DiscountCode> => {
    const { data: discountCode, error } = await supabaseAdmin
      .from('discount_codes')
      .insert({
        ...discountData,
        code: discountData.code.toUpperCase(),
        current_uses: 0
      })
      .select()
      .single();
    
    if (error) throw error;

    // Add product associations
    if (productIds.length > 0) {
      const productAssociations = productIds.map(productId => ({
        discount_code_id: discountCode.id,
        product_id: productId
      }));
      
      const { error: productError } = await supabaseAdmin
        .from('discount_code_products')
        .insert(productAssociations);
      
      if (productError) throw productError;
    }

    // Add category associations
    if (categoryIds.length > 0) {
      const categoryAssociations = categoryIds.map(categoryId => ({
        discount_code_id: discountCode.id,
        category_id: categoryId
      }));
      
      const { error: categoryError } = await supabaseAdmin
        .from('discount_code_categories')
        .insert(categoryAssociations);
      
      if (categoryError) throw categoryError;
    }

    return discountCode;
  },

  updateDiscountCode: async (id: string, discountData: Partial<Omit<DiscountCode, 'id' | 'created_at'>>, productIds: string[] = [], categoryIds: string[] = []): Promise<DiscountCode> => {
    const updateData = { ...discountData };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    const { data: discountCode, error } = await supabaseAdmin
      .from('discount_codes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    // Update product associations
    await supabaseAdmin.from('discount_code_products').delete().eq('discount_code_id', id);
    if (productIds.length > 0) {
      const productAssociations = productIds.map(productId => ({
        discount_code_id: id,
        product_id: productId
      }));
      
      const { error: productError } = await supabaseAdmin
        .from('discount_code_products')
        .insert(productAssociations);
      
      if (productError) throw productError;
    }

    // Update category associations
    await supabaseAdmin.from('discount_code_categories').delete().eq('discount_code_id', id);
    if (categoryIds.length > 0) {
      const categoryAssociations = categoryIds.map(categoryId => ({
        discount_code_id: id,
        category_id: categoryId
      }));
      
      const { error: categoryError } = await supabaseAdmin
        .from('discount_code_categories')
        .insert(categoryAssociations);
      
      if (categoryError) throw categoryError;
    }

    return discountCode;
  },

  deleteDiscountCode: async (id: string): Promise<void> => {
    const { error } = await supabaseAdmin
      .from('discount_codes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  applyDiscountToOrder: async (orderId: string, discountCodeId: string, discountAmount: number): Promise<void> => {
    // Record the discount usage
    const { error: usageError } = await supabaseAdmin
      .from('order_discount_codes')
      .insert({
        order_id: orderId,
        discount_code_id: discountCodeId,
        discount_amount: discountAmount
      });
    
    if (usageError) throw usageError;

    // Increment usage count
    const { error: incrementError } = await supabaseAdmin
      .from('discount_codes')
      .update({ current_uses: supabase.raw('current_uses + 1') })
      .eq('id', discountCodeId);
    
    if (incrementError) throw incrementError;
  },

  // -------- Discord Webhooks --------
  sendOrderWebhook: async (order: Order, items: Omit<OrderItem, 'id' | 'order_id'>[]) => {

    try {
      const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-webhook`;
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          order, 
          items, 
          type: 'order' 
        })
      });
    } catch (error) {
      console.error('Failed to send order webhook:', error);
    }
  },

  sendNewsletterWebhook: async (email: string) => {

    try {
      const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-webhook`;
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          order: { email }, 
          type: 'newsletter' 
        })
      });
    } catch (error) {
      console.error('Failed to send newsletter webhook:', error);
    }
  },

  sendOrderStatusUpdate: async (order: Order, newStatus: string) => {

    try {
      const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-webhook`;
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          order: { ...order, status: newStatus }, 
          type: 'status_update' 
        })
      });
    } catch (error) {
      console.error('Failed to send status update webhook:', error);
    }
  }
};

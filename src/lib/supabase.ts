import { createClient } from '@supabase/supabase-js';

// ---------------------------
// Environment variables
// ---------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing Supabase environment variables');
if (!supabaseServiceRoleKey) console.warn('Service role key not found! Admin functions will fail.');

// ---------------------------
// Clients
// ---------------------------
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// ---------------------------
// Types
// ---------------------------
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

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

// ---------------------------
// API Functions
// ---------------------------
export const api = {
  // ---------------------------
  // Categories (public)
  // ---------------------------
  getCategories: async (): Promise<Category[]> => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    return data || [];
  },

  // ---------------------------
  // Products (public)
  // ---------------------------
  getProducts: async (categoryId?: string, search?: string): Promise<Product[]> => {
    let query = supabase
      .from('products')
      .select(`*, category:categories(*)`)
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
      .select(`*, category:categories(*)`)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // product not found
      throw error;
    }
    return data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select(`*, category:categories(*)`)
      .eq('is_featured', true)
      .limit(6);

    if (error) throw error;
    return data || [];
  },

  // ---------------------------
  // Orders (public)
  // ---------------------------
  createOrder: async (orderData: Omit<Order, 'id' | 'created_at'>, items: Omit<OrderItem, 'id' | 'order_id'>[]): Promise<Order> => {
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({ ...item, order_id: order.id }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    await sendDiscordWebhook(order, items);
    return order;
  },

  getOrder: async (orderNumber: string): Promise<Order | null> => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*, product:products(*))
      `)
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // order not found
      throw error;
    }
    return data;
  },

  // ---------------------------
  // Reviews
  // ---------------------------
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

  // ---------------------------
  // Newsletter
  // ---------------------------
  subscribeToNewsletter: async (email: string): Promise<NewsletterSubscriber> => {
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({ email })
      .select()
      .single();

    if (error) throw error;
    await sendNewsletterWebhook(email);
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

  // ---------------------------
  // Admin functions (service role)
  // ---------------------------
  createProduct: async (productData: Omit<Product, 'id' | 'created_at' | 'category'>): Promise<Product> => {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select(`*, category:categories(*)`)
      .single();
    if (error) throw error;
    return data;
  },

  updateProduct: async (id: string, productData: Partial<Omit<Product, 'id' | 'created_at' | 'category'>>): Promise<Product> => {
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(productData)
      .eq('id', id)
      .select(`*, category:categories(*)`)
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

  getAllOrders: async (): Promise<Order[]> => {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`*, order_items:order_items(*, product:products(*))`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<void> => {
    const { error } = await supabaseAdmin.from('orders').update({ status }).eq('id', orderId);
    if (error) throw error;
  }
};

// ---------------------------
// Discord Webhooks
// ---------------------------
const sendDiscordWebhook = async (order: Order, items: Omit<OrderItem, 'id' | 'order_id'>[]) => {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const itemsText = items.map(i => `• ${i.quantity}x ${i.product?.name || 'Product'} (${i.color || 'N/A'}, ${i.size || 'N/A'}) - ₾${i.price}`).join('\n');
  const embed = {
    title: '🛍️ New Order Received!',
    color: 0xD4AF37,
    fields: [
      { name: 'Order Number', value: order.order_number, inline: true },
      { name: 'Customer', value: `${order.customer_name} ${order.customer_surname}`, inline: true },
      { name: 'Total Amount', value: `₾${order.total_amount}`, inline: true },
      { name: 'Contact', value: `📞 ${order.customer_phone}\n🏙️ ${order.customer_city}`, inline: true },
      { name: 'Payment Method', value: order.payment_method, inline: true },
      { name: 'Address', value: order.customer_address, inline: false },
      { name: 'Items', value: itemsText, inline: false }
    ],
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [embed] }) });
  } catch (err) { console.error('Failed Discord webhook:', err); }
};

const sendNewsletterWebhook = async (email: string) => {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const embed = {
    title: '📧 New Newsletter Subscription!',
    color: 0x1e3a8a,
    fields: [
      { name: 'Email', value: email, inline: true },
      { name: 'Subscribed At', value: new Date().toLocaleString(), inline: true },
      { name: 'Source', value: 'Maison Nikolas Website', inline: true }
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'Newsletter Subscription' }
  };

  try {
    await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [embed] }) });
  } catch (err) { console.error('Failed newsletter webhook:', err); }
};

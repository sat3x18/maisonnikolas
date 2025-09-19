import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Product, Category, api } from './lib/supabase';
import { CartProvider } from './contexts/CartContext';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import CategoryPage from './components/CategoryPage';
import NewsletterForm from './components/NewsletterForm';
import SalePage from './components/SalePage';
import ReviewPage from './components/ReviewPage';

const AdminApp: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

const MainApp: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock categories
  const mockCategories: Category[] = [
    { id: '1', name: 'Shirts', slug: 'shirts', description: 'Premium shirts collection', created_at: new Date().toISOString(), gender: 'men' },
    { id: '2', name: 'Suits', slug: 'suits', description: 'Luxury suits', created_at: new Date().toISOString(), gender: 'men' },
    { id: '3', name: 'Casual Wear', slug: 'casual', description: 'Casual clothing', created_at: new Date().toISOString(), gender: 'men' },
    { id: '4', name: 'Dresses', slug: 'dresses', description: 'Elegant dresses', created_at: new Date().toISOString(), gender: 'women' },
    { id: '5', name: 'Blouses', slug: 'blouses', description: 'Designer blouses', created_at: new Date().toISOString(), gender: 'women' },
    { id: '6', name: 'Skirts', slug: 'skirts', description: 'Premium skirts', created_at: new Date().toISOString(), gender: 'women' },
    { id: '7', name: 'Accessories', slug: 'accessories', description: 'Premium accessories for everyone', created_at: new Date().toISOString(), gender: 'unisex' },
    { id: '8', name: 'Bags', slug: 'bags', description: 'Luxury bags and leather goods', created_at: new Date().toISOString(), gender: 'unisex' },
    { id: '9', name: 'Watches', slug: 'watches', description: 'Timepieces for all occasions', created_at: new Date().toISOString(), gender: 'unisex' },
    { id: '10', name: 'Sunglasses', slug: 'sunglasses', description: 'Designer eyewear collection', created_at: new Date().toISOString(), gender: 'unisex' }
  ];

  // Mock products
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Classic Oxford Shirt',
      description: 'Premium cotton oxford shirt with button-down collar.',
      category_id: '1',
      price: 125,
      discount_price: 95,
      images: [
        'https://i.postimg.cc/MK2NNhK3/imgi-1-Untitled-design-4.png',
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
      ],
      colors: ['White', 'Light Blue', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 25,
      is_featured: true,
      is_new: false,
      is_limited: false,
      created_at: new Date().toISOString(),
      category: mockCategories[0]
    },
    {
      id: '2',
      name: 'Silk Midi Dress',
      description: 'Elegant silk dress perfect for any occasion.',
      category_id: '4',
      price: 285,
      images: [
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
      ],
      colors: ['Black', 'Navy', 'Burgundy'],
      sizes: ['XS', 'S', 'M', 'L'],
      stock: 12,
      is_featured: true,
      is_new: true,
      is_limited: false,
      created_at: new Date().toISOString(),
      category: mockCategories[3]
    },
    {
      id: '3',
      name: 'Wool Blazer',
      description: 'Tailored wool blazer with classic fit.',
      category_id: '2',
      price: 395,
      discount_price: 295,
      images: [
        'https://i.postimg.cc/MK2NNhK3/imgi-1-Untitled-design-4.png'
      ],
      colors: ['Navy', 'Charcoal', 'Black'],
      sizes: ['38', '40', '42', '44', '46'],
      stock: 8,
      is_featured: false,
      is_new: true,
      is_limited: false,
      created_at: new Date().toISOString(),
      category: mockCategories[1]
    },
    {
      id: '4',
      name: 'Leather Crossbody Bag',
      description: 'Premium leather crossbody bag perfect for any occasion.',
      category_id: '8',
      price: 195,
      images: [
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
      ],
      colors: ['Black', 'Brown', 'Tan'],
      sizes: ['One Size'],
      stock: 15,
      is_featured: true,
      is_new: false,
      is_limited: false,
      created_at: new Date().toISOString(),
      category: mockCategories[7]
    },
    {
      id: '5',
      name: 'Classic Watch',
      description: 'Timeless watch design with premium materials.',
      category_id: '9',
      price: 450,
      discount_price: 350,
      images: [
        'https://i.postimg.cc/MK2NNhK3/imgi-1-Untitled-design-4.png'
      ],
      colors: ['Silver', 'Gold', 'Black'],
      sizes: ['One Size'],
      stock: 8,
      is_featured: false,
      is_new: true,
      is_limited: true,
      created_at: new Date().toISOString(),
      category: mockCategories[8]
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.log('Supabase not configured, using mock data');
        setProducts(mockProducts);
        setCategories(mockCategories);
        setLoading(false);
        return;
      }

      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);

      setProducts(productsData.length > 0 ? productsData : mockProducts);
      setCategories(categoriesData.length > 0 ? categoriesData : mockCategories);
    } catch (error) {
      console.error('Error loading data, using mock data:', error);
      setProducts(mockProducts);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  const featuredProducts = products.filter(product => product.is_featured);
  const newProducts = products.filter(product => product.is_new);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-navy-900">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories} />
      
      {/* Hero Banner */}
      <section className="relative h-[600px] bg-gray-100 overflow-hidden">
        <img
          src="https://i.postimg.cc/MK2NNhK3/imgi-1-Untitled-design-4.png"
          alt="Hero Banner"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4 text-white">Tbilisi Wear</h1>
            <p className="text-xl mb-6 text-white">Timeless Elegance Since 2025</p>
            <Link
  to="/new-arrivals"
  className="bg-transparent text-white border border-white px-8 py-3 font-medium hover:bg-white hover:text-navy-900 transition-colors duration-200 inline-block"
>
  SHOP NOW
</Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">FEATURED</h2>
              <p className="text-gray-600">Handpicked pieces for the season</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">NEW ARRIVALS</h2>
              <p className="text-gray-600">The latest additions to our collection</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-navy-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">STAY IN TOUCH</h2>
          <p className="text-gray-300 mb-8">Be the first to know about new collections and exclusive offers</p>
          <NewsletterForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-navy-900 mb-6">Tbilisi Wear</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Since 2025, we have been creating timeless pieces that embody 
                elegance and sophistication for the modern wardrobe.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-navy-900 mb-6">Customer Care</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="contact" className="hover:text-navy-900 transition-colors duration-200">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 text-center">
            <p className="text-gray-500">
              © 2025 Tbilisi Wear. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router basename="/">
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/men" element={<Navigate to="/category/men" replace />} />
          <Route path="/women" element={<Navigate to="/category/women" replace />} />
          <Route path="/unisex" element={<Navigate to="/category/unisex" replace />} />
          <Route path="/new-arrivals" element={<Navigate to="/category/new-arrivals" replace />} />
          <Route path="/sale" element={<SalePage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:orderNumber" element={<OrderConfirmation />} />
          <Route path="/review/:orderNumber" element={<ReviewPage />} />
          <Route path="/admin" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;

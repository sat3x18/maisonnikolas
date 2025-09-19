import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, Grid, List, Tag } from 'lucide-react';
import { Product, Category, api } from '../lib/supabase';
import Header from './Header';
import ProductCard from './ProductCard';
import NewsletterForm from './NewsletterForm';

const SalePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('discount');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Mock data fallback
  const mockCategories: Category[] = [
    { id: '1', name: 'Shirts', slug: 'shirts', description: 'Premium shirts collection', created_at: new Date().toISOString(), gender: 'men' },
    { id: '2', name: 'Suits', slug: 'suits', description: 'Luxury suits', created_at: new Date().toISOString(), gender: 'men' },
    { id: '3', name: 'Casual Wear', slug: 'casual', description: 'Casual clothing', created_at: new Date().toISOString(), gender: 'men' },
    { id: '4', name: 'Dresses', slug: 'dresses', description: 'Elegant dresses', created_at: new Date().toISOString(), gender: 'women' },
    { id: '5', name: 'Blouses', slug: 'blouses', description: 'Designer blouses', created_at: new Date().toISOString(), gender: 'women' },
    { id: '6', name: 'Skirts', slug: 'skirts', description: 'Premium skirts', created_at: new Date().toISOString(), gender: 'women' },
    { id: '7', name: 'Accessories', slug: 'accessories', description: 'Premium accessories for everyone', created_at: new Date().toISOString(), gender: 'unisex' },
    { id: '8', name: 'Bags', slug: 'bags', description: 'Luxury bags and leather goods', created_at: new Date().toISOString(), gender: 'unisex' }
  ];

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Classic Oxford Shirt',
      description: 'Premium cotton oxford shirt with button-down collar.',
      category_id: '1',
      price: 125,
      discount_price: 95,
      images: [
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
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
      id: '3',
      name: 'Wool Blazer',
      description: 'Tailored wool blazer with classic fit.',
      category_id: '2',
      price: 395,
      discount_price: 295,
      images: [
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
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
      discount_price: 150,
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
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let categoriesData = mockCategories;
      let productsData = mockProducts;

      try {
        const [apiCategories, apiProducts] = await Promise.all([
          api.getCategories(),
          api.getProducts()
        ]);
        
        if (apiCategories.length > 0) categoriesData = apiCategories;
        if (apiProducts.length > 0) productsData = apiProducts;
      } catch (error) {
        console.log('Using mock data due to API error:', error);
      }
      
      setCategories(categoriesData);
      
      // Filter only products with discount prices (sale items)
      const saleProducts = productsData.filter(p => p.discount_price);
      setProducts(saleProducts);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesCategory;
  });

  const sortProducts = (products: Product[]) => {
    switch (sortBy) {
      case 'discount':
        return [...products].sort((a, b) => {
          const discountA = a.discount_price ? ((a.price - a.discount_price) / a.price) * 100 : 0;
          const discountB = b.discount_price ? ((b.price - b.discount_price) / b.price) * 100 : 0;
          return discountB - discountA;
        });
      case 'price-low':
        return [...products].sort((a, b) => 
          (a.discount_price || a.price) - (b.discount_price || b.price)
        );
      case 'price-high':
        return [...products].sort((a, b) => 
          (b.discount_price || b.price) - (a.discount_price || a.price)
        );
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...products].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  };

  const sortedProducts = sortProducts(filteredProducts);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header categories={categories} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy-900 border-t-transparent mx-auto mb-4"></div>
            <p className="text-navy-900">Loading sale items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories} />
      
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gray-100 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg"
          alt="Sale Collection"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl font-serif font-bold mb-4">SALE</h1>
            <p className="text-xl mb-6">Selected Items at Special Prices</p>
            <p className="text-lg mb-8 leading-relaxed">
              Discover exceptional value on our premium collection. Quality and style at special prices.
            </p>
            <Link
  to="/new-arrivals"
  className="bg-transparent text-white border border-white px-8 py-3 font-medium hover:bg-white hover:text-navy-900 transition-colors duration-200 inline-block"
>
  SHOP NOW
</Link>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-navy-900 transition-colors duration-200">Home</Link>
          <span>/</span>
          <span className="text-navy-900 font-medium">Sale</span>
        </nav>

        {/* Filters and Sort */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-serif font-bold text-navy-900">Sale Items</h2>
            <span className="text-gray-500">({sortedProducts.length} items)</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-gray-50'} transition-colors duration-200`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-gray-50'} transition-colors duration-200`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.gender})
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
            >
              <option value="discount">Highest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-navy-900 mb-2">No sale items available</h3>
            <p className="text-gray-500 mb-6">Check back later for new sale items and special offers.</p>
            <Link
              to="/"
              className="bg-navy-900 text-white px-6 py-3 font-medium hover:bg-navy-800 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16 mt-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-serif font-bold text-navy-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8">Be the first to know about new collections and exclusive offers</p>
          <div className="bg-navy-900 py-8 px-6 rounded-lg">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalePage;
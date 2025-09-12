import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, Grid, List } from 'lucide-react';
import { Product, Category, api } from '../lib/supabase';
import Header from './Header';
import ProductCard from './ProductCard';
import NewsletterForm from './NewsletterForm';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCategorySelection, setShowCategorySelection] = useState(false);

  // Marketing content for different categories
  const getMarketingContent = (categoryName: string, gender?: string) => {
    const marketingData: { [key: string]: { title: string; subtitle: string; description: string; image: string } } = {
      'men': {
        title: 'Men\'s Collection',
        subtitle: 'Timeless Elegance for the Modern Gentleman',
        description: 'Discover our curated selection of premium menswear, crafted with the finest materials and attention to detail. From classic dress shirts to tailored suits, each piece embodies sophistication and style.',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
      },
      'women': {
        title: 'Women\'s Collection',
        subtitle: 'Sophisticated Style for the Modern Woman',
        description: 'Explore our exquisite women\'s collection featuring elegant dresses, luxurious blouses, and timeless pieces that celebrate femininity and grace. Each garment is designed to empower and inspire.',
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
      },
      'shirts': {
        title: 'Premium Shirts',
        subtitle: 'Crafted for Perfection',
        description: 'Our shirt collection features the finest cotton and silk fabrics, expertly tailored for the perfect fit. From business meetings to casual weekends, find your perfect shirt.',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
      },
      'suits': {
        title: 'Tailored Suits',
        subtitle: 'Bespoke Excellence',
        description: 'Experience the pinnacle of menswear with our collection of tailored suits. Each piece is crafted with precision and attention to detail for the discerning gentleman.',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
      },
      'dresses': {
        title: 'Elegant Dresses',
        subtitle: 'Grace and Sophistication',
        description: 'From cocktail parties to formal events, our dress collection offers timeless elegance and contemporary style for every occasion.',
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
      },
      'blouses': {
        title: 'Designer Blouses',
        subtitle: 'Refined Femininity',
        description: 'Discover our collection of silk and cotton blouses, designed to complement the modern woman\'s wardrobe with elegance and versatility.',
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
      },
      'casual': {
        title: 'Casual Wear',
        subtitle: 'Effortless Style',
        description: 'Comfortable yet sophisticated pieces for your everyday wardrobe. Quality craftsmanship meets relaxed elegance.',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
      },
      'skirts': {
        title: 'Premium Skirts',
        subtitle: 'Classic Silhouettes',
        description: 'Timeless skirts crafted from the finest fabrics, designed to flatter and enhance your natural elegance.',
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
      },
      'new-arrivals': {
        title: 'New Arrivals',
        subtitle: 'Latest from Maison Nikolas',
        description: 'Be the first to discover our newest pieces. Fresh designs that embody our commitment to timeless elegance and modern sophistication.',
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
      },
      'sale': {
        title: 'Sale Collection',
        subtitle: 'Exceptional Value on Premium Pieces',
        description: 'Discover our carefully selected sale items featuring the same exceptional quality and timeless style at special prices. Limited time offers on luxury pieces from our premium collections.',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
      }
    };

    // Default marketing content for new categories
    const defaultContent = {
      title: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
      subtitle: 'Premium Quality & Timeless Style',
      description: `Discover our exquisite ${categoryName.toLowerCase()} collection, featuring carefully curated pieces that embody the essence of luxury and sophistication. Each item is crafted with attention to detail and premium materials.`,
      image: gender === 'women' 
        ? 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
        : 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    };

    return marketingData[categoryName.toLowerCase()] || marketingData[slug || ''] || defaultContent;
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        api.getCategories(),
        api.getProducts()
      ]);
      
      setCategories(categoriesData);
      
      // Filter products and categories based on route
      let filteredProducts = [];
      let category = null;
      let shouldShowCategorySelection = false;

      if (slug) {
        if (slug === 'men') {
          // Show category selection for men
          shouldShowCategorySelection = true;
          filteredProducts = [];
        } else if (slug === 'women') {
          // Show category selection for women
          shouldShowCategorySelection = true;
          filteredProducts = [];
        } else if (slug === 'new-arrivals') {
          filteredProducts = productsData.filter(p => p.is_new);
        } else if (slug === 'sale') {
          filteredProducts = productsData.filter(p => p.discount_price);
        } else {
          category = categoriesData.find(c => c.slug === slug);
          if (category) {
            filteredProducts = productsData.filter(p => p.category_id === category.id);
          }
        }
      } else {
        filteredProducts = productsData;
      }

      setCurrentCategory(category);
      setProducts(filteredProducts);
      
      setShowCategorySelection(shouldShowCategorySelection);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products: Product[]) => {
    switch (sortBy) {
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

  const sortedProducts = sortProducts(products);
  const categoryName = currentCategory?.name || slug || 'Products';
  const marketingContent = getMarketingContent(
    currentCategory?.name || slug || 'products',
    currentCategory?.gender
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header categories={categories} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy-900 border-t-transparent mx-auto mb-4"></div>
            <p className="text-navy-900">Loading collection...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories} />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-gray-100">
        <img
          src={marketingContent.image}
          alt={marketingContent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl font-serif font-bold mb-4">{marketingContent.title}</h1>
            <p className="text-xl mb-6">{marketingContent.subtitle}</p>
            <p className="text-lg mb-8 leading-relaxed">{marketingContent.description}</p>
            <button className="bg-navy-900 text-white px-8 py-3 font-medium hover:bg-navy-800 transition-colors duration-200">
              SHOP NOW
            </button>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-navy-900 transition-colors duration-200">Home</Link>
          <span>/</span>
          <span className="text-navy-900 font-medium">{marketingContent.title}</span>
        </nav>

        {/* Show Category Selection for Men/Women */}
        {showCategorySelection ? (
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-navy-900 mb-8 text-center">
              {slug === 'men' ? 'Men\'s Categories' : 'Women\'s Categories'}
            </h2>
            <p className="text-center text-gray-600 mb-12">
              {slug === 'men' 
                ? 'Discover our premium men\'s collection across different categories'
                : 'Explore our elegant women\'s collection across different categories'
              }
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories
                .filter(cat => cat.gender === slug)
                .map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="group relative bg-white border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={category.gender === 'women' 
                          ? 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
                          : 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
                        }
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors duration-200">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-600 text-sm">
                          {category.description}
                        </p>
                      )}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-navy-900 font-medium text-sm uppercase tracking-wider">
                          Shop Now →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Sort */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-serif font-bold text-navy-900">
                  {marketingContent.title}
                </h2>
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

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 px-4 py-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
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
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-navy-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or check back later for new arrivals.</p>
                <Link
                  to="/"
                  className="bg-navy-900 text-white px-6 py-3 font-medium hover:bg-navy-800 transition-colors duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </>
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

export default CategoryPage;
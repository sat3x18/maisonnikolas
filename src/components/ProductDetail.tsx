import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Truck, Shield } from 'lucide-react';
import { Product, Review, Category, api } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import Header from './Header';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem, openCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      loadProduct();
      loadReviews();
      loadCategories();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProduct = async () => {
    try {
      const data = await api.getProduct(id!);
      setProduct(data);
      if (data?.colors.length) setSelectedColor(data.colors[0]);
      if (data?.sizes.length) setSelectedSize(data.sizes[0]);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await api.getProductReviews(id!);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, selectedColor, selectedSize);
    openCart();
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 4.8;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-navy-900">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="bg-navy-900 text-white px-6 py-3 hover:bg-navy-800 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-navy-900">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <span>{product.category.name}</span>
              <span>/</span>
            </>
          )}
          <span className="text-navy-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4 lg:sticky lg:top-8">
            <div className="relative">
              <img
                src={product.images[selectedImage] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                alt={product.name}
                className="w-full h-96 lg:h-[700px] object-cover object-center rounded-lg shadow-lg"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.is_new && (
                  <span className="bg-navy-900 text-white px-3 py-1 text-xs font-medium tracking-wider shadow-lg">
                    NEW
                  </span>
                )}
                {product.is_limited && (
                  <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium tracking-wider shadow-lg">
                    LIMITED
                  </span>
                )}
              </div>

              {discountPercentage > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium tracking-wider shadow-lg">
                    -{discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 overflow-hidden border-2 rounded-lg transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-navy-900' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
                <span className="text-sm text-gray-500">
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 lg:pl-8">
            <div>
              {product.category && (
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  {product.category.name}
                </p>
              )}

              <h1 className="text-3xl font-bold text-navy-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating) 
                          ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              {product.discount_price ? (
                <>
                  <span className="text-4xl font-bold text-navy-900">
                    ₾{product.discount_price}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    ₾{product.price}
                  </span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 text-sm font-medium rounded-full">
                    Save ₾{(product.price - product.discount_price).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-4xl font-bold text-navy-900">
                  ₾{product.price}
                </span>
              )}
              </div>

              {product.description && (
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-navy-900 mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-sm rounded-lg transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-navy-900 bg-navy-900 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-navy-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-sm rounded-lg transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-navy-900 bg-navy-900 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="border-t border-gray-200 pt-6">
             <h3 className="text-sm font-medium text-navy-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-lg font-medium">-</span>
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                  disabled={quantity >= product.stock}
                >
                  <span className="text-lg font-medium">+</span>
                </button>
                <span className="text-sm text-gray-500 ml-4">
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-navy-900 text-white py-4 px-8 rounded-lg font-medium text-lg hover:bg-navy-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg"
            >
              <ShoppingCart className="h-6 w-6" />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
            </button>

            {/* Features */}
            <div className="border-t border-gray-200 pt-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-navy-900" />
                  <div>
                    <p className="font-medium text-navy-900">Free Shipping</p>
                    <p className="text-xs text-gray-500">In Tbilisi</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-navy-900" />
                  <div>
                    <p className="font-medium text-navy-900">Quality Guarantee</p>
                    <p className="text-xs text-gray-500">Premium materials</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-navy-900" />
                  <div>
                    <p className="font-medium text-navy-900">Secure Packaging</p>
                    <p className="text-xs text-gray-500">Careful handling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-20 border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-12 text-center">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-navy-900">{review.customer_name}</h4>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${
                            star <= review.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 mb-4">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
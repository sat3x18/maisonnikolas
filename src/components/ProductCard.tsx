import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addItem, openCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  };

  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="flex items-center space-x-6 p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <Link to={`/product/${product.id}`} className="relative w-32 h-32 flex-shrink-0">
          <img
            src={product.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
            alt={product.name}
            className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-200"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {product.is_new && (
              <span className="bg-navy-900 text-white px-2 py-1 text-xs font-medium tracking-wider shadow-sm">
                NEW
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium tracking-wider shadow-sm">
                -{discountPercentage}%
              </span>
            )}
          </div>
        </Link>

        <div className="flex-1">
          <Link to={`/product/${product.id}`}>
            {product.category && (
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                {product.category.name}
              </p>
            )}

            <h3 className="text-lg font-medium text-navy-900 mb-2 hover:text-navy-700 transition-colors duration-200">
              {product.name}
            </h3>

            <div className="flex items-center space-x-2 mb-3">
              {product.discount_price ? (
                <>
                  <span className="text-xl font-medium text-navy-900">
                    ₾{product.discount_price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₾{product.price}
                  </span>
                </>
              ) : (
                <span className="text-xl font-medium text-navy-900">
                  ₾{product.price}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="flex items-center space-x-1 mb-3">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 border border-gray-300"
                    style={{
                      backgroundColor: color.toLowerCase() === 'white' ? '#FFFFFF' :
                                     color.toLowerCase() === 'black' ? '#000000' :
                                     color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                     color.toLowerCase() === 'grey' || color.toLowerCase() === 'gray' ? '#6B7280' :
                                     '#6B7280'
                    }}
                    title={color}
                  ></div>
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
                )}
              </div>
            )}
          </Link>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={handleAddToCart}
            className="bg-navy-900 text-white px-6 py-2 font-medium hover:bg-navy-800 transition-colors duration-200"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white">
      <Link to={`/product/${product.id}`} className="relative overflow-hidden bg-gray-100 aspect-square block">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {product.is_new && (
            <span className="bg-navy-900 text-white px-2 py-1 text-xs font-medium tracking-wider shadow-sm">
              NEW
            </span>
          )}
          {product.is_limited && (
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium tracking-wider shadow-sm">
              LIMITED
            </span>
          )}
        </div>

        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium tracking-wider shadow-sm">
              -{discountPercentage}% OFF
            </span>
          </div>
        )}
      </Link>
      
      <div className="relative">
        {/* Add to Cart Button */}
        <div className="absolute -top-16 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="bg-navy-900 text-white p-3 hover:bg-navy-800 transition-colors duration-200 shadow-lg mr-2"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="bg-white text-navy-900 p-3 hover:bg-gray-100 transition-colors duration-200 shadow-lg border border-navy-900 inline-block"
          >
            <span className="text-xs font-medium">BUY</span>
          </Link>
        </div>
      </div>

      <Link to={`/product/${product.id}`} className="block pt-4">
        {product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            {product.category.name}
          </p>
        )}

        <h3 className="font-medium text-navy-900 mb-2 group-hover:text-navy-600 transition-colors duration-200">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 mb-3">
          {product.discount_price ? (
            <>
              <span className="text-lg font-medium text-navy-900">
                ₾{product.discount_price}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₾{product.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-medium text-navy-900">
              ₾{product.price}
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex items-center space-x-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 border border-gray-300"
                style={{
                  backgroundColor: color.toLowerCase() === 'white' ? '#FFFFFF' :
                                 color.toLowerCase() === 'black' ? '#000000' :
                                 color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                 color.toLowerCase() === 'grey' || color.toLowerCase() === 'gray' ? '#6B7280' :
                                 '#6B7280'
                }}
                title={color}
              ></div>
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </Link>
    </div>
  );
};

export default ProductCard
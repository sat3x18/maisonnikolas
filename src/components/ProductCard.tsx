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

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.is_new && (
            <span className="bg-black text-white px-2 py-1 text-xs font-semibold rounded">
              NEW
            </span>
          )}
          {product.is_limited && (
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">
              LIMITED
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-green-700 text-white px-2 py-1 text-xs font-semibold rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Add to Cart / Buy buttons on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-20 transition-opacity duration-300 space-x-2">
          <button
            onClick={handleAddToCart}
            className="bg-black text-white p-3 rounded shadow hover:bg-gray-900 transition-colors duration-200"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="bg-white text-black px-3 py-2 rounded shadow hover:bg-gray-100 transition-colors duration-200"
          >
            Buy
          </Link>
        </div>
      </Link>

      <div className="p-4 text-center">
        {product.category && (
          <p className="text-xs text-gray-500 uppercase mb-1">{product.category.name}</p>
        )}
        <h3 className="font-medium text-black text-base mb-2">{product.name}</h3>

        <div className="flex items-center justify-center space-x-2 mb-2">
          {product.discount_price ? (
            <>
              <span className="text-lg font-bold text-black">
                ₾{product.discount_price}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₾{product.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-black">
              ₾{product.price}
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex items-center justify-center space-x-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
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
      </div>
    </div>
  );
};

export default ProductCard;

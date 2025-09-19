import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Category } from '../lib/supabase';

interface HeaderProps {
  categories: Category[];
}

const Header: React.FC<HeaderProps> = ({ categories }) => {
  const { state, toggleCart, getTotalItems, removeItem, updateQuantity } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Page detection
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product');

  // Dynamic classes
  const headerBgClass = isProductPage ? 'bg-white' : 'bg-transparent';
  const textColorClass = isProductPage ? 'text-black' : 'text-white';
  const iconColorClass = isProductPage ? 'text-black' : 'text-white';

  const menCategories = categories.filter(cat => cat.gender === 'men');
  const womenCategories = categories.filter(cat => cat.gender === 'women');
  const unisexCategories = categories.filter(cat => cat.gender === 'unisex');

  return (
    <>
      <header className={`${headerBgClass} border-b border-gray-100 sticky top-0 z-50 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className={`flex-1 flex justify-center md:justify-center ${textColorClass} font-serif font-bold text-2xl tracking-tight`}>
              TBILISI WEAR
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-start">
              {/* Men's Dropdown */}
              <div className="relative group">
                <button className={`hover:opacity-80 font-medium py-2 transition-colors duration-200 uppercase tracking-wide ${textColorClass}`}>
                  MEN
                </button>
                <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {menCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-4 py-3 text-sm text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Women's Dropdown */}
              <div className="relative group">
                <button className={`hover:opacity-80 font-medium py-2 transition-colors duration-200 uppercase tracking-wide ${textColorClass}`}>
                  WOMEN
                </button>
                <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {womenCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-4 py-3 text-sm text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Unisex Dropdown */}
              <div className="relative group">
                <button className={`hover:opacity-80 font-medium py-2 transition-colors duration-200 uppercase tracking-wide ${textColorClass}`}>
                  UNISEX
                </button>
                <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {unisexCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-4 py-3 text-sm text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                to="/sale" 
                className={`hover:opacity-80 font-medium transition-colors duration-200 uppercase tracking-wide ${textColorClass}`}
              >
                SALE
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleCart}
                className={`relative hover:opacity-80 transition-colors duration-200 ${iconColorClass}`}
              >
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <Link
                to="/admin"
                className={`hover:opacity-80 transition-colors duration-200 ${iconColorClass}`}
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden hover:opacity-80 transition-colors duration-200 ${iconColorClass}`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-4">
                <div>
                  <h3 className="font-bold text-black px-4 py-2 text-sm">MEN</h3>
                  {menCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-6 py-2 text-black hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                <div>
                  <h3 className="font-bold text-black px-4 py-2 text-sm">UNISEX</h3>
                  {unisexCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-6 py-2 text-black hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                <div>
                  <h3 className="font-bold text-black px-4 py-2 text-sm">WOMEN</h3>
                  {womenCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-6 py-2 text-black hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                <Link 
                  to="/sale" 
                  className="text-black font-medium py-2 px-4 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SALE
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleCart}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-black">Shopping Bag</h2>
              <button
                onClick={toggleCart}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">Your bag is empty</h3>
                  <p className="text-gray-500 mb-6">Add items to get started.</p>
                  <button
                    onClick={toggleCart}
                    className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item, index) => (
                    <div key={index} className="py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-4 mb-3">
                        <img
                          src={item.product.images[0] || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-black">{item.product.name}</h3>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.color && <span>{item.color}</span>}
                            <span> • Qty: {item.quantity}</span>
                          </div>
                          <div className="font-medium text-black mt-1">
                            ₾{((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeItem(index)}
                            className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.color, item.size)}
                            className="bg-gray-200 text-black w-8 h-8 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-black font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.color, item.size)}
                            className="bg-gray-200 text-black w-8 h-8 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">
                          ₾{(item.product.discount_price || item.product.price).toFixed(2)} each
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {state.items.length > 0 && (
              <div className="border-t border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-black">Total</span>
                  <span className="text-lg font-bold text-black">
                    ₾{(state.items.reduce((total, item) => {
                      const price = item.product.discount_price || item.product.price;
                      return total + (price * item.quantity);
                    }, 0) - state.discountAmount).toFixed(2)}
                  </span>
                </div>

                {state.appliedDiscount && (
                  <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <div className="flex items-center justify-between text-green-800">
                      <span>Discount: {state.appliedDiscount.code}</span>
                      <span>-₾{state.discountAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="w-full bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors duration-200 text-center block font-medium"
                >
                  Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

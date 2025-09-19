import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Category } from '../lib/supabase';

interface HeaderProps {
  categories: Category[];
}

const Header: React.FC<HeaderProps> = ({ categories }) => {
  const { state, toggleCart, getTotalItems, removeItem, updateQuantity } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const menCategories = categories.filter(cat => cat.gender === 'men');
  const womenCategories = categories.filter(cat => cat.gender === 'women');

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-navy-900 tracking-tight font-serif">
                MAISON NIKOLAS
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Men's Dropdown */}
              <div className="relative group">
                <button className="text-navy-900 hover:text-navy-700 font-medium py-2 transition-colors duration-200 uppercase tracking-wide">
                  {t('header.men')}
                </button>
                
                <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {menCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-4 py-3 text-sm text-navy-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Women's Dropdown */}
              <div className="relative group">
                <button className="text-navy-900 hover:text-navy-700 font-medium py-2 transition-colors duration-200 uppercase tracking-wide">
                  {t('header.women')}
                </button>
                
                <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {womenCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-4 py-3 text-sm text-navy-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

             
              <Link 
                to="/sale" 
                className="text-navy-900 hover:text-navy-700 font-medium transition-colors duration-200 uppercase tracking-wide"
              >
                {t('header.sale')}
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setLanguage('ka')}
                  className={`px-2 py-1 text-xs font-medium transition-colors duration-200 ${
                    language === 'ka' 
                      ? 'bg-navy-900 text-white' 
                      : 'text-navy-900 hover:bg-gray-100'
                  }`}
                >
                  ქარ
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-xs font-medium transition-colors duration-200 ${
                    language === 'en' 
                      ? 'bg-navy-900 text-white' 
                      : 'text-navy-900 hover:bg-gray-100'
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={toggleCart}
                className="relative text-navy-900 hover:text-navy-700 transition-colors duration-200"
              >
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-navy-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <Link
                to="/admin"
                className="text-navy-900 hover:text-navy-700 transition-colors duration-200"
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-navy-900 hover:text-navy-700 transition-colors duration-200"
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
                  <h3 className="font-bold text-navy-900 px-4 py-2 text-sm">{t('header.men')}</h3>
                  {menCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-6 py-2 text-navy-900 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-bold text-navy-900 px-4 py-2 text-sm">{t('header.women')}</h3>
                  {womenCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-6 py-2 text-navy-900 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                
                <Link 
                  to="/sale" 
                  className="text-red-600 hover:bg-gray-50 font-medium py-2 px-4 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.sale')}
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
              <h2 className="text-lg font-bold text-navy-900">{t('header.shopping_bag')}</h2>
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
                  <h3 className="text-lg font-medium text-navy-900 mb-2">{t('header.your_bag_empty')}</h3>
                  <p className="text-gray-500 mb-6">{t('header.add_items')}</p>
                  <button
                    onClick={toggleCart}
                    className="bg-navy-900 text-white px-6 py-2 hover:bg-navy-800 transition-colors duration-200"
                  >
                    {t('header.continue_shopping')}
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
                          <h3 className="font-medium text-navy-900">{item.product.name}</h3>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.color && <span>{item.color}</span>}
                            <span> • Qty: {item.quantity}</span>
                          </div>
                          <div className="font-medium text-navy-900 mt-1">
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
                            className="bg-gray-200 text-navy-900 w-8 h-8 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-navy-900 font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.color, item.size)}
                            className="bg-gray-200 text-navy-900 w-8 h-8 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">
                          ₾{(item.product.discount_price || item.product.price).toFixed(2)} {t('header.each')}
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
                  <span className="text-lg font-medium text-navy-900">{t('cart.total')}</span>
                  <span className="text-lg font-bold text-navy-900">
                    ₾{state.items.reduce((total, item) => {
                      const price = item.product.discount_price || item.product.price;
                      return total + (price * item.quantity);
                    }, 0).toFixed(2)}
                  </span>
                </div>
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="w-full bg-navy-900 text-white py-3 px-6 hover:bg-navy-800 transition-colors duration-200 text-center block font-medium"
                >
                  {t('header.checkout')}
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
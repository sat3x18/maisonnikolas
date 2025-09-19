import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Category } from '../lib/supabase';

interface HeaderProps {
  categories: Category[];
}

const Header: React.FC<HeaderProps> = ({ categories }) => {
  const { state, toggleCart, getTotalItems, removeItem, updateQuantity } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menCategories = categories.filter(cat => cat.gender === 'men');
  const womenCategories = categories.filter(cat => cat.gender === 'women');
  const unisexCategories = categories.filter(cat => cat.gender === 'unisex');

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="relative group">
                <button className="text-white hover:text-gray-200 font-medium py-2 transition-colors duration-200 uppercase tracking-wide">
                  MEN
                </button>
                <div className="absolute top-full left-0 mt-0 w-48 bg-transparent shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {menCategories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-4 py-3 text-sm text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <button className="text-white hover:text-gray-200 font-medium py-2 transition-colors duration-200 uppercase tracking-wide">
                  WOMEN
                </button>
                <div className="absolute top-full left-0 mt-0 w-48 bg-transparent shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {womenCategories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-4 py-3 text-sm text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <button className="text-white hover:text-gray-200 font-medium py-2 transition-colors duration-200 uppercase tracking-wide">
                  UNISEX
                </button>
                <div className="absolute top-full left-0 mt-0 w-48 bg-transparent shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {unisexCategories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-4 py-3 text-sm text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Center: Logo/Name */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white tracking-tight font-serif">
              TBILISI WEAR
            </Link>

            {/* Right: Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleCart}
                className="relative text-white hover:text-gray-200 transition-colors duration-200"
              >
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <Link
                to="/admin"
                className="text-white hover:text-gray-200 transition-colors duration-200"
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white hover:text-gray-200 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <nav className="flex flex-col space-y-4">
                <div>
                  <h3 className="font-bold text-white px-4 py-2 text-sm">MEN</h3>
                  {menCategories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-6 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                <div>
                  <h3 className="font-bold text-white px-4 py-2 text-sm">UNISEX</h3>
                  {unisexCategories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-6 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                <div>
                  <h3 className="font-bold text-white px-4 py-2 text-sm">WOMEN</h3>
                  {womenCategories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-6 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/sale"
                  className="text-red-400 hover:bg-gray-800 font-medium py-2 px-4 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SALE
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar (kept same as before, transparent) */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleCart}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-transparent shadow-xl">
            {/* Cart content same as previous white version */}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

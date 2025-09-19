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
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {['MEN','WOMEN','UNISEX'].map((gender) => {
                const cats = gender==='MEN'?menCategories:gender==='WOMEN'?womenCategories:unisexCategories;
                return (
                  <div key={gender} className="relative group">
                    <button className="text-white font-medium py-2 transition-colors duration-200 uppercase tracking-wide">{gender}</button>
                    <div className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {cats.map(cat => (
                        <Link key={cat.id} to={`/category/${cat.slug}`} className="block px-4 py-3 text-sm text-navy-900 hover:bg-blue-50">{cat.name}</Link>
                      ))}
                    </div>
                  </div>
                )
              })}
              <Link to="/sale" className="text-red-600 font-medium py-2 px-4 hover:text-red-400">SALE</Link>
            </nav>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white tracking-tight font-serif">TBILISI WEAR</Link>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <button onClick={toggleCart} className="relative text-white hover:text-gray-200 transition-colors duration-200">
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{getTotalItems()}</span>
                )}
              </button>

              {/* Login */}
              <Link to="/admin" className="text-white hover:text-gray-200 transition-colors duration-200">
                <User className="h-5 w-5" />
              </Link>

              {/* Hamburger */}
              <div className="md:hidden ml-2">
                <button onClick={()=>setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-gray-200 transition-colors duration-200">
                  {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 w-full bg-white shadow-lg rounded-b-lg">
              <nav className="flex flex-col px-2 py-2 space-y-1">
                {['MEN','UNISEX','WOMEN'].map((gender)=> {
                  const cats = gender==='MEN'?menCategories:gender==='WOMEN'?womenCategories:unisexCategories;
                  return (
                    <div key={gender}>
                      <h3 className="font-bold text-navy-900 px-4 py-2 text-sm">{gender}</h3>
                      {cats.map(cat => (
                        <Link key={cat.id} to={`/category/${cat.slug}`} className="block px-6 py-2 text-navy-900 hover:bg-blue-50 rounded" onClick={()=>setIsMenuOpen(false)}>{cat.name}</Link>
                      ))}
                    </div>
                  )
                })}
                <Link to="/sale" className="text-red-600 px-6 py-2 hover:bg-blue-50 rounded" onClick={()=>setIsMenuOpen(false)}>SALE</Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black bg-opacity-20" onClick={toggleCart}></div>
          <div className="ml-auto w-full max-w-md bg-white shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-navy-900">Shopping Bag</h2>
              <button onClick={toggleCart} className="text-gray-400 hover:text-navy-900"><X className="h-6 w-6"/></button>
            </div>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.items.length===0?(
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                  <h3 className="text-lg font-medium mb-2">Your bag is empty</h3>
                  <p className="text-gray-500 mb-6">Add items to get started.</p>
                  <button onClick={toggleCart} className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700">Continue Shopping</button>
                </div>
              ):(
                <div className="space-y-4">
                  {state.items.map((item,index)=>(
                    <div key={index} className="py-4 border-b border-gray-200">
                      <div className="flex items-center space-x-4 mb-3">
                        <img src={item.product.images[0]||'https://i.postimg.cc/MK2NNhK3/imgi-1-Untitled-design-4.png'} alt={item.product.name} className="w-16 h-16 object-cover"/>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <div className="text-sm text-gray-500 mt-1">{item.color && <span>{item.color}</span>} <span>• Qty: {item.quantity}</span></div>
                          <div className="font-medium mt-1">₾{((item.product.discount_price||item.product.price)*item.quantity).toFixed(2)}</div>
                          <button onClick={()=>removeItem(index)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4"/></button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button onClick={()=>updateQuantity(item.product.id,item.quantity-1,item.color,item.size)} className="bg-blue-50 text-navy-900 w-8 h-8 flex items-center justify-center hover:bg-blue-100"><Minus className="h-3 w-3"/></button>
                          <span className="font-semibold w-8 text-center">{item.quantity}</span>
                          <button onClick={()=>updateQuantity(item.product.id,item.quantity+1,item.color,item.size)} className="bg-blue-50 text-navy-900 w-8 h-8 flex items-center justify-center hover:bg-blue-100"><Plus className="h-3 w-3"/></button>
                        </div>
                        <span className="text-sm text-gray-500">₾{(item.product.discount_price||item.product.price).toFixed(2)} each</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {state.items.length>0 && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-lg font-bold">₾{(state.items.reduce((total,item)=>total+(item.product.discount_price||item.product.price)*item.quantity,0)-state.discountAmount).toFixed(2)}</span>
                </div>
                {state.appliedDiscount && (
                  <div className="mb-4 p-2 bg-green-100 border border-green-400 rounded text-sm">
                    <div className="flex items-center justify-between text-green-800">
                      <span>Discount: {state.appliedDiscount.code}</span>
                      <span>-₾{state.discountAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <Link to="/checkout" onClick={toggleCart} className="w-full bg-blue-600 text-white py-3 px-6 hover:bg-blue-700 text-center block font-medium">Checkout</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

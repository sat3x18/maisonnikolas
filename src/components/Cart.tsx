import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { state, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Discover our luxury collection and add items to your cart.</p>
            <Link
              to="/"
              className="bg-navy-900 text-white font-bold py-3 px-8 hover:bg-navy-800 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Collection
            </Link>

            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
              <p className="text-gray-400 mb-8">Discover our luxury collection and add items to your cart.</p>
              <Link
                to="/"
                className="bg-gradient-to-r from-rolex-green to-rolex-green-dark text-white font-bold py-3 px-8 rounded-lg hover:from-rolex-green-dark hover:to-rolex-green transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-navy-900 hover:text-navy-700 transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-serif font-bold text-navy-900">Shopping Cart</h1>
              <button
                onClick={clearCart}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-6">
              {state.items.map((item, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 p-6">
                  <div className="flex items-start space-x-6">
                    <img
                      src={item.product.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-navy-900 mb-2">{item.product.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-gray-400 hover:text-gray-600 transition-colors duration-300 p-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.color, item.size)}
                            className="bg-gray-200 text-navy-900 w-10 h-10 hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-navy-900 font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.color, item.size)}
                            className="bg-gray-200 text-navy-900 w-10 h-10 hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            {item.product.discount_price ? (
                              <>
                                <span className="text-2xl font-bold text-navy-900">
                                  ₾{(item.product.discount_price * item.quantity).toFixed(2)}
                                </span>
                                <span className="text-lg text-gray-500 line-through">
                                  ₾{(item.product.price * item.quantity).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold text-navy-900">
                                ₾{(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">
                            ₾{(item.product.discount_price || item.product.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-navy-900 font-semibold">${getTotalPrice().toFixed(2)}</span>
                  <span className="text-navy-900 font-semibold">₾{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-navy-900 font-semibold">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-navy-900">Total</span>
                    <span className="text-2xl font-bold text-navy-900">${getTotalPrice().toFixed(2)}</span>
                    <span className="text-2xl font-bold text-navy-900">₾{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-navy-900 text-white font-bold py-4 px-6 hover:bg-navy-800 transition-all duration-300 text-center block mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="w-full bg-gray-200 text-navy-900 font-medium py-3 px-6 hover:bg-gray-300 transition-all duration-300 text-center block"
              >
                Continue Shopping
              </Link>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
               
                  <span>Free shipping in Tbilisi</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
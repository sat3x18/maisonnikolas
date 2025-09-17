import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, Lock, Tag, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { api, DiscountCode } from '../lib/supabase';

const Checkout: React.FC = () => {
  const { state, clearCart, getSubtotal, getFinalTotal, applyDiscount, removeDiscount } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    address: '',
    paymentMethod: 'cash'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderNumber = `ORD-${Date.now()}`;
      
      const orderData = {
        order_number: orderNumber,
        customer_name: formData.firstName,
        customer_surname: formData.lastName,
        customer_phone: formData.phone,
        customer_city: formData.city,
        customer_address: formData.address,
        payment_method: formData.paymentMethod,
        total_amount: getFinalTotal()
      };

      const orderItems = state.items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.discount_price || item.product.price,
        color: item.color,
        size: item.size
      }));

      await api.createOrder(orderData, orderItems);
      
      // Apply discount if one was used
      if (state.appliedDiscount) {
        // This would be handled in the createOrder function
        // await api.applyDiscountToOrder(order.id, state.appliedDiscount.id, state.discountAmount);
      }
      
      clearCart();
      navigate(`/order/${orderNumber}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    setDiscountLoading(true);
    setDiscountError('');
    
    try {
      const validation = await api.validateDiscountCode(discountCode.trim(), getSubtotal(), state.items);
      
      if (validation.valid && validation.discount) {
        const discountAmount = api.calculateDiscountAmount(validation.discount, getSubtotal(), state.items);
        applyDiscount(validation.discount, discountAmount);
        setDiscountCode('');
      } else {
        setDiscountError(validation.error || 'Invalid discount code');
      }
    } catch (error) {
      setDiscountError('Error applying discount code');
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    setDiscountError('');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Your cart is empty</h2>
          <Link
            to="/"
            className="bg-navy-900 text-white font-bold py-3 px-8 hover:bg-navy-800 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/cart"
          className="inline-flex items-center text-navy-900 hover:text-navy-700 transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <h1 className="text-3xl font-serif font-bold text-navy-900 mb-8">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center">
                  <Truck className="h-6 w-6 mr-3 text-navy-900" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-navy-900 text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-navy-900 text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-navy-900 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-navy-900 text-sm font-medium mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    placeholder="Enter your city"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-navy-900 text-sm font-medium mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center">
                  <CreditCard className="h-6 w-6 mr-3 text-navy-900" />
                  Payment Method
                </h2>
                
                <<div className="space-y-4">
  <label className="flex items-center space-x-3 cursor-pointer">
    <input
      type="radio"
      name="paymentMethod"
      value="cash"
      checked={formData.paymentMethod === 'cash'}
      onChange={handleInputChange}
      className="h-5 w-5 text-navy-900 border-gray-300 focus:ring-navy-900"
    />
    <span className="text-navy-900">TBC Bank</span>
  </label>
  
  <label className="flex items-center space-x-3 cursor-pointer">
    <input
      type="radio"
      name="paymentMethod"
      value="card"
      checked={formData.paymentMethod === 'card'}
      onChange={handleInputChange}
      className="h-5 w-5 text-navy-900 border-gray-300 focus:ring-navy-900"
    />
    <span className="text-navy-900">Bank Of Georgia</span>
  </label>
</div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy-900 text-white font-bold py-4 px-8 hover:bg-navy-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                <Lock className="h-5 w-5" />
                <span>{loading ? 'Processing...' : 'Place Order'}</span>
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 border border-gray-200 p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-navy-900">{item.product?.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        {item.color && <span>{item.color}</span>}
                        {item.size && <span>• {item.size}</span>}
                        <span>• Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-navy-900 font-bold">
                      ₾{((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-navy-900 font-semibold">₾{getSubtotal().toFixed(2)}</span>
                </div>
                
                {/* Discount Code Section */}
                <div className="border-t border-gray-200 pt-4">
                  {!state.appliedDiscount ? (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-navy-900">
                        Discount Code
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          placeholder="Enter discount code"
                          className="flex-1 px-3 py-2 border border-gray-300 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={handleApplyDiscount}
                          disabled={!discountCode.trim() || discountLoading}
                          className="bg-navy-900 text-white px-4 py-2 font-medium hover:bg-navy-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {discountLoading ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                      {discountError && (
                        <p className="text-red-600 text-sm">{discountError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 p-3 rounded">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Tag className="h-4 w-4 text-green-600" />
                          <span className="text-green-800 font-medium">{state.appliedDiscount.code}</span>
                          <span className="text-green-600 text-sm">
                            -{state.appliedDiscount.type === 'percentage' ? `${state.appliedDiscount.value}%` : `₾${state.appliedDiscount.value}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveDiscount}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {state.appliedDiscount && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount ({state.appliedDiscount.code})</span>
                    <span>-₾{state.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-navy-900 font-semibold">₾0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-navy-900">Total</span>
                    <span className="text-2xl font-bold text-navy-900">₾{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>Secure checkout protected by SSL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="h-4 w-4 text-green-400" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-4 w-4 text-green-400" />
                  <span>Multiple payment options available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
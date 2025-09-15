import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, CreditCard } from 'lucide-react';
import { Order, api, Category } from '../lib/supabase';
import Header from './Header';
import NewsletterForm from './NewsletterForm';

const OrderConfirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]); // load categories for Header

  useEffect(() => {
    loadCategories();
    if (orderNumber) loadOrder();
  }, [orderNumber]);

  const loadCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  const loadOrder = async () => {
    try {
      const data = await api.getOrder(orderNumber!);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header categories={categories} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy-900 border-t-transparent mx-auto mb-4"></div>
            <p className="text-navy-900">Loading order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Header categories={categories} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Order Not Found</h2>
            <p className="text-gray-500">The order you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/"
              className="mt-6 inline-block bg-navy-900 text-white px-6 py-3 font-medium hover:bg-navy-800 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header categories={categories} />

      {/* Hero Section */}
      <section className="relative h-[300px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-1">Thank you for your purchase</p>
          <p className="text-gray-500">Order #{order.order_number}</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-navy-900 transition-colors duration-200">Home</Link>
          <span>/</span>
          <span className="text-navy-900 font-medium">Order Confirmation</span>
        </nav>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-8 shadow-md mb-8">
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-6">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-navy-900 mb-4">Customer Information</h3>
              <p><span className="text-gray-400">Name:</span> {order.customer_name} {order.customer_surname}</p>
              <p><span className="text-gray-400">Phone:</span> {order.customer_phone}</p>
              <p><span className="text-gray-400">City:</span> {order.customer_city}</p>
              <p><span className="text-gray-400">Address:</span> {order.customer_address}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-navy-900 mb-4">Order Info</h3>
              <p><span className="text-gray-400">Order Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><span className="text-gray-400">Payment Method:</span> {order.payment_method}</p>
              <p><span className="text-gray-400">Status:</span> <span className="ml-2 font-medium">{order.status}</span></p>
              <p><span className="text-gray-400">Total:</span> <span className="font-bold text-lg ml-2">₾{order.total_amount}</span></p>
            </div>
          </div>

          {/* Items */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-navy-900 mb-4">Items Ordered</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {order.order_items?.map(item => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
                  <img
                    src={item.product?.images?.[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                    alt={item.product?.name || 'Product'}
                    className="w-32 h-32 object-cover rounded-lg mb-4"
                  />
                  <h4 className="text-navy-900 font-semibold">{item.product?.name}</h4>
                  <p className="text-gray-500 text-sm mt-1">{item.color || ''} {item.size || ''} • Qty: {item.quantity}</p>
                  <p className="text-navy-900 font-bold mt-2">₾{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              )) || <p className="text-gray-400 text-center">No items in this order.</p>}
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-gray-50 rounded-xl p-8 shadow-md mb-20">
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-6">Order Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-green-500 rounded-full p-3">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-green-600 font-medium">Order Placed</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div className={`h-full bg-green-400 transition-all duration-1000 ${order.status !== 'pending' ? 'w-full' : 'w-0'}`} />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className={`rounded-full p-3 ${order.status !== 'pending' ? 'bg-yellow-400' : 'bg-gray-300'}`}>
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${order.status !== 'pending' ? 'text-yellow-600' : 'text-gray-400'}`}>Processing</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div className={`h-full bg-blue-400 transition-all duration-1000 ${order.status === 'completed' ? 'w-full' : 'w-0'}`} />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className={`rounded-full p-3 ${order.status === 'completed' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${order.status === 'completed' ? 'text-blue-600' : 'text-gray-400'}`}>Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
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

export default OrderConfirmation;

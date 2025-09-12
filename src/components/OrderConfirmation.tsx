import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Star, Package, Truck, CreditCard } from 'lucide-react';
import { Order, api } from '../lib/supabase';

const OrderConfirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState<{ [key: string]: { rating: number; comment: string } }>({});
  const [submittingReview, setSubmittingReview] = useState<string | null>(null);

  useEffect(() => {
    if (orderNumber) {
      loadOrder();
    }
  }, [orderNumber]);

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

  const handleReviewSubmit = async (productId: string) => {
    if (!order || !reviewData[productId]) return;

    setSubmittingReview(productId);

    try {
      await api.createReview({
        product_id: productId,
        order_id: order.id,
        customer_name: `${order.customer_name} ${order.customer_surname}`,
        rating: reviewData[productId].rating,
        comment: reviewData[productId].comment
      });

      // Remove the review form after successful submission
      setReviewData(prev => {
        const newData = { ...prev };
        delete newData[productId];
        return newData;
      });

      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(null);
    }
  };

  const updateReviewData = (productId: string, field: 'rating' | 'comment', value: number | string) => {
    setReviewData(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating: prev[productId]?.rating || 0,
        comment: prev[productId]?.comment || '',
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-gray-400">The order you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-300 mb-2">Thank you for your purchase</p>
          <p className="text-gray-400">Order #{order.order_number}</p>
        </div>

        {/* Order Details */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Customer Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-400">Name:</span> {order.customer_name} {order.customer_surname}</p>
                <p><span className="text-gray-400">Phone:</span> {order.customer_phone}</p>
                <p><span className="text-gray-400">City:</span> {order.customer_city}</p>
                <p><span className="text-gray-400">Address:</span> {order.customer_address}</p>
              </div>
            </div>

            {/* Order Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-400">Order Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                <p><span className="text-gray-400">Payment Method:</span> {order.payment_method}</p>
                <p><span className="text-gray-400">Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'completed' ? 'bg-green-500 text-white' :
                    order.status === 'pending' ? 'bg-yellow-500 text-black' :
                    'bg-gray-500 text-white'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </p>
                <p><span className="text-gray-400">Total:</span> 
                  <span className="text-rolex-gold font-bold text-xl ml-2">${order.total_amount}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={item.product?.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{item.product?.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                        {item.color && <span>{item.color}</span>}
                        {item.size && <span>• {item.size}</span>}
                        <span>• Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-rolex-gold font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Review Section */}
                  {!reviewData[item.product_id] ? (
                    <div className="border-t border-gray-600 pt-4">
                      <button
                        onClick={() => updateReviewData(item.product_id, 'rating', 5)}
                        className="text-rolex-gold hover:text-rolex-light-gold transition-colors duration-300 text-sm font-medium"
                      >
                        Leave a Review
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-gray-600 pt-4 space-y-4">
                      <h5 className="text-white font-medium">Leave a Review</h5>
                      
                      {/* Star Rating */}
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">Rating:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => updateReviewData(item.product_id, 'rating', star)}
                              className="transition-colors duration-300"
                            >
                              <Star 
                                className={`h-5 w-5 ${
                                  star <= (reviewData[item.product_id]?.rating || 0)
                                    ? 'text-rolex-gold fill-current'
                                    : 'text-gray-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <textarea
                          placeholder="Share your experience with this product..."
                          value={reviewData[item.product_id]?.comment || ''}
                          onChange={(e) => updateReviewData(item.product_id, 'comment', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rolex-gold resize-none"
                          rows={3}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReviewSubmit(item.product_id)}
                          disabled={!reviewData[item.product_id]?.rating || submittingReview === item.product_id}
                          className="bg-gradient-to-r from-rolex-gold to-rolex-light-gold text-black font-bold py-2 px-4 rounded-lg hover:from-rolex-light-gold hover:to-rolex-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {submittingReview === item.product_id ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                          onClick={() => setReviewData(prev => {
                            const newData = { ...prev };
                            delete newData[item.product_id];
                            return newData;
                          })}
                          className="text-gray-400 hover:text-gray-300 transition-colors duration-300 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Order Status</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-green-500 rounded-full p-3">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-green-400 font-medium">Order Placed</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-700 mx-4">
              <div className={`h-full bg-gradient-to-r from-rolex-green to-rolex-gold transition-all duration-1000 ${
                order.status !== 'pending' ? 'w-full' : 'w-0'
              }`} />
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`rounded-full p-3 ${
                order.status !== 'pending' ? 'bg-rolex-gold' : 'bg-gray-600'
              }`}>
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                order.status !== 'pending' ? 'text-rolex-gold' : 'text-gray-400'
              }`}>Processing</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-700 mx-4">
              <div className={`h-full bg-gradient-to-r from-rolex-gold to-blue-400 transition-all duration-1000 ${
                order.status === 'completed' ? 'w-full' : 'w-0'
              }`} />
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`rounded-full p-3 ${
                order.status === 'completed' ? 'bg-blue-500' : 'bg-gray-600'
              }`}>
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                order.status === 'completed' ? 'text-blue-400' : 'text-gray-400'
              }`}>Delivered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
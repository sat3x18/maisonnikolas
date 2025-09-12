import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, CheckCircle, ArrowLeft } from 'lucide-react';
import { Order, api } from '../lib/supabase';

const ReviewPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<{ [key: string]: { rating: number; comment: string; customerName: string } }>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string[]>([]);

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

  const updateReview = (productId: string, field: 'rating' | 'comment' | 'customerName', value: number | string) => {
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating: prev[productId]?.rating || 0,
        comment: prev[productId]?.comment || '',
        customerName: prev[productId]?.customerName || '',
        [field]: value
      }
    }));
  };

  const submitReview = async (productId: string) => {
    if (!order || !reviews[productId] || !reviews[productId].rating || !reviews[productId].customerName.trim()) {
      alert('Please fill in all required fields (name and rating)');
      return;
    }

    setSubmitting(productId);

    try {
      await api.createReview({
        product_id: productId,
        order_id: order.id,
        customer_name: reviews[productId].customerName.trim(),
        rating: reviews[productId].rating,
        comment: reviews[productId].comment.trim()
      });

      setSubmitted(prev => [...prev, productId]);
      
      // Remove from reviews state
      setReviews(prev => {
        const newReviews = { ...prev };
        delete newReviews[productId];
        return newReviews;
      });

    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-navy-900">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="bg-navy-900 text-white px-6 py-3 hover:bg-navy-800 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (order.status !== 'completed') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Order Not Ready for Review</h2>
          <p className="text-gray-600 mb-6">You can only review completed orders.</p>
          <Link
            to="/"
            className="bg-navy-900 text-white px-6 py-3 hover:bg-navy-800 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const remainingItems = order.order_items?.filter(item => 
    !submitted.includes(item.product_id) && !reviews[item.product_id]
  ) || [];

  const allReviewsSubmitted = remainingItems.length === 0 && Object.keys(reviews).length === 0;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-navy-900 hover:text-navy-700 transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-navy-900 mb-4">Leave a Review</h1>
          <p className="text-xl text-gray-600 mb-2">Order #{order.order_number}</p>
          <p className="text-gray-500">Share your experience with the products you purchased</p>
        </div>

        {allReviewsSubmitted ? (
          <div className="text-center py-16">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Thank You!</h2>
            <p className="text-xl text-gray-600 mb-8">All reviews have been submitted successfully.</p>
            <Link
              to="/"
              className="bg-navy-900 text-white px-8 py-3 hover:bg-navy-800 transition-colors duration-200 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Items to Review */}
            {order.order_items?.map((item) => {
              if (submitted.includes(item.product_id)) {
                return (
                  <div key={item.id} className="bg-green-50 border border-green-200 p-6 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product?.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-navy-900">{item.product?.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          {item.color && <span>{item.color}</span>}
                          {item.size && <span>• {item.size}</span>}
                        </div>
                      </div>
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Review Submitted</span>
                      </div>
                    </div>
                  </div>
                );
              }

              const isReviewing = reviews[item.product_id];

              return (
                <div key={item.id} className="bg-white border border-gray-200 p-6 rounded-lg">
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={item.product?.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-navy-900 text-lg">{item.product?.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        {item.color && <span>{item.color}</span>}
                        {item.size && <span>• {item.size}</span>}
                        <span>• Qty: {item.quantity}</span>
                      </div>
                    </div>
                    {!isReviewing && (
                      <button
                        onClick={() => updateReview(item.product_id, 'rating', 5)}
                        className="bg-navy-900 text-white px-6 py-2 hover:bg-navy-800 transition-colors duration-200 font-medium"
                      >
                        Write Review
                      </button>
                    )}
                  </div>

                  {isReviewing && (
                    <div className="space-y-6 border-t border-gray-200 pt-6">
                      {/* Customer Name */}
                      <div>
                        <label className="block text-sm font-medium text-navy-900 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          value={reviews[item.product_id]?.customerName || ''}
                          onChange={(e) => updateReview(item.product_id, 'customerName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                          placeholder="Enter your name"
                          required
                        />
                      </div>

                      {/* Star Rating */}
                      <div>
                        <label className="block text-sm font-medium text-navy-900 mb-3">
                          Rating *
                        </label>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => updateReview(item.product_id, 'rating', star)}
                              className="transition-colors duration-200 hover:scale-110 transform"
                            >
                              <Star 
                                className={`h-8 w-8 ${
                                  star <= (reviews[item.product_id]?.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 hover:text-yellow-200'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-4 text-sm text-gray-600">
                            {reviews[item.product_id]?.rating ? `${reviews[item.product_id].rating} star${reviews[item.product_id].rating !== 1 ? 's' : ''}` : 'Click to rate'}
                          </span>
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-sm font-medium text-navy-900 mb-2">
                          Your Review (Optional)
                        </label>
                        <textarea
                          value={reviews[item.product_id]?.comment || ''}
                          onChange={(e) => updateReview(item.product_id, 'comment', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent resize-none"
                          placeholder="Share your thoughts about this product..."
                        />
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => submitReview(item.product_id)}
                          disabled={!reviews[item.product_id]?.rating || !reviews[item.product_id]?.customerName.trim() || submitting === item.product_id}
                          className="bg-navy-900 text-white px-8 py-3 hover:bg-navy-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          {submitting === item.product_id ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                          onClick={() => setReviews(prev => {
                            const newReviews = { ...prev };
                            delete newReviews[item.product_id];
                            return newReviews;
                          })}
                          className="text-gray-600 hover:text-gray-800 transition-colors duration-200 px-4 py-3"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Skip All Reviews */}
            <div className="text-center pt-8 border-t border-gray-200">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Skip reviews and continue shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage
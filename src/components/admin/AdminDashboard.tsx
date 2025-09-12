import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, LogOut, Package, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Order, api } from '../../lib/supabase';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await api.getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      
      // Update database
      await api.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      console.log('Order status updated successfully');
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Refresh orders to ensure UI is in sync with database
      await loadOrders();
    }
  };

  const filteredOrders = selectedOrderStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedOrderStatus);

  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total_amount, 0);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-navy-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm">Manage orders and inventory</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={loadOrders}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Refresh
              </button>
              
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-navy-900">{orders.length}</div>
                <div className="text-gray-600 text-sm">Total Orders</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-navy-900">{completedOrders}</div>
                <div className="text-gray-600 text-sm">Completed Orders</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-navy-900">${totalRevenue}</div>
                <div className="text-gray-600 text-sm">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Management */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy-900">Order Management</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOrderStatus('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedOrderStatus === 'all'
                      ? 'bg-navy-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({orders.length})
                </button>
                {Object.keys(statusColors).map((status) => {
                  const count = orders.filter(order => order.status === status).length;
                  return (
                    <button
                      key={status}
                      onClick={() => setSelectedOrderStatus(status)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedOrderStatus === status
                          ? 'bg-navy-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No {selectedOrderStatus === 'all' ? '' : selectedOrderStatus} orders found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-navy-900 truncate">
                            Order #{order.order_number}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[order.status as keyof typeof statusColors]}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{order.customer_name} {order.customer_surname}</span>
                          <span>${order.total_amount}</span>
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                          className="px-3 py-1 bg-white border border-gray-300 rounded text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
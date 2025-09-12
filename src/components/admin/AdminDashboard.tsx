import React, { useState, useEffect } from 'react';
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Truck
} from 'lucide-react';
import { Product, Category, Order, api } from '../../lib/supabase';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadOrders(),
        loadProducts(),
        loadCategories()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const ordersData = await api.getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await api.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await api.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleStatusChange = async (order: Order, newStatus: string) => {
    try {
      await api.updateOrderStatus(order.id, newStatus);
      await loadOrders(); // Refresh orders after status update
      await api.sendOrderStatusUpdate(order, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_surname.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-navy-900">ADMIN DASHBOARD</h1>
              <span className="ml-4 text-sm text-gray-500">MAISON NIKOLAS</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'categories', label: 'Categories', icon: Filter }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === id
                      ? 'border-navy-900 text-navy-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                  />
                </div>

                {activeTab === 'products' && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {activeTab === 'products' && (
                <button
                  onClick={() => setShowProductModal(true)}
                  className="flex items-center space-x-2 bg-navy-900 text-white px-4 py-2 rounded-lg hover:bg-navy-800 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              )}
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-navy-900">
                          Order #{order.order_number}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-navy-900">${order.total_amount}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-navy-900 mb-2">Customer Information</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{order.customer_name} {order.customer_surname}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{order.customer_phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{order.customer_city}, {order.customer_address}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-navy-900 mb-2">Order Details</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Payment: {order.payment_method}</p>
                          <p>Items: {order.order_items?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-navy-900 mb-2">Items</h4>
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded border">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.product?.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                                  alt={item.product?.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium text-navy-900">{item.product?.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {item.color && `${item.color} • `}
                                    {item.size && `${item.size} • `}
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <span className="font-medium text-navy-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Update */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-navy-900">Update Status:</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent text-sm"
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

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500">No orders match your search criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={product.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-navy-900">{product.name}</h3>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.category?.name}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {product.discount_price ? (
                              <>
                                <span className="font-bold text-navy-900">${product.discount_price}</span>
                                <span className="text-sm text-gray-500 line-through">${product.price}</span>
                              </>
                            ) : (
                              <span className="font-bold text-navy-900">${product.price}</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          {product.is_featured && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Featured</span>
                          )}
                          {product.is_new && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">New</span>
                          )}
                          {product.is_limited && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Limited</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">No products match your search criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-navy-900">{category.name}</h3>
                        <div className="flex items-center space-x-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Products: {products.filter(p => p.category_id === category.id).length}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          {category.gender || 'Unisex'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="text-center py-12">
                    <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-500">No categories available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
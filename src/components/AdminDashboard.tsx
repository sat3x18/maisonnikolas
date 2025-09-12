import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  LogOut,
  Plus,
  DollarSign,
  Calendar,
  Filter,
  Download,
  BarChart3
} from 'lucide-react';
import { Order, Product, Category, api } from '../lib/supabase';
import type { NewsletterSubscriber } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'newsletter'>('overview');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    gender: 'men' as 'men' | 'women'
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    discount_price: '',
    stock: '',
    is_featured: false,
    is_new: false,
    is_limited: false,
    colors: [] as string[],
    sizes: [] as string[],
    images: [] as string[]
  });
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [ordersData, productsData, categoriesData, subscribersData] = await Promise.all([
        api.getOrders(),
        api.getProducts(),
        api.getCategories(),
        api.getNewsletterSubscribers()
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setCategories(categoriesData);
      setSubscribers(subscribersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, categoryForm);
      } else {
        await api.createCategory(categoryForm);
      }
      await loadData();
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', slug: '', description: '', gender: 'men' });
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      gender: category.gender || 'men'
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.deleteCategory(categoryId);
        await loadData();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImages(true);

    try {
      // Upload images first
      const uploadedImageUrls = [];
      for (const file of selectedFiles) {
        // For demo purposes, we'll create object URLs for the images
        // In a real app, you'd upload to your storage service
        const imageUrl = URL.createObjectURL(file);
        uploadedImageUrls.push(imageUrl);
      }

      const productData = {
        name: productForm.name,
        description: productForm.description,
        category_id: productForm.category_id,
        price: parseFloat(productForm.price),
        discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : undefined,
        stock: parseInt(productForm.stock),
        is_featured: productForm.is_featured,
        is_new: productForm.is_new,
        is_limited: productForm.is_limited,
        colors: productForm.colors,
        sizes: productForm.sizes,
        images: [...productForm.images, ...uploadedImageUrls]
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        await api.createProduct(productData);
      }

      await loadData();
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        category_id: '',
        price: '',
        discount_price: '',
        stock: '',
        is_featured: false,
        is_new: false,
        is_limited: false,
        colors: [],
        sizes: [],
        images: []
      });
      setSelectedFiles([]);
      setImagePreviewUrls([]);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      category_id: product.category_id,
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || '',
      stock: product.stock.toString(),
      is_featured: product.is_featured,
      is_new: product.is_new,
      is_limited: product.is_limited,
      colors: product.colors,
      sizes: product.sizes,
      images: product.images
    });
    setImagePreviewUrls([]);
    setSelectedFiles([]);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(productId);
        await loadData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleAddColor = () => {
    if (newColor.trim() && !productForm.colors.includes(newColor.trim())) {
      setProductForm({
        ...productForm,
        colors: [...productForm.colors, newColor.trim()]
      });
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setProductForm({
      ...productForm,
      colors: productForm.colors.filter(color => color !== colorToRemove)
    });
  };

  const handleAddSize = () => {
    if (newSize.trim() && !productForm.sizes.includes(newSize.trim())) {
      setProductForm({
        ...productForm,
        sizes: [...productForm.sizes, newSize.trim()]
      });
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.filter(size => size !== sizeToRemove)
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      
      // Create preview URLs
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(previewUrls);
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter(image => image !== imageToRemove)
    });
  };
  const handleToggleProductStatus = async (productId: string, field: string, value: boolean) => {
    try {
      await api.updateProductStatus(productId, field, value);
      await loadData();
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Failed to update product status. Please try again.');
    }
  };
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy border-t-transparent mx-auto mb-4"></div>
          <p className="text-navy">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-light text-navy">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-navy transition-colors duration-200 flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-navy text-white px-4 py-2 hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white border border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: Filter },
            { id: 'newsletter', label: 'Newsletter', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:text-navy hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-2">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-light text-navy">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-2">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-light text-navy">{orders.length}</p>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 p-2">
                    <Package className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Pending Orders</p>
                  <p className="text-2xl font-light text-navy">{pendingOrders}</p>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-2">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Avg Order Value</p>
                  <p className="text-2xl font-light text-navy">${averageOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-navy">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-gray-600 font-medium py-3 px-6">Order #</th>
                      <th className="text-left text-gray-600 font-medium py-3 px-6">Customer</th>
                      <th className="text-left text-gray-600 font-medium py-3 px-6">Total</th>
                      <th className="text-left text-gray-600 font-medium py-3 px-6">Status</th>
                      <th className="text-left text-gray-600 font-medium py-3 px-6">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-navy">{order.order_number}</td>
                        <td className="py-4 px-6 text-gray-600">{order.customer_name} {order.customer_surname}</td>
                        <td className="py-4 px-6 font-medium text-navy">${order.total_amount.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-navy">Newsletter Subscribers</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Total Subscribers: {subscribers.length}
                </span>
                <button className="bg-navy text-white px-4 py-2 hover:bg-gray-800 transition-colors duration-200">
                  Export Subscribers
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Email</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Subscribed Date</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-navy">{subscriber.email}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-xs font-medium ${
                          subscriber.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subscriber.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-navy">Order Management</h2>
              <button className="bg-navy text-white px-4 py-2 hover:bg-gray-800 transition-colors duration-200">
                Export Orders
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Order #</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Customer</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Phone</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Total</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Status</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-navy">{order.order_number}</td>
                      <td className="py-4 px-6 text-gray-600">{order.customer_name} {order.customer_surname}</td>
                      <td className="py-4 px-6 text-gray-600">{order.customer_phone}</td>
                      <td className="py-4 px-6 font-medium text-navy">${order.total_amount.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => window.open(`/order/${order.order_number}`, '_blank')}
                          className="text-navy hover:text-gray-600 transition-colors duration-200"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-navy">Product Management</h2>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowProductForm(true)}
                  className="bg-navy text-white px-4 py-2 hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-navy mb-6">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    
                    <form onSubmit={handleProductSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-navy mb-2">Product Name *</label>
                            <input
                              type="text"
                              value={productForm.name}
                              onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                              required
                              placeholder="Enter product name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-navy mb-2">Category *</label>
                            <select
                              value={productForm.category_id}
                              onChange={(e) => setProductForm({...productForm, category_id: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                              required
                            >
                              <option value="">Select a category</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name} ({category.gender})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-navy mb-2">Description</label>
                            <textarea
                              value={productForm.description}
                              onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                              rows={4}
                              placeholder="Enter product description"
                            />
                          </div>
                        </div>

                        {/* Pricing and Stock */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-navy mb-2">Price *</label>
                            <input
                              type="number"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                              required
                              placeholder="0.00"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-navy mb-2">Discount Price</label>
                            <input
                              type="number"
                              step="0.01"
                              value={productForm.discount_price}
                              onChange={(e) => setProductForm({...productForm, discount_price: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                              placeholder="0.00"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-navy mb-2">Stock Quantity *</label>
                            <input
                              type="number"
                              value={productForm.stock}
                              onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                              required
                              placeholder="0"
                            />
                          </div>

                          {/* Product Status */}
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-navy">Product Status</label>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={productForm.is_featured}
                                  onChange={(e) => setProductForm({...productForm, is_featured: e.target.checked})}
                                  className="text-navy focus:ring-navy"
                                />
                                <span className="text-sm text-gray-700">Featured Product</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={productForm.is_new}
                                  onChange={(e) => setProductForm({...productForm, is_new: e.target.checked})}
                                  className="text-navy focus:ring-navy"
                                />
                                <span className="text-sm text-gray-700">New Arrival</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={productForm.is_limited}
                                  onChange={(e) => setProductForm({...productForm, is_limited: e.target.checked})}
                                  className="text-navy focus:ring-navy"
                                />
                                <span className="text-sm text-gray-700">Limited Edition</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">Available Colors</label>
                        <div className="flex items-center space-x-2 mb-3">
                          <input
                            type="text"
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                            placeholder="Enter color name"
                          />
                          <button
                            type="button"
                            onClick={handleAddColor}
                            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {productForm.colors.map((color, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                            >
                              <span>{color}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveColor(color)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Sizes */}
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">Available Sizes</label>
                        <div className="flex items-center space-x-2 mb-3">
                          <input
                            type="text"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                            placeholder="Enter size (e.g., S, M, L, XL)"
                          />
                          <button
                            type="button"
                            onClick={handleAddSize}
                            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {productForm.sizes.map((size, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                            >
                              <span>{size}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSize(size)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Images */}
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">Product Images</label>
                        
                        {/* Existing Images */}
                        {productForm.images.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {productForm.images.map((image, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(image)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* File Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center space-y-2"
                          >
                            <div className="bg-gray-100 p-3 rounded-full">
                              <Plus className="h-6 w-6 text-gray-600" />
                            </div>
                            <span className="text-sm text-gray-600">
                              Click to upload images or drag and drop
                            </span>
                            <span className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB each
                            </span>
                          </label>
                        </div>

                        {/* Image Previews */}
                        {imagePreviewUrls.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">New Images to Upload:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {imagePreviewUrls.map((url, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFiles = selectedFiles.filter((_, i) => i !== index);
                                      const newUrls = imagePreviewUrls.filter((_, i) => i !== index);
                                      setSelectedFiles(newFiles);
                                      setImagePreviewUrls(newUrls);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Form Actions */}
                      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                            setProductForm({
                              name: '',
                              description: '',
                              category_id: '',
                              price: '',
                              discount_price: '',
                              stock: '',
                              is_featured: false,
                              is_new: false,
                              is_limited: false,
                              colors: [],
                              sizes: [],
                              images: []
                            });
                            setSelectedFiles([]);
                            setImagePreviewUrls([]);
                          }}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={uploadingImages}
                          className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {uploadingImages && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                          <span>{uploadingImages ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 p-4">
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <h3 className="font-medium text-navy mb-2">{product.name}</h3>
                  <div className="mb-2">
                    {product.discount_price ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium text-navy">${product.discount_price}</span>
                        <span className="text-sm text-gray-500 line-through">${product.price}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-medium text-navy">${product.price}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Stock: {product.stock}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Category: {categories.find(c => c.id === product.category_id)?.name || 'Unknown'}
                  </p>
                  
                  {/* Product Status Toggles */}
                  <div className="mb-4 space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={product.is_featured}
                        onChange={() => handleToggleProductStatus(product.id, 'is_featured', !product.is_featured)}
                        className="text-navy focus:ring-navy"
                      />
                      <span className="text-sm text-gray-600">Featured</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={product.is_new}
                        onChange={() => handleToggleProductStatus(product.id, 'is_new', !product.is_new)}
                        className="text-navy focus:ring-navy"
                      />
                      <span className="text-sm text-gray-600">New Arrival</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 bg-red-100 text-red-700 py-2 px-4 hover:bg-red-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-navy">Category Management</h2>
              <button 
                onClick={() => setShowCategoryForm(true)}
                className="bg-navy-900 text-white px-4 py-2 hover:bg-navy-800 transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Category Form Modal */}
            {showCategoryForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-medium text-navy-900 mb-4">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-1">Name</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-1">Slug</label>
                      <input
                        type="text"
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-1">Gender</label>
                      <select
                        value={categoryForm.gender}
                        onChange={(e) => setCategoryForm({...categoryForm, gender: e.target.value as 'men' | 'women'})}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                      >
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-1">Description</label>
                      <textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-navy-900 text-white py-2 px-4 hover:bg-navy-800 transition-colors duration-200"
                      >
                        {editingCategory ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryForm(false);
                          setEditingCategory(null);
                          setCategoryForm({ name: '', slug: '', description: '', gender: 'men' });
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Name</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Gender</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Description</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Products</th>
                    <th className="text-left text-gray-600 font-medium py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-navy">{category.name}</td>
                      <td className="py-4 px-6 text-gray-600 capitalize">{category.gender || 'Unisex'}</td>
                      <td className="py-4 px-6 text-gray-600">{category.description}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {products.filter(p => p.category_id === category.id).length}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditCategory(category)}
                            className="text-navy-900 hover:text-navy-700 transition-colors duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
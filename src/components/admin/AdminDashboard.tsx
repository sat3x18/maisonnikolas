import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  BarChart3,
  Users,
  ShoppingCart,
  TrendingUp,
  LogOut,
  Upload,
  X,
  Save,
  Grid,
  List,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const loadOrders = async () => {
    try {
      const ordersData = await api.getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    discount_price: '',
    colors: [] as string[],
    sizes: [] as string[],
    stock: '',
    is_featured: false,
    is_new: false,
    is_limited: false,
    images: [] as string[]
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    gender: 'men' as 'men' | 'women'
  });
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Mock data fallback
  const mockCategories: Category[] = [
    { id: '1', name: 'Shirts', slug: 'shirts', description: 'Premium shirts collection', created_at: new Date().toISOString(), gender: 'men' },
    { id: '2', name: 'Suits', slug: 'suits', description: 'Luxury suits', created_at: new Date().toISOString(), gender: 'men' },
    { id: '3', name: 'Casual Wear', slug: 'casual', description: 'Casual clothing', created_at: new Date().toISOString(), gender: 'men' },
    { id: '4', name: 'Dresses', slug: 'dresses', description: 'Elegant dresses', created_at: new Date().toISOString(), gender: 'women' },
    { id: '5', name: 'Blouses', slug: 'blouses', description: 'Designer blouses', created_at: new Date().toISOString(), gender: 'women' },
    { id: '6', name: 'Skirts', slug: 'skirts', description: 'Premium skirts', created_at: new Date().toISOString(), gender: 'women' }
  ];

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Classic Oxford Shirt',
      description: 'Premium cotton oxford shirt with button-down collar.',
      category_id: '1',
      price: 125,
      discount_price: 95,
      images: [
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
      ],
      colors: ['White', 'Light Blue', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 25,
      is_featured: true,
      is_new: false,
      is_limited: false,
      created_at: new Date().toISOString(),
      category: mockCategories[0]
    },
    {
      id: '2',
      name: 'Silk Midi Dress',
      description: 'Elegant silk dress perfect for any occasion.',
      category_id: '4',
      price: 285,
      images: [
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
      ],
      colors: ['Black', 'Navy', 'Burgundy'],
      sizes: ['XS', 'S', 'M', 'L'],
      stock: 12,
      is_featured: true,
      is_new: true,
      is_limited: false,
      created_at: new Date().toISOString(),
      category: mockCategories[3]
    },
    {
      id: '3',
      name: 'Wool Blazer',
      description: 'Tailored wool blazer with classic fit.',
      category_id: '2',
      price: 395,
      discount_price: 295,
      images: [
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
      ],
      colors: ['Navy', 'Charcoal', 'Black'],
      sizes: ['38', '40', '42', '44', '46'],
      stock: 8,
      is_featured: false,
      is_new: true,
      is_limited: false,
      created_at: new Date().toISOString(),
      category: mockCategories[1]
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.log('Supabase not configured, using mock data');
        setProducts(mockProducts);
        setCategories(mockCategories);
        setOrders([]);
        setLoading(false);
        return;
      }

      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      
      setProducts(productsData.length > 0 ? productsData : mockProducts);
      setCategories(categoriesData.length > 0 ? categoriesData : mockCategories);
      await loadOrders();
    } catch (error) {
      console.error('Error loading data, using mock data:', error);
      setProducts(mockProducts);
      setCategories(mockCategories);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      category_id: '',
      price: '',
      discount_price: '',
      colors: [],
      sizes: [],
      stock: '',
      is_featured: false,
      is_new: false,
      is_limited: false,
      images: []
    });
    setNewColor('');
    setNewSize('');
    setImageFiles([]);
    setEditingProduct(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      gender: 'men'
    });
    setEditingCategory(null);
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || '',
        category_id: product.category_id,
        price: product.price.toString(),
        discount_price: product.discount_price?.toString() || '',
        colors: [...product.colors],
        sizes: [...product.sizes],
        stock: product.stock.toString(),
        is_featured: product.is_featured,
        is_new: product.is_new,
        is_limited: product.is_limited,
        images: [...product.images]
      });
    } else {
      resetForm();
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    resetForm();
  };

  const openCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        gender: category.gender || 'men'
      });
    } else {
      resetCategoryForm();
    }
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    resetCategoryForm();
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleCategoryNameChange = (name: string) => {
    setCategoryForm(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const addColor = () => {
    if (newColor.trim() && !productForm.colors.includes(newColor.trim())) {
      setProductForm(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }));
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setProductForm(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const addSize = () => {
    if (newSize.trim() && !productForm.sizes.includes(newSize.trim())) {
      setProductForm(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }));
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProductForm(prev => ({
          ...prev,
          images: [...prev.images, result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        category_id: productForm.category_id,
        price: parseFloat(productForm.price),
        discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
        colors: productForm.colors,
        sizes: productForm.sizes,
        stock: parseInt(productForm.stock),
        is_featured: productForm.is_featured,
        is_new: productForm.is_new,
        is_limited: productForm.is_limited,
        images: productForm.images
      };

      if (editingProduct) {
        console.log('Updating product:', productData);
      } else {
        console.log('Creating product:', productData);
      }

      closeProductModal();
      await loadData();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const categoryData = {
        name: categoryForm.name,
        slug: categoryForm.slug,
        description: categoryForm.description,
        gender: categoryForm.gender
      };

      if (editingCategory) {
        console.log('Updating category:', categoryData);
      } else {
        console.log('Creating category:', categoryData);
      }

      closeCategoryModal();
      await loadData();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        console.log('Deleting product:', id);
        await loadData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      try {
        console.log('Deleting category:', id);
        await loadData();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900 mx-auto mb-4"></div>
          <p className="text-navy-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-navy-900 mr-3" />
              <h1 className="text-2xl font-serif font-bold text-navy-900 tracking-tight">ADMIN DASHBOARD</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-navy-900 hover:text-navy-700 transition-colors duration-200 font-medium uppercase tracking-wider"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold text-navy-900">Dashboard Overview</h2>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 font-medium transition-all duration-200 uppercase tracking-wider ${
                activeTab === 'products'
                  ? 'bg-navy-900 text-white'
                  : 'text-navy-900 hover:text-navy-700'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-2 font-medium transition-all duration-200 uppercase tracking-wider ${
                activeTab === 'categories'
                  ? 'bg-navy-900 text-white'
                  : 'text-navy-900 hover:text-navy-700'
              }`}
            >
              Categories
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-navy-100 p-3">
                <Clock className="h-6 w-6 text-navy-900" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-bold text-navy-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-navy-100 p-3">
                <Package className="h-6 w-6 text-navy-900" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Pending Orders</p>
                <p className="text-2xl font-bold text-navy-900">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-navy-100 p-3">
                <Truck className="h-6 w-6 text-navy-900" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Shipped</p>
                <p className="text-2xl font-bold text-navy-900">{orders.filter(o => o.status === 'shipped').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-navy-100 p-3">
                <CheckCircle className="h-6 w-6 text-navy-900" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Completed</p>
                <p className="text-2xl font-bold text-navy-900">{orders.filter(o => o.status === 'completed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-serif font-bold text-navy-900">Orders Management</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-navy-900">{order.order_number}</div>
                        <div className="text-sm text-gray-500">{order.payment_method}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-navy-900">
                          {order.customer_name} {order.customer_surname}
                        </div>
                        <div className="text-sm text-gray-500">{order.customer_phone}</div>
                        <div className="text-sm text-gray-500">{order.customer_city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-navy-900">${order.total_amount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              await api.updateOrderStatus(order.id, newStatus);
                              await api.sendOrderStatusUpdate(order, newStatus);
                              loadOrders(); // Refresh the orders list
                            } catch (error) {
                              console.error('Error updating order status:', error);
                            }
                          }}
                          className={`text-xs font-medium px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-navy-900 ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href={`/order/${order.order_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-navy-900 hover:text-navy-700 transition-colors duration-200"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Section */}
        {activeTab === 'products' && (
          <div className="bg-white border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-navy-900">Products</h2>
                <button
                  onClick={() => openProductModal()}
                  className="bg-navy-900 text-white px-6 py-3 hover:bg-navy-800 transition-colors duration-200 flex items-center space-x-2 font-medium uppercase tracking-wider"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.gender})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.images[0] || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'}
                            alt={product.name}
                            className="h-12 w-12 object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-navy-900">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-navy-900">
                          {product.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-navy-900">
                          {product.discount_price ? (
                            <div>
                              <span className="font-medium">${product.discount_price}</span>
                              <span className="text-gray-500 line-through ml-2">${product.price}</span>
                            </div>
                          ) : (
                            <span className="font-medium">${product.price}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${product.stock > 0 ? 'text-navy-900' : 'text-red-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {product.is_featured && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-navy-100 text-navy-900 uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                          {product.is_new && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 uppercase tracking-wider">
                              New
                            </span>
                          )}
                          {product.is_limited && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 uppercase tracking-wider">
                              Limited
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => openProductModal(product)}
                            className="text-navy-900 hover:text-navy-700 transition-colors duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
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

        {/* Categories Section */}
        {activeTab === 'categories' && (
          <div className="bg-white border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-navy-900">Categories</h2>
                <button
                  onClick={() => openCategoryModal()}
                  className="bg-navy-900 text-white px-6 py-3 hover:bg-navy-800 transition-colors duration-200 flex items-center space-x-2 font-medium uppercase tracking-wider"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </button>
              </div>
            </div>

            {/* Categories Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-navy-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-navy-900">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-navy-900 font-mono bg-gray-100 px-2 py-1">
                          {category.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                          category.gender === 'men' 
                            ? 'bg-navy-100 text-navy-900' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {category.gender?.toUpperCase() || 'UNISEX'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-navy-900 font-medium">
                          {products.filter(p => p.category_id === category.id).length}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => openCategoryModal(category)}
                            className="text-navy-900 hover:text-navy-700 transition-colors duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            disabled={products.filter(p => p.category_id === category.id).length > 0}
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

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-navy-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={closeProductModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                      Description
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-3 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                      Category *
                    </label>
                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.gender})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-3 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                        Discount Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.discount_price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, discount_price: e.target.value }))}
                        className="w-full px-3 py-3 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Status Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={productForm.is_featured}
                        onChange={(e) => setProductForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="border-gray-300 text-navy-900 focus:ring-navy-900"
                      />
                      <span className="ml-2 text-sm text-navy-900 font-medium uppercase tracking-wider">Featured Product</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={productForm.is_new}
                        onChange={(e) => setProductForm(prev => ({ ...prev, is_new: e.target.checked }))}
                        className="border-gray-300 text-navy-900 focus:ring-navy-900"
                      />
                      <span className="ml-2 text-sm text-navy-900 font-medium uppercase tracking-wider">New Arrival</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={productForm.is_limited}
                        onChange={(e) => setProductForm(prev => ({ ...prev, is_limited: e.target.checked }))}
                        className="border-gray-300 text-navy-900 focus:ring-navy-900"
                      />
                      <span className="ml-2 text-sm text-navy-900 font-medium uppercase tracking-wider">Limited Edition</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                  Colors
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add color"
                    className="flex-1 px-3 py-3 border border-gray-300 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="bg-navy-900 text-white px-4 py-3 hover:bg-navy-800 transition-colors duration-200 font-medium uppercase tracking-wider"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productForm.colors.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-navy-900 font-medium"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                  Sizes
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Add size"
                    className="flex-1 px-3 py-3 border border-gray-300 text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="bg-navy-900 text-white px-4 py-3 hover:bg-navy-800 transition-colors duration-200 font-medium uppercase tracking-wider"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productForm.sizes.map((size, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-navy-900 font-medium"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-gray-300 p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop images here, or click to select
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-navy-900 text-white px-4 py-2 hover:bg-navy-800 transition-colors duration-200 cursor-pointer inline-block font-medium uppercase tracking-wider"
                  >
                    Choose Files
                  </label>
                </div>

                {/* Image Previews */}
                {productForm.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {productForm.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 hover:bg-red-600 transition-colors duration-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="px-6 py-3 border border-gray-300 text-navy-900 hover:bg-gray-50 transition-colors duration-200 font-medium uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-navy-900 text-white px-6 py-3 hover:bg-navy-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium uppercase tracking-wider"
                >
                  <Save className="h-4 w-4" />
                  <span>{submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-navy-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={closeCategoryModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => handleCategoryNameChange(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    placeholder="e.g., Shirts, Dresses, Suits"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 text-navy-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                    placeholder="e.g., shirts, dresses, suits"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used in URLs. Auto-generated from name but can be customized.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-300 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                  placeholder="Brief description of this category..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-900 mb-2 uppercase tracking-wider">
                  Target Gender *
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="men"
                      checked={categoryForm.gender === 'men'}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, gender: e.target.value as 'men' | 'women' }))}
                      className="text-navy-900 focus:ring-navy-900"
                    />
                    <span className="ml-2 text-sm text-navy-900 font-medium uppercase tracking-wider">Men</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="women"
                      checked={categoryForm.gender === 'women'}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, gender: e.target.value as 'men' | 'women' }))}
                      className="text-navy-900 focus:ring-navy-900"
                    />
                    <span className="ml-2 text-sm text-navy-900 font-medium uppercase tracking-wider">Women</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="px-6 py-3 border border-gray-300 text-navy-900 hover:bg-gray-50 transition-colors duration-200 font-medium uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-navy-900 text-white px-6 py-3 hover:bg-navy-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium uppercase tracking-wider"
                >
                  <Save className="h-4 w-4" />
                  <span>{submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
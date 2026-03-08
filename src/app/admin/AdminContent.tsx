import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import axios from '@/lib/axios';
import { CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

// Import separated components
import Dashboard from './components/dashboard';
import Products from './components/products';
import Categories from './components/category';
import Orders from './components/orders';
import UsersComponent from './components/users';
import Inventory from './components/inventory';
import Modal from './components/modal';
import { Product, Category, Subcategory, SubSubcategory, Order, OrderItem, User } from '@/types/admin';


const AdminContent: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Subcategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubcategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState<Product | Category | Subcategory | SubSubcategory | User | Order | null>(null);

  // API Functions
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/categories');
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/subcategories');
      setSubCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sub-subcategories');
      setSubSubCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching sub-subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/AdminOrders');
      setOrders(response.data.orders || response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Create/Update/Delete Functions
  const createProduct = async (productData: Product | FormData) => {
    try {
      setLoading(true);

      let dataToSend: FormData;

      if (productData instanceof FormData) {
        dataToSend = productData;
      } else {
        // Create FormData object if we received a plain object
        dataToSend = new FormData();
        const productObj = productData as unknown as Record<string, string | Blob>;
        Object.keys(productObj).forEach(key => {
          const val = productObj[key];
          if (val !== null && val !== '' && val !== undefined) {
            dataToSend.append(key, val);
          }
        });
      }

      await axios.post('/api/products', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchProducts();
      closeModal();
    } catch (err: unknown) {
      console.error('Error creating product:', err);

      // Log detailed error for debugging
      if (Axios.isAxiosError(err) && err.response) {
        console.error('Error details:', err.response.data);
      }

      setError('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, productData: Product | FormData) => {
    try {
      setLoading(true);

      let dataToSend: FormData;

      if (productData instanceof FormData) {
        dataToSend = productData;
        // Ensure _method is set for PUT spoofing if not already present
        if (!dataToSend.has('_method')) {
          dataToSend.append('_method', 'PUT');
        }
      } else {
        // Create FormData object if we received a plain object
        dataToSend = new FormData();
        dataToSend.append('_method', 'PUT');
        const productObj = productData as unknown as Record<string, string | Blob>;
        Object.keys(productObj).forEach(key => {
          const val = productObj[key];
          if (val !== null && val !== '' && val !== undefined) {
            dataToSend.append(key, val);
          }
        });
      }

      // Use POST with _method=PUT for file uploads (Laravel method spoofing)
      await axios.post(`/api/products/${id}`, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchProducts();
      closeModal();
    } catch (err: unknown) {
      console.error('Error updating product:', err);

      if (Axios.isAxiosError(err) && err.response) {
        console.error('Error details:', err.response.data);
      }

      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${id}`);
      await fetchProducts();
    } catch (err: unknown) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Partial<Category>) => {
    try {
      setLoading(true);
      await axios.post('/api/categories', categoryData);
      await fetchCategories();
      closeModal();
    } catch (err: unknown) {
      console.error('Error creating category:', err);
      setError('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, categoryData: Partial<Category>) => {
    try {
      setLoading(true);
      await axios.put(`/api/categories/${id}`, categoryData);
      await fetchCategories();
      closeModal();
    } catch (err: unknown) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/api/categories/${id}`);
      await fetchCategories();
      await fetchSubCategories();
      await fetchSubSubCategories();
    } catch (err: unknown) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const createSubCategory = async (data: Partial<Subcategory>) => {
    try {
      setLoading(true);
      await axios.post('/api/subcategories', data);
      await fetchSubCategories();
      closeModal();
    } catch (err: unknown) {
      console.error('Error creating subcategory:', err);
      setError('Failed to create subcategory');
    } finally {
      setLoading(false);
    }
  };

  const updateSubCategory = async (id: number, data: Partial<Subcategory>) => {
    try {
      setLoading(true);
      await axios.put(`/api/subcategories/${id}`, data);
      await fetchSubCategories();
      closeModal();
    } catch (err: unknown) {
      console.error('Error updating subcategory:', err);
      setError('Failed to update subcategory');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubCategory = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/api/subcategories/${id}`);
      await fetchSubCategories();
      await fetchSubSubCategories();
    } catch (err: unknown) {
      console.error('Error deleting subcategory:', err);
      setError('Failed to delete subcategory');
    } finally {
      setLoading(false);
    }
  };

  const createSubSubCategory = async (data: Partial<SubSubcategory>) => {
    try {
      setLoading(true);
      await axios.post('/api/sub-subcategories', data);
      await fetchSubSubCategories();
      closeModal();
    } catch (err: unknown) {
      console.error('Error creating sub-subcategory:', err);
      setError('Failed to create sub-subcategory');
    } finally {
      setLoading(false);
    }
  };

  const updateSubSubCategory = async (id: number, data: Partial<SubSubcategory>) => {
    try {
      setLoading(true);
      await axios.put(`/api/sub-subcategories/${id}`, data);
      await fetchSubSubCategories();
      closeModal();
    } catch (err: unknown) {
      console.error('Error updating sub-subcategory:', err);
      setError('Failed to update sub-subcategory');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubSubCategory = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/api/sub-subcategories/${id}`);
      await fetchSubSubCategories();
    } catch (err: unknown) {
      console.error('Error deleting sub-subcategory:', err);
      setError('Failed to delete sub-subcategory');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: number, orderData: { status: string }) => {
    try {
      setLoading(true);
      await axios.put(`/api/orders/${id}`, orderData);
      await fetchOrders();
    } catch (err: unknown) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: number, orderData: any) => {
    try {
      setLoading(true);
      await axios.put(`/api/orders/${id}`, orderData);
      await fetchOrders();
      closeModal();
    } catch (err: unknown) {
      console.error('Error updating order:', err);
      setError('Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/order-items');
      setOrderItems(response.data.data || response.data);
    } catch (err: unknown) {
      console.error('Error fetching order items:', err);
      setError('Failed to fetch order items');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/api/orders/${id}`);
      await fetchOrders();
    } catch (err: unknown) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, userData: Partial<User> & { password?: string; password_confirmation?: string }) => {
    try {
      setLoading(true);

      // Remove empty password fields to avoid backend validation issues
      const cleanedData = { ...userData };
      if (!cleanedData.password || cleanedData.password === '') {
        delete cleanedData.password;
        delete cleanedData.password_confirmation;
      }

      await axios.put(`/api/users/${id}`, cleanedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await fetchUsers();
      closeModal();
    } catch (err: unknown) {
      console.error('Error updating user:', err);
      if (Axios.isAxiosError(err) && err.response) {
        console.error('Error details:', err.response.data);
      }
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      await axios.post('/api/users', userData);
      await fetchUsers();
      closeModal();
    } catch (err: unknown) {
      console.error('Error creating user:', err);
      if (Axios.isAxiosError(err) && err.response) {
        console.error('Error details:', err.response.data);
      }
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/api/users/${id}`);
      await fetchUsers();
    } catch (err: unknown) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'dashboard':
        fetchProducts();
        fetchOrders();
        fetchUsers();
        fetchCategories();
        fetchSubCategories();
        fetchSubSubCategories();
        fetchOrderItems();
        break;
      case 'products':
        fetchProducts();
        fetchCategories();
        fetchSubCategories();
        fetchSubSubCategories();
        break;
      case 'categories':
        fetchCategories();
        fetchSubCategories();
        fetchSubSubCategories();
        fetchProducts();
        break;
      case 'orders':
        fetchOrders();
        break;
      case 'users':
        fetchUsers();
        break;
      case 'inventory':
        fetchProducts();
        break;
      default:
        break;
    }
  }, [activeTab]);

  const openModal = (type: string, item: Product | Category | Subcategory | SubSubcategory | User | Order | null = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
    setError(null);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      out_of_stock: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      pending: <Clock size={16} />,
      shipped: <Truck size={16} />,
      delivered: <CheckCircle size={16} />,
      cancelled: <XCircle size={16} />
    };
    return icons[status] || <Clock size={16} />;
  };

  // Render based on active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            products={products}
            orders={orders}
            users={users}
            categories={categories}
            orderItems={orderItems}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        );

      case 'products':
        return (
          <Products
            products={products}
            categories={categories}
            subCategories={subCategories}
            subSubCategories={subSubCategories}
            getStatusColor={getStatusColor}
            openModal={openModal}
            deleteProduct={deleteProduct}
          />
        );

      case 'categories':
        return (
          <Categories
            categories={categories}
            subCategories={subCategories}
            subSubCategories={subSubCategories}
            products={products}
            openModal={openModal}
            deleteCategory={deleteCategory}
            deleteSubCategory={deleteSubCategory}
            deleteSubSubCategory={deleteSubSubCategory}
          />
        );

      case 'orders':
        return (
          <Orders
            orders={orders}
            getStatusColor={getStatusColor}
            updateOrderStatus={updateOrderStatus}
            deleteOrder={deleteOrder}
            openModal={openModal}
          />
        );

      case 'users':
        return (
          <UsersComponent
            users={users}
            getStatusColor={getStatusColor}
            openModal={openModal}
            deleteUser={deleteUser}
          />
        );

      case 'inventory':
        return (
          <Inventory
            products={products}
          />
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-600">Fonctionnalité des paiements en cours de développement</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-600">Paramètres du système en cours de développement</p>
            </div>
          </div>
        );

      default:
        return (
          <Dashboard
            products={products}
            orders={orders}
            users={users}
            categories={categories}
            orderItems={orderItems}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-500"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {renderActiveTab()}
          <Modal
            showModal={showModal}
            modalType={modalType}
            selectedItem={selectedItem}
            categories={categories}
            subCategories={subCategories}
            subSubCategories={subSubCategories}
            closeModal={closeModal}
            createProduct={createProduct}
            updateProduct={updateProduct}
            createCategory={createCategory}
            updateCategory={updateCategory}
            createSubCategory={createSubCategory}
            updateSubCategory={updateSubCategory}
            createSubSubCategory={createSubSubCategory}
            updateSubSubCategory={updateSubSubCategory}
            createUser={createUser}
            updateUser={updateUser}
            updateOrder={updateOrder}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default AdminContent;

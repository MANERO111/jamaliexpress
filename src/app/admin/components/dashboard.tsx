'use client';
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Sector
} from 'recharts';
import {
  ShoppingCart, Users, AlertTriangle, Clock, DollarSign,
  CheckCircle, Truck, XCircle, LayoutGrid, TrendingUp
} from 'lucide-react';
import { getProductImageUrl } from '@/utils/imageHelper';

// Define interfaces for your data structures
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  category_id: number;
  category?: Category;
}

interface User {
  id: number;
  name: string;
  email?: string;
  role: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_method?: string;
  shipping_address?: string;
  placed_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

interface DashboardProps {
  products: Product[];
  orders: Order[];
  users: User[];
  categories?: Category[];
  orderItems: OrderItem[];
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => JSX.Element;
}

const Dashboard: React.FC<DashboardProps> = ({
  products,
  orders,
  users,
  orderItems,
  categories = [],
  getStatusColor,
  getStatusIcon
}) => {
  // Calculate dashboard stats from real data
  const dashboardStats = {
    totalOrders: orders.length,
    // Only count sales from paid or delivered orders
    totalSales: orders
      .filter(order => order.status === 'paid' || order.status === 'delivered')
      .reduce((sum, order) => {
        const amount = Number(order.total_amount) || 0;
        return sum + amount;
      }, 0),
    activeCustomers: users.filter(user => user.role === 'user' && user.status === 'active').length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    lowStockProducts: products.filter(product => (product.stock_quantity || 0) < 10).length
  };

  // Generate real sales data from orders (last 7 days)
  const generateDailySalesData = () => {
    const today = new Date();
    const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const salesData = [];
  
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = daysOfWeek[date.getDay()];
  
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
  
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
  
      const dayOrders = orders.filter(order => {
        if (!order.created_at && !order.placed_at) return false;
        const orderDate = new Date(order.created_at || order.placed_at as string);
        if (isNaN(orderDate.getTime())) return false;
        return orderDate >= dayStart && orderDate <= dayEnd;
      });
  
      const daySales = dayOrders.reduce((sum, order) => {
        const amount = Number(order.total_amount) || 0;
        return sum + amount;
      }, 0);
  
      salesData.push({
        day: dayName,
        sales: daySales
      });
    }
  
    return salesData;
  };
  

  const [categoryView, setCategoryView] = useState<'stock' | 'sales'>('stock');

  // Colors for charts
  const COLORS = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Rose
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#14b8a6'  // Teal
  ];

  // Generate Stock Distribution Data
  const generateStockData = () => {
    const stockStats: { [key: string]: number } = {};
    
    // Initialize with real categories
    categories.forEach(c => {
      stockStats[c.id] = 0;
    });

    // Count products per category
    products.forEach(p => {
      if (stockStats[p.category_id] !== undefined) {
        stockStats[p.category_id]++;
      } else {
        // Handle products with missing/invalid category_id if any
        const key = 'Other';
        stockStats[key] = (stockStats[key] || 0) + 1;
      }
    });

    return Object.entries(stockStats)
      .map(([id, count]) => {
        const category = categories.find(c => c.id.toString() === id);
        const name = category ? category.name : (id === 'Other' ? 'Autres' : 'Inconnu');
        return { name, value: count, count };
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  };

  // Generate Sales Performance Data
  const generateCategorySalesData = () => {
    const salesStats: { [key: string]: number } = {};

    categories.forEach(c => {
      salesStats[c.id] = 0;
    });

    (orderItems || []).forEach(item => {
      const product = products.find(p => p.id === item.product_id);
      if (!product) return;

      if (salesStats[product.category_id] !== undefined) {
        salesStats[product.category_id] += (item.price || 0) * (item.quantity || 0);
      }
    });

    return Object.entries(salesStats)
      .map(([id, sales]) => {
        const category = categories.find(c => c.id.toString() === id);
        const name = category ? category.name : 'Autres';
        return { name, value: Math.round(sales), sales: Math.round(sales) };
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  };

  const salesData = generateDailySalesData();
  const stockData = generateStockData();
  const salesDataFull = generateCategorySalesData();
  const currentCategoryData = categoryView === 'stock' ? stockData : salesDataFull;

  const totalValue = currentCategoryData.reduce((sum: number, item: any) => sum + item.value, 0);


  return (
    <div className="space-y-6 mb-60 bg-white">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Commandes Total</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Ventes Total</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(dashboardStats.totalSales)}DH</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Clients Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Commandes En Attente</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Stock Faible</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.lowStockProducts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventes par Jour (7 derniers jours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Math.round(Number(value))}DH`, 'Ventes']} />
              <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Distribution par Catégorie</h3>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setCategoryView('stock')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  categoryView === 'stock'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Stock
              </button>
              <button
                onClick={() => setCategoryView('sales')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  categoryView === 'sales'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ventes
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={currentCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {currentCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                            <p className="font-bold text-gray-900">{data.name}</p>
                            <p className="text-sm text-gray-600">
                              {categoryView === 'stock' 
                                ? `${data.value} produits` 
                                : `${data.value.toLocaleString()} DH`}
                            </p>
                            <p className="text-xs text-blue-600 font-medium">
                              {((data.value / totalValue) * 100).toFixed(1)}% du total
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 mt-4 md:mt-0 space-y-2 max-h-[260px] overflow-y-auto px-2 custom-scrollbar">
              {currentCategoryData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                    />
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {categoryView === 'stock' ? item.value : `${item.value.toLocaleString()}DH`}
                    </span>
                    <p className="text-[10px] text-gray-500">
                      {((item.value / totalValue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              {currentCategoryData.length === 0 && (
                <div className="text-center py-10">
                  <LayoutGrid className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Aucune donnée disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes Récentes</h3>
          <div className="space-y-3">
            {orders
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 5)
              .map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      #{order.user?.name || `User #${order.user_id}` || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at || order.placed_at || '').toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{Math.round(order.total_amount)}DH</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            {orders.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Aucune commande trouvée
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerte Stock Faible</h3>
          <div className="space-y-3">
            {products
              .filter(product => (product.stock_quantity || 0) < 10)
              .map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={getProductImageUrl(product.image_url)} 
                      alt={product.name} 
                      className="w-10 h-10 rounded-lg object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400';
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{categories.find(c => c.id === product.category_id)?.name || 'Sans catégorie'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{product.stock_quantity || 0} restant</p>
                    <button className="text-xs text-red-600 hover:text-red-800">Réapprovisionner</button>
                  </div>
                </div>
              ))}
            {products.filter(product => (product.stock_quantity || 0) < 10).length === 0 && (
              <div className="text-center py-4 text-green-600">
                Tous les produits ont un stock suffisant
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
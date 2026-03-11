'use client';
import React from 'react';
import { Clock, Truck, CheckCircle, XCircle, Edit, Trash2, Search, Filter } from 'lucide-react';

import { Order, Product, Category, Subcategory, SubSubcategory, User } from '@/types/admin';

interface OrdersProps {
  orders: Order[];
  getStatusColor: (status: string) => string;
  updateOrderStatus: (id: number, orderData: { status: string }) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  openModal: (type: string, item?: Product | Category | Subcategory | SubSubcategory | User | Order | null) => void;
}

const Orders: React.FC<OrdersProps> = ({
  orders,
  getStatusColor,
  updateOrderStatus,
  deleteOrder,
  openModal
}) => {
  // Ensure orders is always an array and handle potential data structure issues
  const safeOrders = Array.isArray(orders) ? orders : [];

  const topScrollRef = React.useRef<HTMLDivElement>(null);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = React.useState(1000);

  // Sync scroll bars and update width
  React.useEffect(() => {
    const topScroll = topScrollRef.current;
    const tableContainer = tableContainerRef.current;

    if (!topScroll || !tableContainer) return;

    const updateWidth = () => {
      setScrollWidth(tableContainer.scrollWidth);
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(tableContainer);

    const handleTopScroll = () => {
      if (tableContainer.scrollLeft !== topScroll.scrollLeft) {
        tableContainer.scrollLeft = topScroll.scrollLeft;
      }
    };

    const handleTableScroll = () => {
      if (topScroll.scrollLeft !== tableContainer.scrollLeft) {
        topScroll.scrollLeft = tableContainer.scrollLeft;
      }
    };

    topScroll.addEventListener('scroll', handleTopScroll);
    tableContainer.addEventListener('scroll', handleTableScroll);

    return () => {
      topScroll.removeEventListener('scroll', handleTopScroll);
      tableContainer.removeEventListener('scroll', handleTableScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filteredOrders = safeOrders.filter(order => {
    // Extract customer name for matching, similar to how it's done in the render
    let customerNameFromAddress = '';
    if (order.shipping_address) {
      try {
        const address = typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address) 
          : order.shipping_address;
        if (address && address.full_name) {
          customerNameFromAddress = address.full_name;
        }
      } catch (e) {
        // Silently fail search name extraction
      }
    }

    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      (order.user?.name || '').toLowerCase().includes(term) ||
      (order.user?.email || '').toLowerCase().includes(term) ||
      customerNameFromAddress.toLowerCase().includes(term);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h2>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par ID ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full md:w-64 text-gray-900"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full md:w-48 text-gray-900 appearance-none"
            >
              <option value="all">Tous les Statuts</option>
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="canceled">Annulée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'En Attente', count: safeOrders.filter(o => o.status === 'pending').length, color: 'yellow', icon: Clock },
          { label: 'Expédiées', count: safeOrders.filter(o => o.status === 'shipped').length, color: 'blue', icon: Truck },
          { label: 'Payées', count: safeOrders.filter(o => o.status === 'paid').length, color: 'green', icon: CheckCircle },
          { label: 'Livrées', count: safeOrders.filter(o => o.status === 'delivered').length, color: 'green', icon: CheckCircle },
          { label: 'Annulées', count: safeOrders.filter(o => o.status === 'canceled').length, color: 'red', icon: XCircle }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.count}</p>
                </div>
                <IconComponent className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Scrollbar */}
      <div 
        ref={topScrollRef}
        className="overflow-x-auto h-5 bg-gray-100 border-x border-t border-gray-300 rounded-t-lg top-scrollbar relative z-10" 
      >
        <div style={{ width: `${scrollWidth}px`, height: '1px' }}></div>
      </div>

      {/* Orders Table */}
      <div 
        ref={tableContainerRef}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto"
      >
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                let customerName = order.user?.name || 'N/A';
                
                // Try to get name from shipping address if available
                if (order.shipping_address) {
                  try {
                    const address = typeof order.shipping_address === 'string' 
                      ? JSON.parse(order.shipping_address) 
                      : order.shipping_address;
                    if (address && address.full_name) {
                      customerName = address.full_name;
                    }
                  } catch (e) {
                    console.error('Error parsing shipping address for name:', e);
                  }
                }

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customerName}
                    </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.placed_at ? new Date(order.placed_at).toLocaleDateString() : 
                   (order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.items_count || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.total_amount || 0}DH
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    value={order.status || 'pending'} 
                    onChange={(e) => updateOrderStatus(order.id, { status: e.target.value })}
                    className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">En Attente</option>
                    <option value="shipped">Expédiée</option>
                    <option value="paid">Payée</option>
                    <option value="delivered">Livrée</option>
                    <option value="canceled">Annulée</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* <button className="text-blue-600 hover:text-blue-900">
                      <Eye size={16} />
                    </button> */}
                    <button 
                      onClick={() => openModal('order', order)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        )}
      </div>
      <style jsx>{`
        .top-scrollbar::-webkit-scrollbar {
          height: 10px;
        }
        .top-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .top-scrollbar::-webkit-scrollbar-thumb {
          background: #dc2626;
          border-radius: 5px;
        }
        .top-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b91c1c;
        }
        .top-scrollbar {
          scrollbar-width: auto;
          scrollbar-color: #dc2626 #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default Orders;
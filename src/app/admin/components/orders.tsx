'use client';
import React from 'react';
import { Clock, Truck, CheckCircle, XCircle, Eye, Edit, Trash2 } from 'lucide-react';

import { Order } from '@/types/admin';

interface OrdersProps {
  orders: Order[];
  getStatusColor: (status: string) => string;
  updateOrderStatus: (id: number, orderData: { status: string }) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
}

const Orders: React.FC<OrdersProps> = ({
  orders,
  getStatusColor,
  updateOrderStatus,
  deleteOrder
}) => {
  // Ensure orders is always an array and handle potential data structure issues
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h2>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'En Attente', count: safeOrders.filter(o => o.status === 'pending').length, color: 'yellow', icon: Clock },
          { label: 'Expédiées', count: safeOrders.filter(o => o.status === 'shipped').length, color: 'blue', icon: Truck },
          { label: 'Livrées', count: safeOrders.filter(o => o.status === 'delivered').length, color: 'green', icon: CheckCircle },
          { label: 'Annulées', count: safeOrders.filter(o => o.status === 'cancelled').length, color: 'red', icon: XCircle }
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

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
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
            {safeOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.user?.name || `User #${order.user_id}` || 'N/A'}
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
                    <option value="pending">pending</option>
                    <option value="shipped">shipped</option>
                    <option value="paid">paid</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
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
            ))}
          </tbody>
        </table>
        
        {safeOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
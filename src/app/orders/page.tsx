'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProductImageUrl } from '@/utils/imageHelper';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  ArrowLeft, 
  Eye,
  Calendar,
  CreditCard,
  MapPin,
  Banknote,
  RefreshCw,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import Axios from 'axios';

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  // Product details (if populated)
  product?: {
    id: number;
    name: string;
    image_url: string;
    description?: string;
  };
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'card' | 'cash_on_delivery';
  shipping_address: string | {
    full_name: string;
    phone: string;
    address: string;
    city: string;
  };
  placed_at: string;
  created_at: string;
  updated_at: string;
  // Order items relationship
  order_items?: OrderItem[];
  items?: OrderItem[]; // Alternative field name
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/api/orders');
      console.log('Orders response:', response.data); // Debug log
      
      // Handle different response structures
      let ordersData = response.data;
      if (response.data.orders) {
        ordersData = response.data.orders;
      } else if (response.data.data) {
        ordersData = response.data.data;
      }
      console.log('Orders data:', ordersData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error: unknown) {
      if (Axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Erreur lors du chargement des commandes');
      } else {
        setError('Erreur lors du chargement des commandes');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const parseShippingAddress = (address: string | object) => {
    if (typeof address === 'object' && address !== null) {
      return address as Record<string, string>;
    }
    
    if (typeof address === 'string') {
      try {
        return JSON.parse(address);
      } catch {
        // If it's not valid JSON, treat as a simple address string
        return {
          full_name: user?.name || 'N/A',
          address: address,
          city: 'N/A',
          phone: 'N/A'
        };
      }
    }
    
    return {
      full_name: 'N/A',
      address: 'N/A',
      city: 'N/A',
      phone: 'N/A'
    };
  };

  const getOrderItems = (order: Order): OrderItem[] => {
    return order.order_items || order.items || [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <RefreshCw size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <AlertCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En traitement';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateItemTotal = (item: OrderItem) => {
    return item.price * item.quantity;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Package className="text-gray-600" size={48} />
          </div>
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            Connexion requise
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed text-lg">
            Vous devez être connecté pour voir vos commandes.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 text-white rounded font-medium hover:bg-teal-600 transition-all duration-300"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-8 lg:px-16 pt-30 pb-80">
      <div className="max-w-6xl mx-auto relative mt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link 
              href="/products"
              className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors duration-300 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Continuer mes achats</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-500 rounded flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-light text-gray-900">
                Mes Commandes
              </h1>
              <p className="text-gray-600">
                {orders.length} commande{orders.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <div>
                <h3 className="font-semibold text-red-800">Erreur</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchOrders}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
            >
              Réessayer
            </button>
          </div>
        )}

        {orders.length === 0 && !error ? (
          /* Empty Orders */
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="text-gray-600" size={48} />
            </div>
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Aucune commande
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed text-lg">
              Vous n&apos;avez pas encore passé de commande. Découvrez notre collection !
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 text-white rounded font-medium hover:bg-teal-600 transition-all duration-300"
            >
              <Package size={20} />
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderItems = getOrderItems(order);
              const shippingAddress = parseShippingAddress(order.shipping_address);
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div className="space-y-2 mb-4 md:mb-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-medium text-gray-900">
                          Commande #{order.id}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {formatDate(order.placed_at || order.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          {order.payment_method === 'card' ? <CreditCard size={16} /> : <Banknote size={16} />}
                          {order.payment_method === 'card' ? 'Carte bancaire' : 'Paiement à la livraison'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-medium text-gray-900">
                          {Number(order.total_amount).toFixed(2)} DH
                        </div>
                        <div className="text-sm text-gray-600">
                          {orderItems.length} article{orderItems.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-50 rounded transition-all duration-300"
                        title="Voir les détails"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {orderItems.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {orderItems.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded p-3">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                            {item.product?.image_url ? (
                              <img
                                src={getProductImageUrl(item.product.image_url)}
                                alt={item.product?.name || 'Produit'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package size={16} className="text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {item.product?.name || `Produit #${item.product_id}`}
                            </p>
                            <p className="text-xs text-gray-600">
                              x{item.quantity} - {Number(item.price).toFixed(2)} DH
                            </p>
                          </div>
                        </div>
                      ))}
                      {orderItems.length > 4 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded p-3">
                          <span className="text-sm font-medium text-gray-700">
                            +{orderItems.length - 4} autres
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded p-4 text-center text-gray-600">
                      <Package size={24} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Articles non disponibles</p>
                    </div>
                  )}

                  {/* Expanded Order Details */}
                  {selectedOrder?.id === order.id && (
                    <div className="border-t border-gray-200 pt-6 mt-6 space-y-6">
                      {/* Detailed Items */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Articles commandés</h4>
                        {orderItems.length > 0 ? (
                          <div className="space-y-3">
                            {orderItems.map((item) => (
                              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded">
                                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                  {item.product?.image_url ? (
                                    <img
                                      src={getProductImageUrl(item.product.image_url)}
                                      alt={item.product?.name || 'Produit'}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package size={24} className="text-gray-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">
                                    {item.product?.name || `Produit #${item.product_id}`}
                                  </h5>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-gray-600">Quantité: {item.quantity}</span>
                                    <div className="text-right">
                                      <div className="text-gray-900 font-medium">
                                        {calculateItemTotal(item).toFixed(2)} DH
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {Number(item.price).toFixed(2)} DH / unité
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded p-6 text-center text-gray-600">
                            <Package size={32} className="mx-auto mb-3 text-gray-400" />
                            <p>Aucun détail d&apos;article disponible</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shipping Address */}
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin size={20} />
                            Adresse de livraison
                          </h4>
                          <div className="bg-gray-50 rounded p-4">
                            <div className="space-y-1 text-gray-700">
                              <p className="font-medium">{shippingAddress.full_name}</p>
                              <p>{shippingAddress.address}</p>
                              {shippingAddress.city !== 'N/A' && <p>{shippingAddress.city}</p>}
                              {shippingAddress.phone !== 'N/A' && <p>Tél: {shippingAddress.phone}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Récapitulatif</h4>
                          <div className="bg-gray-50 rounded p-4 space-y-2">
                            <div className="border-t border-gray-200 pt-2">
                              <div className="flex justify-between text-gray-900 font-medium text-lg">
                                <span>Total</span>
                                <span>{Number(order.total_amount).toFixed(2)} DH</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
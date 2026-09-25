import React, { useState } from 'react';
import { 
  Clock, Truck, CheckCircle, XCircle, RotateCcw, Plus, Edit, Trash2, Search, Filter, 
  ChevronDown, ChevronUp, Package, User as UserIcon, MapPin, Phone, Mail, 
  CreditCard, Calendar, Eye
} from 'lucide-react';
import { getProductImageUrl } from '@/utils/imageHelper';
import { Order, Product, Category, Subcategory, SubSubcategory, User, OrderItem } from '@/types/admin';

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
  const [expandedOrderIds, setExpandedOrderIds] = useState<number[]>([]);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedOrderIds(prev => 
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  const getOrderItems = (order: Order): OrderItem[] => {
    return order.order_items || order.items || [];
  };

  const parseShippingAddress = (addressData: Order['shipping_address']) => {
    if (!addressData) return { full_name: '', phone: '', address: '', city: '', postal_code: '' };
    if (typeof addressData === 'object' && addressData !== null) {
      return {
        full_name: addressData.full_name || '',
        phone: addressData.phone || '',
        address: addressData.address || '',
        city: addressData.city || '',
        postal_code: addressData.postal_code || '',
      };
    }
    if (typeof addressData === 'string') {
      try {
        const parsed = JSON.parse(addressData);
        if (typeof parsed === 'object' && parsed !== null) {
          return {
            full_name: parsed.full_name || '',
            phone: parsed.phone || '',
            address: parsed.address || '',
            city: parsed.city || '',
            postal_code: parsed.postal_code || '',
          };
        }
      } catch {
        return { full_name: '', phone: '', address: addressData, city: '', postal_code: '' };
      }
    }
    return { full_name: '', phone: '', address: '', city: '', postal_code: '' };
  };

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
  const [visibleCount, setVisibleCount] = useState(50);

  const filteredOrders = safeOrders.filter(order => {
    const shipping = parseShippingAddress(order.shipping_address);
    const term = searchTerm.toLowerCase();

    // Check if any product name matches
    const items = getOrderItems(order);
    const matchesProduct = items.some(item => 
      (item.product?.name || item.name || '').toLowerCase().includes(term)
    );

    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      (order.user?.name || '').toLowerCase().includes(term) ||
      (order.user?.email || '').toLowerCase().includes(term) ||
      (order.user?.phone || '').toLowerCase().includes(term) ||
      shipping.full_name.toLowerCase().includes(term) ||
      shipping.phone.toLowerCase().includes(term) ||
      shipping.city.toLowerCase().includes(term) ||
      shipping.address.toLowerCase().includes(term) ||
      matchesProduct;
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const displayedOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOrders.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 50);
  };

  // Reset visibleCount when filters change
  React.useEffect(() => {
    setVisibleCount(50);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h2>
          <p className="text-sm text-gray-500 mt-0.5">Visualisez les produits commandés, quantités et détails clients</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher (ID, client, produit, tél)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full md:w-72 text-gray-900"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full md:w-48 text-gray-900 appearance-none bg-white"
            >
              <option value="all">Tous les Statuts</option>
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="canceled">Annulée</option>
              <option value="retour">Retour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'En Attente', count: safeOrders.filter(o => o.status === 'pending').length, color: 'yellow', icon: Clock },
          { label: 'Expédiées', count: safeOrders.filter(o => o.status === 'shipped').length, color: 'blue', icon: Truck },
          { label: 'Payées', count: safeOrders.filter(o => o.status === 'paid').length, color: 'green', icon: CheckCircle },
          { label: 'Livrées', count: safeOrders.filter(o => o.status === 'delivered').length, color: 'green', icon: CheckCircle },
          { label: 'Annulées', count: safeOrders.filter(o => o.status === 'canceled' || o.status === 'cancelled').length, color: 'red', icon: XCircle },
          { label: 'Retour', count: safeOrders.filter(o => o.status === 'retour').length, color: 'orange', icon: RotateCcw }
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
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-10 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase"></th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails Client</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits & Qté</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {displayedOrders.map((order) => {
                const shipping = parseShippingAddress(order.shipping_address);
                const customerName = shipping.full_name || order.user?.name || `Utilisateur #${order.user_id}`;
                const customerEmail = order.user?.email || null;
                const customerPhone = shipping.phone || order.user?.phone || null;
                const items = getOrderItems(order);
                const isExpanded = expandedOrderIds.includes(order.id);
                const totalItemCount = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

                return (
                  <React.Fragment key={order.id}>
                    <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-red-50/20' : ''}`}>
                      {/* Expand / Collapse Button */}
                      <td className="px-3 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleExpand(order.id)}
                          className="p-1 rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors"
                          title={isExpanded ? 'Réduire' : 'Voir les détails et articles'}
                        >
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>

                      {/* Order ID & Payment */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">#{order.id}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <CreditCard size={12} className="text-gray-400" />
                          <span>{order.payment_method === 'cash_on_delivery' ? 'À la livraison' : (order.payment_method || 'N/A')}</span>
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                          <UserIcon size={14} className="text-gray-400 flex-shrink-0" />
                          <span>{customerName}</span>
                        </div>
                        {customerEmail && (
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Mail size={12} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[200px]" title={customerEmail}>{customerEmail}</span>
                          </div>
                        )}
                        {customerPhone && (
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Phone size={12} className="text-gray-400 flex-shrink-0" />
                            <span>{customerPhone}</span>
                          </div>
                        )}
                        {shipping.city && (
                          <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                            <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                            <span>{shipping.city}</span>
                          </div>
                        )}
                      </td>

                      {/* Products Summary Pill */}
                      <td className="px-5 py-4">
                        {items.length > 0 ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                <Package size={12} className="mr-1 text-gray-500" />
                                {items.length} {items.length > 1 ? 'articles' : 'article'} ({totalItemCount} pcs)
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleExpand(order.id)}
                                className="text-xs text-red-600 hover:text-red-800 hover:underline font-medium"
                              >
                                {isExpanded ? 'Masquer' : 'Voir liste'}
                              </button>
                            </div>
                            {/* Preview first 2 items */}
                            <div className="text-xs text-gray-600 max-w-xs space-y-0.5">
                              {items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="truncate flex items-center gap-1">
                                  <span className="font-semibold text-gray-800">{item.quantity}x</span>
                                  <span className="truncate">{item.product?.name || item.name || `Produit #${item.product_id}`}</span>
                                </div>
                              ))}
                              {items.length > 2 && (
                                <div className="text-[11px] text-gray-400 italic">
                                  + {items.length - 2} autre(s)...
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic">
                            {order.items_count ? `${order.items_count} articles` : 'Aucun produit'}
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={13} className="text-gray-400" />
                          <span>
                            {order.placed_at ? new Date(order.placed_at).toLocaleDateString('fr-FR') : 
                             (order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : 'N/A')}
                          </span>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {order.total_amount || 0} DH
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <select 
                          value={order.status || 'pending'} 
                          onChange={(e) => updateOrderStatus(order.id, { status: e.target.value })}
                          className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">En Attente</option>
                          <option value="paid">Payée</option>
                          <option value="shipped">Expédiée</option>
                          <option value="delivered">Livrée</option>
                          <option value="canceled">Annulée</option>
                          <option value="retour">Retour</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            type="button"
                            onClick={() => setDetailsOrder(order)}
                            title="Aperçu complet de la commande"
                            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Eye size={17} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => openModal('order', order)}
                            title="Modifier la commande"
                            className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
                          >
                            <Edit size={17} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => deleteOrder(order.id)}
                            title="Supprimer la commande"
                            className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Order Details Row */}
                    {isExpanded && (
                      <tr className="bg-gray-50/80">
                        <td colSpan={8} className="px-6 py-4 border-b border-gray-200">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            {/* Products Ordered & Quantities */}
                            <div className="lg:col-span-2 space-y-3">
                              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                  <Package size={16} className="text-red-600" />
                                  <span>Articles commandés ({items.length})</span>
                                </h4>
                                <span className="text-xs text-gray-500 font-medium">
                                  Total articles: {totalItemCount}
                                </span>
                              </div>

                              {items.length > 0 ? (
                                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                                  {items.map((item, idx) => {
                                    const productName = item.product?.name || item.name || `Produit #${item.product_id}`;
                                    const productImg = item.product?.image_url || item.image_url;
                                    const unitPrice = Number(item.price || item.product?.price || 0);
                                    const itemQty = Number(item.quantity) || 1;
                                    const lineTotal = unitPrice * itemQty;

                                    return (
                                      <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                                        <div className="flex items-center space-x-3 min-w-0">
                                          <img
                                            src={getProductImageUrl(productImg)}
                                            alt={productName}
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0 border border-gray-200"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement;
                                              target.src = '/img/logo.png';
                                            }}
                                          />
                                          <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                              {productName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              Réf ID: #{item.product_id}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                          <div className="text-sm font-bold text-gray-900">
                                            {lineTotal.toLocaleString()} DH
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {itemQty} x {unitPrice.toLocaleString()} DH
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 italic py-3">
                                  Aucun détail d&apos;article disponible pour cette commande.
                                </p>
                              )}
                            </div>

                            {/* Customer & Shipping Details */}
                            <div className="space-y-3 bg-gray-50/70 p-4 rounded-lg border border-gray-100">
                              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                <UserIcon size={16} className="text-red-600" />
                                <span>Coordonnées Client</span>
                              </h4>
                              
                              <div className="space-y-2.5 text-xs text-gray-700">
                                <div>
                                  <span className="text-gray-500 block font-medium">Nom complet:</span>
                                  <span className="font-semibold text-gray-900 text-sm">{customerName}</span>
                                </div>

                                {customerEmail && (
                                  <div>
                                    <span className="text-gray-500 block font-medium">Email:</span>
                                    <span className="text-gray-900">{customerEmail}</span>
                                  </div>
                                )}

                                {customerPhone && (
                                  <div>
                                    <span className="text-gray-500 block font-medium">Téléphone:</span>
                                    <a href={`tel:${customerPhone}`} className="text-red-600 font-semibold hover:underline">
                                      {customerPhone}
                                    </a>
                                  </div>
                                )}

                                <div>
                                  <span className="text-gray-500 block font-medium">Adresse de livraison:</span>
                                  <div className="text-gray-900 mt-0.5 space-y-0.5">
                                    <p>{shipping.address || 'Non spécifiée'}</p>
                                    {(shipping.city || shipping.postal_code) && (
                                      <p className="text-gray-600 font-medium">
                                        {[shipping.postal_code, shipping.city].filter(Boolean).join(', ')}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                                  <span className="text-gray-500">Paiement:</span>
                                  <span className="font-medium text-gray-900 uppercase">
                                    {order.payment_method === 'cash_on_delivery' ? 'À la livraison' : (order.payment_method || 'N/A')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucune commande trouvée</p>
            <p className="text-xs text-gray-400 mt-1">Essayez de modifier votre recherche ou le filtre de statut</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        <p className="text-sm text-gray-500">
          Affichage de <span className="font-medium text-gray-900">{displayedOrders.length}</span> sur{" "}
          <span className="font-medium text-gray-900">{filteredOrders.length}</span> commandes
        </p>
        
        {hasMore && (
          <button
            onClick={handleLoadMore}
            className="group relative flex items-center gap-3 px-8 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-300"
          >
            <span className="text-sm font-semibold text-gray-700">Charger plus de commandes</span>
            <Plus size={18} className="text-red-600 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}

        <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-500"
            style={{ width: `${(displayedOrders.length / (filteredOrders.length || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Details Quick Modal */}
      {detailsOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Commande #{detailsOrder.id}
                </h3>
                <p className="text-xs text-gray-500">
                  Passée le {detailsOrder.placed_at ? new Date(detailsOrder.placed_at).toLocaleString('fr-FR') : (detailsOrder.created_at ? new Date(detailsOrder.created_at).toLocaleString('fr-FR') : 'N/A')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold rounded-full px-3 py-1 ${getStatusColor(detailsOrder.status)}`}>
                  {detailsOrder.status}
                </span>
                <button
                  type="button"
                  onClick={() => setDetailsOrder(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Client Info Card */}
              {(() => {
                const shipping = parseShippingAddress(detailsOrder.shipping_address);
                const clientName = shipping.full_name || detailsOrder.user?.name || `Utilisateur #${detailsOrder.user_id}`;
                const clientPhone = shipping.phone || detailsOrder.user?.phone;
                const clientEmail = detailsOrder.user?.email;

                return (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Informations Client</p>
                      <p className="text-sm font-bold text-gray-900">{clientName}</p>
                      {clientEmail && <p className="text-xs text-gray-600 mt-0.5">{clientEmail}</p>}
                      {clientPhone && (
                        <p className="text-xs text-red-600 font-semibold mt-1">
                          Tél: {clientPhone}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Adresse de Livraison</p>
                      <p className="text-xs text-gray-800">{shipping.address || 'Non spécifiée'}</p>
                      {(shipping.city || shipping.postal_code) && (
                        <p className="text-xs font-medium text-gray-600 mt-0.5">
                          {[shipping.postal_code, shipping.city].filter(Boolean).join(', ')}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Paiement: <span className="font-semibold text-gray-800">{detailsOrder.payment_method === 'cash_on_delivery' ? 'À la livraison (Cash)' : (detailsOrder.payment_method || 'N/A')}</span>
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Items List */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={16} className="text-red-600" />
                  <span>Articles ({getOrderItems(detailsOrder).length})</span>
                </h4>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                  {getOrderItems(detailsOrder).map((item, idx) => {
                    const productName = item.product?.name || item.name || `Produit #${item.product_id}`;
                    const productImg = item.product?.image_url || item.image_url;
                    const unitPrice = Number(item.price || item.product?.price || 0);
                    const qty = Number(item.quantity) || 1;

                    return (
                      <div key={idx} className="p-3 flex items-center justify-between gap-4 hover:bg-gray-50">
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={getProductImageUrl(productImg)}
                            alt={productName}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0 border border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/img/logo.png';
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Quantité: <span className="font-bold text-gray-800">{qty}</span> &times; {unitPrice.toLocaleString()} DH
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">
                            {(qty * unitPrice).toLocaleString()} DH
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {getOrderItems(detailsOrder).length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Aucun article listé
                    </div>
                  )}
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-center bg-red-50/60 p-4 rounded-xl border border-red-100">
                <span className="text-sm font-semibold text-gray-700">Montant Total :</span>
                <span className="text-xl font-bold text-red-600">
                  {detailsOrder.total_amount || 0} DH
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDetailsOrder(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  const toEdit = detailsOrder;
                  setDetailsOrder(null);
                  openModal('order', toEdit);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center gap-2"
              >
                <Edit size={14} />
                <span>Modifier la commande</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
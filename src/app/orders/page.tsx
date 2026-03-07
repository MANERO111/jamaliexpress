'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProductImageUrl } from '@/utils/imageHelper';
import {
  Package, Clock, CheckCircle, Truck, ArrowLeft, Eye, EyeOff,
  Calendar, CreditCard, MapPin, Banknote, RefreshCw,
  AlertCircle, ShoppingBag, ArrowRight, Phone, ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import Axios from 'axios';

interface OrderItem {
  id: number; order_id: number; product_id: number;
  quantity: number; price: number;
  created_at: string; updated_at: string;
  product?: { id: number; name: string; image_url: string; description?: string; };
}
interface Order {
  id: number; user_id: number; total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'card' | 'cash_on_delivery';
  shipping_address: string | { full_name: string; phone: string; address: string; city: string; };
  placed_at: string; created_at: string; updated_at: string;
  order_items?: OrderItem[]; items?: OrderItem[];
}

/* ── Status config ── */
const STATUS_CONFIG: Record<string, { label: string; color: string; rgb: string; icon: React.ReactNode; step: number }> = {
  pending:    { label: 'En attente',    color: '#f59e0b', rgb: '245,158,11',  icon: <Clock size={13} />,       step: 1 },
  processing: { label: 'En traitement', color: '#41cdcf', rgb: '65,205,207',  icon: <RefreshCw size={13} />,   step: 2 },
  shipped:    { label: 'Expédiée',      color: '#a78bfa', rgb: '167,139,250', icon: <Truck size={13} />,       step: 3 },
  delivered:  { label: 'Livrée',        color: '#41cdcf', rgb: '65,205,207',  icon: <CheckCircle size={13} />, step: 4 },
  cancelled:  { label: 'Annulée',       color: '#f54f9a', rgb: '245,79,154',  icon: <AlertCircle size={13} />, step: 0 },
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => { if (isAuthenticated) fetchOrders(); }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true); setError(null);
      const res = await axios.get('/api/orders');
      const data = res.data?.orders || res.data?.data || res.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(Axios.isAxiosError(err) ? err.response?.data?.message || 'Erreur de chargement' : 'Erreur de chargement');
    } finally { setIsLoading(false); }
  };

  const parseAddress = (addr: string | object) => {
    if (typeof addr === 'object' && addr !== null) return addr as Record<string, string>;
    if (typeof addr === 'string') {
      try { return JSON.parse(addr); } catch { return { full_name: user?.name || '', address: addr, city: '', phone: '' }; }
    }
    return { full_name: '', address: '', city: '', phone: '' };
  };

  const getItems = (o: Order): OrderItem[] => o.order_items || o.items || [];

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  /* ── Not authenticated ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center pt-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#41cdcf]/[0.05] blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#f54f9a]/[0.05] blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(rgba(26,26,46,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-8"
            style={{ border: '1px solid rgba(65,205,207,0.28)', background: 'rgba(65,205,207,0.05)' }}>
            <Package size={30} style={{ color: 'rgba(26,26,46,0.2)' }} />
          </div>
          <h2 className="text-3xl font-light text-[#1a1a2e] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Connexion requise
          </h2>
          <p className="text-[12.5px] font-light text-[#1a1a2e]/40 mb-8 leading-[1.8]" style={{ fontFamily: "'Jost', sans-serif" }}>
            Vous devez être connecté pour consulter vos commandes.
          </p>
          <Link href="/auth/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-white"
            style={{ fontFamily: "'Jost', sans-serif", background: 'linear-gradient(135deg, #f54f9a, #d4326e)', textDecoration: 'none', boxShadow: '0 8px 24px rgba(245,79,154,0.28)' }}>
            Se connecter <ArrowRight size={13} />
          </Link>
        </div>
        <style>{fonts}</style>
      </div>
    );
  }

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] pt-36 pb-20">
        <div className="max-w-[960px] mx-auto px-4 md:px-8 lg:px-10 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white animate-pulse p-6" style={{ border: '1px solid rgba(26,26,46,0.07)' }}>
              <div className="flex justify-between mb-5">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-32" />
                  <div className="h-3 bg-gray-100 rounded w-48" />
                </div>
                <div className="h-6 w-24 bg-gray-100 rounded" />
              </div>
              <div className="flex gap-3">
                {[...Array(3)].map((_, j) => <div key={j} className="w-16 h-16 bg-gray-100" />)}
              </div>
            </div>
          ))}
        </div>
        <style>{fonts}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-40 pb-24 relative overflow-hidden">

      {/* ── Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#41cdcf]/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-[#f54f9a]/[0.04] blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(rgba(26,26,46,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <div className="relative z-10 max-w-[960px] mx-auto px-4 md:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/products"
            className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-300 group"
            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.4)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f54f9a')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,46,0.4)')}>
            <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Nos produits
          </Link>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
              <span className="text-[9px] font-semibold tracking-[0.4em] uppercase text-[#1a1a2e]/30"
                style={{ fontFamily: "'Jost', sans-serif" }}>Mon compte</span>
              <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#41cdcf]" />
            </div>
            <h1 className="text-[28px] md:text-[36px] font-light text-[#1a1a2e]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Mes{' '}
              <em className="not-italic" style={{ background: 'linear-gradient(110deg, #f54f9a, #41cdcf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                commandes
              </em>
            </h1>
          </div>
          <div className="w-[110px]" />
        </div>

        {/* ── Count label ── */}
        {orders.length > 0 && (
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-px bg-gradient-to-r from-[#f54f9a] to-transparent" />
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#1a1a2e]/38"
              style={{ fontFamily: "'Jost', sans-serif" }}>
              {orders.length} commande{orders.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="relative overflow-hidden mb-8 p-5"
            style={{ background: 'rgba(245,79,154,0.04)', border: '1px solid rgba(245,79,154,0.25)' }}>
            <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: 'linear-gradient(90deg, #f54f9a, transparent)' }} />
            <div className="flex items-start gap-3">
              <AlertCircle size={18} style={{ color: '#f54f9a', flexShrink: 0, marginTop: 1 }} />
              <div className="flex-1">
                <p className="text-[12px] font-medium text-[#1a1a2e] mb-1" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Erreur de chargement
                </p>
                <p className="text-[11px] font-light text-[#1a1a2e]/50" style={{ fontFamily: "'Jost', sans-serif" }}>{error}</p>
              </div>
              <button onClick={fetchOrders}
                className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-white transition-all duration-300"
                style={{ fontFamily: "'Jost', sans-serif", background: 'linear-gradient(135deg, #f54f9a, #d4326e)', border: 'none', cursor: 'pointer' }}>
                <RefreshCw size={11} /> Réessayer
              </button>
            </div>
          </div>
        )}

        {/* ── Empty ── */}
        {orders.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 flex items-center justify-center mb-7"
              style={{ border: '1px solid rgba(65,205,207,0.25)', background: 'rgba(65,205,207,0.05)' }}>
              <ShoppingBag size={26} style={{ color: 'rgba(26,26,46,0.2)' }} />
            </div>
            <h2 className="text-2xl font-light text-[#1a1a2e] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Aucune commande pour l&apos;instant
            </h2>
            <p className="text-[12px] font-light text-[#1a1a2e]/38 mb-8 max-w-xs leading-relaxed" style={{ fontFamily: "'Jost', sans-serif" }}>
              Votre historique de commandes apparaîtra ici après votre premier achat.
            </p>
            <Link href="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-white"
              style={{ fontFamily: "'Jost', sans-serif", background: 'linear-gradient(135deg, #f54f9a, #d4326e)', textDecoration: 'none', boxShadow: '0 8px 24px rgba(245,79,154,0.28)' }}>
              Découvrir nos produits <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* ── Orders list ── */}
        <div className="space-y-5">
          {orders.map((order, oIdx) => {
            const items = getItems(order);
            const address = parseAddress(order.shipping_address);
            const isExpanded = expandedId === order.id;
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const isPink = oIdx % 2 === 0;
            const cardCol = isPink ? '#f54f9a' : '#41cdcf';
            const cardRgb = isPink ? '245,79,154' : '65,205,207';

            return (
              <div key={order.id}
                className="relative overflow-hidden bg-white transition-all duration-400"
                style={{
                  border: `1px solid ${isExpanded ? `rgba(${cardRgb},0.28)` : 'rgba(26,26,46,0.08)'}`,
                  boxShadow: isExpanded ? `0 16px 48px rgba(${cardRgb},0.1), 0 4px 12px rgba(0,0,0,0.04)` : '0 2px 8px rgba(0,0,0,0.03)',
                }}>

                {/* Card top accent */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, ${cardCol}, transparent)`, opacity: isExpanded ? 1 : 0 }} />

                {/* ── Order header row ── */}
                <div className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Left: ID + meta */}
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-[10px] font-semibold tracking-[0.24em] uppercase text-[#1a1a2e]/35"
                          style={{ fontFamily: "'Jost', sans-serif" }}>
                          Commande
                        </span>
                        <span className="text-[16px] font-light text-[#1a1a2e]"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          #{String(order.id).padStart(5, '0')}
                        </span>

                        {/* Status badge */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9.5px] font-semibold tracking-[0.14em] uppercase"
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            background: `rgba(${cfg.rgb},0.1)`,
                            border: `1px solid rgba(${cfg.rgb},0.3)`,
                            color: cfg.color,
                          }}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5 text-[11px] font-light text-[#1a1a2e]/40"
                          style={{ fontFamily: "'Jost', sans-serif" }}>
                          <Calendar size={12} style={{ color: cardCol }} />
                          {formatDate(order.placed_at || order.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] font-light text-[#1a1a2e]/40"
                          style={{ fontFamily: "'Jost', sans-serif" }}>
                          {order.payment_method === 'card'
                            ? <CreditCard size={12} style={{ color: cardCol }} />
                            : <Banknote size={12} style={{ color: cardCol }} />}
                          {order.payment_method === 'card' ? 'Carte bancaire' : 'À la livraison'}
                        </span>
                      </div>
                    </div>

                    {/* Right: total + toggle */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[22px] font-light text-[#1a1a2e]"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {Number(order.total_amount).toFixed(2)}{' '}
                          <span style={{ fontSize: '13px' }}>د.م</span>
                        </p>
                        <p className="text-[10px] font-light text-[#1a1a2e]/35"
                          style={{ fontFamily: "'Jost', sans-serif" }}>
                          {items.length} article{items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        className="w-9 h-9 flex items-center justify-center transition-all duration-300"
                        style={{
                          border: `1px solid ${isExpanded ? `rgba(${cardRgb},0.3)` : 'rgba(26,26,46,0.1)'}`,
                          background: isExpanded ? `rgba(${cardRgb},0.08)` : 'transparent',
                          color: isExpanded ? cardCol : 'rgba(26,26,46,0.35)',
                        }}>
                        <ChevronDown size={15}
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.35s' }} />
                      </button>
                    </div>
                  </div>

                  {/* ── Item thumbnails preview ── */}
                  {items.length > 0 && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {items.slice(0, 5).map(item => (
                        <div key={item.id}
                          className="w-12 h-12 overflow-hidden flex-shrink-0 bg-[#f7f5f2] relative"
                          style={{ border: '1px solid rgba(26,26,46,0.07)' }}>
                          {item.product?.image_url ? (
                            <img src={getProductImageUrl(item.product.image_url)} alt={item.product?.name}
                              className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={14} style={{ color: 'rgba(26,26,46,0.2)' }} />
                            </div>
                          )}
                          {item.quantity > 1 && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 flex items-center justify-center text-[8px] font-bold text-white"
                              style={{ background: cardCol }}>
                              {item.quantity}
                            </div>
                          )}
                        </div>
                      ))}
                      {items.length > 5 && (
                        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                          style={{ border: '1px solid rgba(26,26,46,0.07)', background: 'rgba(26,26,46,0.03)' }}>
                          <span className="text-[10px] font-semibold text-[#1a1a2e]/35"
                            style={{ fontFamily: "'Jost', sans-serif" }}>
                            +{items.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Expanded detail ── */}
                <div style={{
                  maxHeight: isExpanded ? '1000px' : '0px',
                  overflow: 'hidden',
                  transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  <div style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}>

                    {/* Items detail */}
                    <div className="p-5 md:p-6 pb-0">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-5 h-px" style={{ background: `linear-gradient(90deg, ${cardCol}, transparent)` }} />
                        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#1a1a2e]/45"
                          style={{ fontFamily: "'Jost', sans-serif" }}>Articles commandés</span>
                      </div>
                      <div className="space-y-3">
                        {items.length > 0 ? items.map(item => (
                          <div key={item.id} className="flex items-center gap-4 p-4"
                            style={{ background: 'rgba(26,26,46,0.02)', border: '1px solid rgba(26,26,46,0.06)' }}>
                            <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-[#f7f5f2]"
                              style={{ border: '1px solid rgba(26,26,46,0.07)' }}>
                              {item.product?.image_url ? (
                                <img src={getProductImageUrl(item.product.image_url)} alt={item.product?.name}
                                  className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package size={18} style={{ color: 'rgba(26,26,46,0.18)' }} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-light text-[#1a1a2e] truncate"
                                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px' }}>
                                {item.product?.name || `Produit #${item.product_id}`}
                              </p>
                              <p className="text-[10.5px] font-light text-[#1a1a2e]/38 mt-0.5"
                                style={{ fontFamily: "'Jost', sans-serif" }}>
                                {Number(item.price).toFixed(2)} د.م / unité
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="text-[15px] font-semibold text-[#1a1a2e]"
                                style={{ fontFamily: "'Jost', sans-serif" }}>
                                {(item.price * item.quantity).toFixed(2)}{' '}
                                <span className="text-[10px] font-normal text-[#1a1a2e]/35">د.م</span>
                              </p>
                              <p className="text-[10px] font-light text-[#1a1a2e]/35"
                                style={{ fontFamily: "'Jost', sans-serif" }}>
                                × {item.quantity}
                              </p>
                            </div>
                          </div>
                        )) : (
                          <p className="text-[12px] font-light text-center text-[#1a1a2e]/35 py-6"
                            style={{ fontFamily: "'Jost', sans-serif" }}>Détails non disponibles</p>
                        )}
                      </div>
                    </div>

                    {/* Address + summary row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 md:p-6 pt-5">

                      {/* Shipping address */}
                      <div className="relative overflow-hidden p-4"
                        style={{ background: 'rgba(26,26,46,0.02)', border: '1px solid rgba(26,26,46,0.07)' }}>
                        <div className="absolute top-0 left-0 right-0 h-px"
                          style={{ background: `linear-gradient(90deg, ${cardCol}, transparent)` }} />
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin size={13} style={{ color: cardCol, flexShrink: 0 }} />
                          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#1a1a2e]/45"
                            style={{ fontFamily: "'Jost', sans-serif" }}>Livraison</span>
                        </div>
                        <div className="space-y-1">
                          {[
                            { val: address.full_name, bold: true },
                            { val: address.address },
                            { val: address.city },
                          ].filter(r => r.val && r.val !== 'N/A').map((row, i) => (
                            <p key={i}
                              className="text-[12px] leading-relaxed"
                              style={{ fontFamily: "'Jost', sans-serif", fontWeight: row.bold ? 500 : 300, color: row.bold ? '#1a1a2e' : 'rgba(26,26,46,0.55)' }}>
                              {row.val}
                            </p>
                          ))}
                          {address.phone && address.phone !== 'N/A' && (
                            <p className="flex items-center gap-1.5 text-[11px] font-light mt-1"
                              style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.45)' }}>
                              <Phone size={11} style={{ color: cardCol }} /> {address.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Order summary */}
                      <div className="relative overflow-hidden p-4"
                        style={{ background: 'rgba(26,26,46,0.02)', border: '1px solid rgba(26,26,46,0.07)' }}>
                        <div className="absolute top-0 left-0 right-0 h-px"
                          style={{ background: `linear-gradient(90deg, ${cardCol}, transparent)` }} />
                        <div className="flex items-center gap-2 mb-3">
                          <Package size={13} style={{ color: cardCol, flexShrink: 0 }} />
                          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#1a1a2e]/45"
                            style={{ fontFamily: "'Jost', sans-serif" }}>Récapitulatif</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2"
                          style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}>
                          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#1a1a2e]/45"
                            style={{ fontFamily: "'Jost', sans-serif" }}>Total</span>
                          <span className="text-[22px] font-light text-[#1a1a2e]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {Number(order.total_amount).toFixed(2)}{' '}
                            <span style={{ fontSize: '13px' }}>د.م</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{fonts}</style>
    </div>
  );
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500;600&display=swap');`;

export default OrdersPage;
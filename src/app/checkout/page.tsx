'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, CreditCard, ShoppingBag, User, Truck,
  Shield, CheckCircle, Banknote, Sparkles, ArrowRight,
  Package, MapPin, Phone, Mail, Lock
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import { getProductImageUrl } from '@/utils/imageHelper';

interface CheckoutForm {
  firstName: string; lastName: string; email: string; phone: string;
  shippingAddress: string; shippingCity: string; shippingPostalCode: string;
  paymentMethod: 'card' | 'cash_on_delivery';
  orderNotes: string;
}
interface CartItem {
  id: number; image_url: string; name: string;
  original_price: number; discounted_price?: number | null;
  price: number; quantity: number; stock_quantity: number;
}

/* ── Styled input ── */
const Field = ({
  label, name, value, onChange, error, type = 'text',
  placeholder, maxLength, required = true
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; type?: string; placeholder?: string;
  maxLength?: number; required?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="block text-[11px] font-semibold tracking-[0.2em] uppercase mb-2"
        style={{ fontFamily: "'Jost', sans-serif", color: error ? '#f54f9a' : 'rgba(26,26,46,0.55)' }}
      >
        {label}{required && ' *'}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} maxLength={maxLength}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full py-3 px-4 text-[13px] font-light outline-none transition-all duration-300"
        style={{
          fontFamily: "'Jost', sans-serif",
          background: focused ? '#fff' : 'rgba(26,26,46,0.02)',
          border: `1px solid ${error ? 'rgba(245,79,154,0.5)' : focused ? '#41cdcf' : 'rgba(26,26,46,0.1)'}`,
          color: '#1a1a2e',
          boxShadow: focused ? '0 0 0 3px rgba(65,205,207,0.08)' : 'none',
        }}
      />
      {error && (
        <p className="mt-1.5 text-[10px] font-medium tracking-[0.06em]"
          style={{ fontFamily: "'Jost', sans-serif", color: '#f54f9a' }}>
          {error}
        </p>
      )}
    </div>
  );
};

/* ── Section card ── */
const Card = ({ children, accent = '#41cdcf' }: { children: React.ReactNode; accent?: string }) => (
  <div className="relative overflow-hidden bg-white"
    style={{ border: '1px solid rgba(26,26,46,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
    <div className="absolute top-0 left-0 right-0 h-[2px]"
      style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    <div className="p-6 md:p-8">{children}</div>
  </div>
);

/* ── Section heading ── */
const CardTitle = ({ icon: Icon, title, accent = '#41cdcf' }: { icon: React.ElementType; title: string; accent?: string }) => (
  <div className="flex items-center gap-3 mb-7">
    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
      style={{ background: `rgba(${accent === '#41cdcf' ? '65,205,207' : '245,79,154'},0.1)`, border: `1px solid rgba(${accent === '#41cdcf' ? '65,205,207' : '245,79,154'},0.25)` }}>
      <Icon size={16} style={{ color: accent }} />
    </div>
    <h3 className="text-[17px] font-light text-[#1a1a2e]"
      style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.02em' }}>
      {title}
    </h3>
  </div>
);

const CheckoutPage: React.FC = () => {
  const { cartItems, cartCount, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '', lastName: '', email: '', phone: '',
    shippingAddress: '', shippingCity: '', shippingPostalCode: '',
    paymentMethod: 'cash_on_delivery',
    orderNotes: ''
  });

  const subtotal = getCartTotal();
  
  // Calculate dynamic shipping cost
  let shippingCost = 35; // Default elsewhere
  const city = formData.shippingCity.toLowerCase();
  const address = formData.shippingAddress.toLowerCase();
  
  if (address.includes('maarif') || address.includes('bourgogne') || city.includes('maarif') || city.includes('bourgogne')) {
    shippingCost = 0;
  } else if (city.includes('casablanca') || city === 'casa') {
    shippingCost = 20;
  }

  const tax = subtotal * 0.20;
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutForm]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<CheckoutForm> = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
      if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
      if (!formData.email.trim()) newErrors.email = 'Email requis';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide';
      if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
      if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'Adresse requise';
      if (!formData.shippingCity.trim()) newErrors.shippingCity = 'Ville requise';
      if (!formData.shippingPostalCode.trim()) newErrors.shippingPostalCode = 'Code postal requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitOrder = async () => {
    try {
      if (!isAuthenticated) return false;

      // 1. Create the order in our backend
      const res = await axios.post('/api/orders', {
        shipping_address: {
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone, address: formData.shippingAddress, city: formData.shippingCity,
        },
        payment_method: formData.paymentMethod,
        order_notes: formData.orderNotes,
        subtotal, shipping_cost: shippingCost, tax, total,
      });

      if (res.status !== 200 && res.status !== 201) return false;

      // 2a. Cash on delivery – done
      if (formData.paymentMethod === 'cash_on_delivery') {
        setTimeout(() => clearCart(), 5000);
        return true;
      }

      // 2b. Card – redirect to CMI
      const orderId = res.data.order_id;
      const cmiRes = await axios.post('/api/payment/cmi/initiate', { order_id: orderId });
      const { gateway_url, params } = cmiRes.data;

      // Build and auto-submit a hidden form to CMI
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = gateway_url;
      Object.entries(params as Record<string, string>).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();

      return 'cmi_redirect'; // sentinel – don't advance step locally
    } catch { return false; }
  };

  const handleNextStep = () => { if (validateStep(currentStep)) setCurrentStep(p => p + 1); };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setIsProcessing(true);
    const result = await submitOrder();
    if (result === true) setCurrentStep(3);
    // if result === 'cmi_redirect', the page will navigate away – nothing to do
    if (!result) setIsProcessing(false);
  };

  /* ── EMPTY CART ── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6 pt-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#41cdcf]/[0.05] blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#f54f9a]/[0.05] blur-[80px]" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-8"
            style={{ border: '1px solid rgba(65,205,207,0.3)', background: 'rgba(65,205,207,0.06)' }}>
            <ShoppingBag size={32} style={{ color: 'rgba(26,26,46,0.25)' }} />
          </div>
          <h2 className="text-3xl font-light text-[#1a1a2e] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Votre panier est vide
          </h2>
          <p className="text-[12.5px] font-light text-[#1a1a2e]/40 mb-8 leading-relaxed"
            style={{ fontFamily: "'Jost', sans-serif" }}>
            Ajoutez des articles à votre panier avant de procéder au paiement.
          </p>
          <Link href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300"
            style={{ fontFamily: "'Jost', sans-serif", background: 'linear-gradient(135deg, #f54f9a, #d4326e)', textDecoration: 'none', boxShadow: '0 8px 24px rgba(245,79,154,0.28)' }}>
            Découvrir nos produits <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  /* ── SUCCESS ── */
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6 pt-32 pb-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#41cdcf]/[0.05] blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#f54f9a]/[0.05] blur-[80px]" />
        </div>
        <div className="relative z-10 text-center max-w-lg w-full">
          {/* Animated check */}
          <div className="relative w-24 h-24 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full animate-ping opacity-10"
              style={{ background: 'linear-gradient(135deg, #41cdcf, #f54f9a)' }} />
            <div className="relative w-24 h-24 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #41cdcf, #2aabb0)', boxShadow: '0 16px 48px rgba(65,205,207,0.35)' }}>
              <CheckCircle size={40} color="#fff" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
            <span className="text-[9.5px] font-semibold tracking-[0.4em] uppercase text-[#41cdcf]"
              style={{ fontFamily: "'Jost', sans-serif" }}>
              Commande confirmée
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#41cdcf]" />
          </div>

          <h2 className="text-[38px] md:text-[48px] font-light text-[#1a1a2e] mb-3 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Merci pour votre{' '}
            <em className="not-italic" style={{
              background: 'linear-gradient(110deg, #f54f9a, #41cdcf)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>commande !</em>
          </h2>
          <p className="text-[13px] font-light text-[#1a1a2e]/42 mb-10 leading-[1.8]"
            style={{ fontFamily: "'Jost', sans-serif" }}>
            Vous recevrez un email de confirmation sous peu.
          </p>

          {/* Summary card */}
          <div className="relative overflow-hidden bg-white mb-8 text-left"
            style={{ border: '1px solid rgba(26,26,46,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, #41cdcf, #f54f9a)' }} />
            <div className="p-6 space-y-3">
              {[
                { icon: User, label: 'Nom', value: `${formData.firstName} ${formData.lastName}` },
                { icon: Mail, label: 'Email', value: formData.email },
                { icon: MapPin, label: 'Ville', value: formData.shippingCity },
                { icon: Banknote, label: 'Paiement', value: formData.paymentMethod === 'card' ? 'Carte bancaire' : 'À la livraison' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={14} style={{ color: 'rgba(26,26,46,0.3)', flexShrink: 0 }} />
                  <span className="text-[11px] font-medium text-[#1a1a2e]/45 tracking-[0.08em] w-20 flex-shrink-0"
                    style={{ fontFamily: "'Jost', sans-serif" }}>{label}</span>
                  <span className="text-[12px] font-light text-[#1a1a2e]"
                    style={{ fontFamily: "'Jost', sans-serif" }}>{value}</span>
                </div>
              ))}
              <div className="pt-3 mt-1 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}>
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#1a1a2e]/50"
                  style={{ fontFamily: "'Jost', sans-serif" }}>Total payé</span>
                <span className="text-[18px] font-light text-[#1a1a2e]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {total.toFixed(2)} <span className="text-[12px]">د.م</span>
                </span>
              </div>
            </div>
          </div>

          <Link href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300"
            style={{ fontFamily: "'Jost', sans-serif", background: 'linear-gradient(135deg, #f54f9a, #d4326e)', textDecoration: 'none', boxShadow: '0 8px 24px rgba(245,79,154,0.28)' }}>
            Continuer mes achats <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  /* ── MAIN CHECKOUT ── */
  return (
    <div className="min-h-screen bg-[#faf8f5] pt-36 pb-24 relative overflow-hidden">

      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#41cdcf]/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-[#f54f9a]/[0.04] blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(rgba(26,26,46,0.8) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 lg:px-10">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/cart"
            className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-300 group"
            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.45)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f54f9a')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,46,0.45)')}>
            <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Retour au panier
          </Link>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
              <span className="text-[9px] font-semibold tracking-[0.4em] uppercase text-[#1a1a2e]/35"
                style={{ fontFamily: "'Jost', sans-serif" }}>Finalisation</span>
              <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#41cdcf]" />
            </div>
            <h1 className="text-[28px] md:text-[36px] font-light text-[#1a1a2e]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Votre{' '}
              <em className="not-italic" style={{
                background: 'linear-gradient(110deg, #f54f9a, #41cdcf)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>commande</em>
            </h1>
          </div>
          <div className="w-[120px]" /> {/* spacer */}
        </div>

        {/* ── Progress stepper ── */}
        <div className="flex items-center justify-center mb-14">
          {[
            { n: 1, label: 'Livraison', icon: Truck },
            { n: 2, label: 'Paiement', icon: CreditCard },
          ].map(({ n, label, icon: Icon }, i) => (
            <React.Fragment key={n}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-11 h-11 flex items-center justify-center transition-all duration-400"
                  style={{
                    background: currentStep >= n
                      ? 'linear-gradient(135deg, #f54f9a, #d4326e)'
                      : 'rgba(26,26,46,0.05)',
                    border: currentStep >= n
                      ? 'none'
                      : '1px solid rgba(26,26,46,0.12)',
                    boxShadow: currentStep >= n ? '0 8px 20px rgba(245,79,154,0.3)' : 'none',
                  }}
                >
                  <Icon size={18} style={{ color: currentStep >= n ? '#fff' : 'rgba(26,26,46,0.3)' }} />
                </div>
                <span
                  className="text-[9.5px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    color: currentStep >= n ? '#f54f9a' : 'rgba(26,26,46,0.3)',
                  }}
                >
                  {label}
                </span>
              </div>
              {i === 0 && (
                <div className="w-24 md:w-40 h-px mx-4 mb-5 relative overflow-hidden"
                  style={{ background: 'rgba(26,26,46,0.08)' }}>
                  <div className="absolute left-0 top-0 h-full transition-all duration-600"
                    style={{
                      width: currentStep >= 2 ? '100%' : '0%',
                      background: 'linear-gradient(90deg, #f54f9a, #41cdcf)',
                    }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Form area ── */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* STEP 1 */}
              {currentStep === 1 && (
                <>
                  <Card accent="#f54f9a">
                    <CardTitle icon={User} title="Informations personnelles" accent="#f54f9a" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Prénom" name="firstName" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} placeholder="Prénom" />
                      <Field label="Nom" name="lastName" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} placeholder="Nom" />
                      <Field label="Email" name="email" value={formData.email} onChange={handleInputChange} error={errors.email} type="email" placeholder="votre@email.com" />
                      <Field label="Téléphone" name="phone" value={formData.phone} onChange={handleInputChange} error={errors.phone} type="tel" placeholder="06 XX XX XX XX" />
                    </div>
                  </Card>

                  <Card accent="#41cdcf">
                    <CardTitle icon={MapPin} title="Adresse de livraison" accent="#41cdcf" />
                    <div className="space-y-5">
                      <Field label="Adresse" name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} error={errors.shippingAddress} placeholder="Rue, numéro…" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Ville" name="shippingCity" value={formData.shippingCity} onChange={handleInputChange} error={errors.shippingCity} placeholder="Casablanca" />
                        <Field label="Code Postal" name="shippingPostalCode" value={formData.shippingPostalCode} onChange={handleInputChange} error={errors.shippingPostalCode} placeholder="20000" />
                      </div>
                    </div>
                  </Card>

                  <div className="flex justify-end pt-2">
                    <button type="button" onClick={handleNextStep}
                      className="flex items-center gap-2 px-8 py-3.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300"
                      style={{ fontFamily: "'Jost', sans-serif", background: 'linear-gradient(135deg, #f54f9a, #d4326e)', boxShadow: '0 8px 24px rgba(245,79,154,0.28)' }}>
                      Continuer <ArrowRight size={13} />
                    </button>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <>
                  <Card accent="#f54f9a">
                    <CardTitle icon={CreditCard} title="Mode de paiement" accent="#f54f9a" />
                    <div className="space-y-3 mb-0">
                      {[
                        { id: 'cash_on_delivery', name: 'Paiement à la livraison', desc: 'Payez en espèces à la réception', icon: Banknote },
                        { id: 'card', name: 'Carte bancaire', desc: 'Visa, Mastercard, CMI', icon: CreditCard },
                      ].map(opt => {
                        const active = formData.paymentMethod === opt.id;
                        const rgb = active ? '245,79,154' : '26,26,46';
                        return (
                          <label key={opt.id}
                            className="flex items-center gap-4 p-4 cursor-pointer transition-all duration-300"
                            style={{
                              background: active ? 'rgba(245,79,154,0.04)' : 'rgba(26,26,46,0.02)',
                              border: `1px solid ${active ? 'rgba(245,79,154,0.3)' : 'rgba(26,26,46,0.08)'}`,
                            }}>
                            <input type="radio" name="paymentMethod" value={opt.id}
                              checked={active} onChange={handleInputChange}
                              className="hidden" />
                            <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all duration-300"
                              style={{
                                border: `2px solid ${active ? '#f54f9a' : 'rgba(26,26,46,0.2)'}`,
                                borderRadius: '50%',
                              }}>
                              {active && <div className="w-2 h-2 rounded-full" style={{ background: '#f54f9a' }} />}
                            </div>
                            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                              style={{ background: active ? 'rgba(245,79,154,0.1)' : 'rgba(26,26,46,0.04)' }}>
                              <opt.icon size={16} style={{ color: active ? '#f54f9a' : 'rgba(26,26,46,0.4)' }} />
                            </div>
                            <div className="flex-1">
                              <p className="text-[13px] font-medium text-[#1a1a2e]"
                                style={{ fontFamily: "'Jost', sans-serif" }}>{opt.name}</p>
                              <p className="text-[11px] font-light text-[#1a1a2e]/40"
                                style={{ fontFamily: "'Jost', sans-serif" }}>{opt.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* CMI redirect notice */}
                    {formData.paymentMethod === 'card' && (
                      <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}>
                        <div className="p-4 relative overflow-hidden"
                          style={{ background: 'rgba(245,79,154,0.04)', border: '1px solid rgba(245,79,154,0.2)' }}>
                          <div className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: 'linear-gradient(90deg, #f54f9a, transparent)' }} />
                          <div className="flex items-start gap-3">
                            <Lock size={16} style={{ color: '#f54f9a', flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <p className="text-[12px] font-medium text-[#1a1a2e] mb-1"
                                style={{ fontFamily: "'Jost', sans-serif" }}>Paiement sécurisé 3D Secure</p>
                              <p className="text-[11px] font-light leading-relaxed"
                                style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.5)' }}>
                                Vous serez redirigé vers la plateforme sécurisée{' '}
                                <strong style={{ color: '#f54f9a' }}>CMI</strong>{' '}
                                pour saisir vos informations bancaires en toute sécurité.
                                Visa, Mastercard, CMI acceptés.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cash info */}
                    {formData.paymentMethod === 'cash_on_delivery' && (
                      <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}>
                        <div className="p-4 relative overflow-hidden"
                          style={{ background: 'rgba(65,205,207,0.04)', border: '1px solid rgba(65,205,207,0.2)' }}>
                          <div className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: 'linear-gradient(90deg, #41cdcf, transparent)' }} />
                          <div className="flex items-start gap-3">
                            <Package size={16} style={{ color: '#41cdcf', flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <p className="text-[12px] font-medium text-[#1a1a2e] mb-1"
                                style={{ fontFamily: "'Jost', sans-serif" }}>Paiement à la livraison</p>
                              <p className="text-[11px] font-light leading-relaxed"
                                style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.5)' }}>
                                Préparez{' '}
                                <strong style={{ color: '#41cdcf' }}>{total.toFixed(2)} د.م</strong>
                                {' '}en espèces lors de la réception.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Notes */}
                  <Card accent="#41cdcf">
                    <CardTitle icon={Package} title="Notes de commande" accent="#41cdcf" />
                    <div>
                      <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase mb-2 text-[#1a1a2e]/45"
                        style={{ fontFamily: "'Jost', sans-serif" }}>
                        Instructions (optionnel)
                      </label>
                      <textarea name="orderNotes" value={formData.orderNotes} onChange={handleInputChange} rows={3}
                        placeholder="Instructions spéciales pour la livraison…"
                        className="w-full px-4 py-3 text-[13px] font-light outline-none resize-none transition-all duration-300"
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          background: 'rgba(26,26,46,0.02)',
                          border: '1px solid rgba(26,26,46,0.1)',
                          color: '#1a1a2e',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#41cdcf'; e.target.style.boxShadow = '0 0 0 3px rgba(65,205,207,0.08)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(26,26,46,0.1)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </Card>

                  <div className="flex justify-between items-center pt-2">
                    <button type="button" onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-2 px-6 py-3 text-[11px] font-medium tracking-[0.14em] uppercase transition-all duration-300"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        background: 'transparent', border: '1px solid rgba(26,26,46,0.15)',
                        color: 'rgba(26,26,46,0.55)', cursor: 'pointer',
                      }}>
                      <ArrowLeft size={13} /> Retour
                    </button>
                    <button type="submit" disabled={isProcessing}
                      className="flex items-center gap-2 px-8 py-3.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        background: isProcessing ? 'rgba(245,79,154,0.7)' : 'linear-gradient(135deg, #f54f9a, #d4326e)',
                        boxShadow: isProcessing ? 'none' : '0 8px 24px rgba(245,79,154,0.28)',
                        border: 'none', cursor: isProcessing ? 'wait' : 'pointer',
                      }}>
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 11-6.219-8.56" />
                          </svg>
                          Traitement…
                        </>
                      ) : (
                        <>
                          <Lock size={13} />
                          Confirmer la commande
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* ── Order summary ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="relative overflow-hidden bg-white"
                style={{ border: '1px solid rgba(26,26,46,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, #f54f9a, #41cdcf)' }} />

                <div className="p-6 md:p-7">
                  <div className="flex items-center gap-3 mb-6"
                    style={{ borderBottom: '1px solid rgba(26,26,46,0.06)', paddingBottom: '18px' }}>
                    <div className="w-7 h-px bg-[#f54f9a]" />
                    <h3 className="text-[16px] font-light text-[#1a1a2e]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Récapitulatif
                    </h3>
                    <span className="ml-auto text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-0.5"
                      style={{ fontFamily: "'Jost', sans-serif", background: 'rgba(65,205,207,0.08)', border: '1px solid rgba(65,205,207,0.2)', color: '#41cdcf' }}>
                      {cartCount} article{cartCount > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-4 mb-6 max-h-56 overflow-y-auto pr-1"
                    style={{ scrollbarWidth: 'thin' }}>
                    {cartItems.map((item: CartItem) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 flex-shrink-0 overflow-hidden bg-[#f7f5f2]"
                          style={{ border: '1px solid rgba(26,26,46,0.06)' }}>
                          <img src={getProductImageUrl(item.image_url)} alt={item.name}
                            className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-[#1a1a2e] truncate"
                            style={{ fontFamily: "'Jost', sans-serif" }}>{item.name}</p>
                          <p className="text-[10px] text-[#1a1a2e]/35 mt-0.5"
                            style={{ fontFamily: "'Jost', sans-serif" }}>Qté : {item.quantity}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-[13px] font-semibold text-[#1a1a2e]"
                            style={{ fontFamily: "'Jost', sans-serif" }}>
                            {(item.price * item.quantity).toFixed(2)} <span className="text-[9px] font-normal">د.م</span>
                          </p>
                          {item.discounted_price && item.discounted_price > 0 && item.original_price > item.discounted_price && (
                            <p className="text-[10px] text-[#1a1a2e]/28 line-through"
                              style={{ fontFamily: "'Jost', sans-serif" }}>
                              {(item.original_price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 pt-5" style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}>
                    {[
                      { label: `Sous-total (${cartCount} articles)`, value: `${subtotal.toFixed(2)} د.م` },
                      { label: 'Livraison', value: shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} د.م` },
                      { label: 'TVA (20%)', value: `${tax.toFixed(2)} د.م` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-baseline">
                        <span className="text-[11.5px] font-light text-[#1a1a2e]/45"
                          style={{ fontFamily: "'Jost', sans-serif" }}>{label}</span>
                        <span className="text-[12px] font-medium text-[#1a1a2e]"
                          style={{ fontFamily: "'Jost', sans-serif" }}>{value}</span>
                      </div>
                    ))}

                    <div className="flex justify-between items-baseline pt-4 mt-2"
                      style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}>
                      <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#1a1a2e]/55"
                        style={{ fontFamily: "'Jost', sans-serif" }}>Total</span>
                      <span className="text-[24px] font-light text-[#1a1a2e]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {total.toFixed(2)}{' '}
                        <span className="text-[14px]">د.م</span>
                      </span>
                    </div>

                    {formData.paymentMethod === 'cash_on_delivery' && (
                      <div className="mt-2 p-3 relative overflow-hidden"
                        style={{ background: 'rgba(65,205,207,0.05)', border: '1px solid rgba(65,205,207,0.18)' }}>
                        <div className="absolute top-0 left-0 right-0 h-px"
                          style={{ background: 'linear-gradient(90deg, #41cdcf, transparent)' }} />
                        <p className="text-[11px] text-center font-light leading-relaxed"
                          style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.55)' }}>
                          Préparez <strong style={{ color: '#41cdcf' }}>{total.toFixed(2)} د.م</strong> en espèces
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Security */}
                  <div className="flex items-center justify-center gap-2 mt-6 pt-5"
                    style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}>
                    <Shield size={13} style={{ color: 'rgba(26,26,46,0.25)' }} />
                    <span className="text-[10px] font-light tracking-[0.1em] text-[#1a1a2e]/35"
                      style={{ fontFamily: "'Jost', sans-serif" }}>
                      Paiement 100% sécurisé
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
};

export default CheckoutPage;
"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Facebook, Twitter, ShieldCheck, Sparkles, Heart } from 'lucide-react';

const AboutUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <main className="bg-[#FAF9F7] min-h-screen pt-24 lg:pt-32 pb-0 overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative py-20 lg:py-32 px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-[#FAF9F7] z-10" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#41cdcf]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f54f9a]/5 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="max-w-screen-xl mx-auto relative z-20 text-center">
          <div className="inline-flex items-center gap-4 mb-6 animate-[slideUp_0.8s_ease-out]">
            <div className="h-[1px] w-12 bg-gradient-to-r from-[#f54f9a] to-transparent" />
            <span className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#f54f9a]">L&apos;Excellence Jamali</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-[#41cdcf] to-transparent" />
          </div>
          <h1 className="logo-font text-5xl lg:text-7xl font-light text-[#1a1a2e] mb-8 animate-[slideUp_0.9s_ease-out_0.1s_both]">
            À Propos de <span className="italic">Nous</span>
          </h1>
          <p className="navbar-font text-sm lg:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed animate-[slideUp_1s_ease-out_0.2s_both]">
            Depuis notre création, Jamali Express s&apos;engage à redéfinir les standards de la beauté et du bien-être, 
            en sélectionnant avec soin des produits d&apos;exception pour sublimer votre quotidien.
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative group animate-[fadeIn_1.2s_ease-out]">
            <div className="aspect-[4/5] overflow-hidden rounded-sm relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80" 
                alt="Notre Histoire" 
                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#41cdcf]/20 -z-0 translate-x-3 translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
            
            <div className="absolute -top-10 -left-10 z-20 hidden lg:block">
              <div className="bg-white p-8 shadow-2xl rounded-sm">
                <span className="logo-font text-4xl block text-[#41cdcf]">12+</span>
                <span className="navbar-font text-[9px] uppercase tracking-widest text-gray-400">Années d&apos;Expérience</span>
              </div>
            </div>
          </div>

          <div className="animate-[slideUp_1s_ease-out]">
            <span className="navbar-font text-[10px] uppercase tracking-[0.3em] text-[#41cdcf] font-bold block mb-4">Notre Mission</span>
            <h2 className="logo-font text-4xl lg:text-5xl text-[#1a1a2e] mb-8">L&apos;Art de la Beauté <br /><span className="italic text-[#f54f9a]">Authentique</span></h2>
            <div className="space-y-6 text-gray-500 navbar-font text-sm leading-relaxed">
              <p>
                Jamali Express est né d&apos;une passion pour l&apos;excellence et d&apos;un désir profond de rendre accessible la haute cosmétique. 
                Nous ne nous contentons pas de vendre des produits ; nous vous accompagnons dans votre rituel de beauté personnel.
              </p>
              <p>
                Chaque marque présente dans notre boutique est scrupuleusement analysée. Nous privilégions l&apos;innovation, 
                la qualité des ingrédients et l&apos;éthique de production pour vous garantir des résultats visibles et durables.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="logo-font text-xl text-[#1a1a2e] mb-2">Sourcing Direct</h4>
                  <p className="text-xs">Authenticité garantie sur 100% de nos références.</p>
                </div>
                <div>
                  <h4 className="logo-font text-xl text-[#1a1a2e] mb-2">Conseil Expert</h4>
                  <p className="text-xs">Une équipe de spécialistes à votre écoute au quotidien.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-[#FAF9F7]">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="logo-font text-4xl text-[#1a1a2e]">Nos Valeurs Fondamentales</h2>
            <div className="w-12 h-[1px] bg-[#41cdcf] mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck className="text-[#41cdcf]" />, title: "Qualité Absolue", desc: "Nous ne transigeons jamais sur la qualité. Chaque produit est testé et approuvé." },
              { icon: <Sparkles className="text-[#f54f9a]" />, title: "Innovation", desc: "Toujours à la pointe des nouvelles tendances et technologies cosmétiques." },
              { icon: <Heart className="text-[#41cdcf]" />, title: "Engagement Client", desc: "Votre satisfaction est notre priorité absolue, de la commande à la livraison." }
            ].map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 group border-b-2 border-transparent hover:border-[#41cdcf]">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {v.icon}
                </div>
                <h3 className="logo-font text-2xl text-[#1a1a2e] mb-4">{v.title}</h3>
                <p className="navbar-font text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section id="contact" className="py-24 lg:py-32 relative">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-16 lg:items-start">
            
            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <span className="navbar-font text-[10px] uppercase tracking-[0.3em] text-[#f54f9a] font-bold block mb-4">Contactez-nous</span>
                <h2 className="logo-font text-5xl text-[#1a1a2e] mb-6">Parlons de votre <span className="italic underline decoration-[#41cdcf]/30">Beauté</span></h2>
                <p className="navbar-font text-sm text-gray-500 leading-relaxed max-w-md">
                  Notre équipe est là pour répondre à toutes vos questions. Que ce soit pour un conseil personnalisé ou un suivi de commande.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: <Phone size={20} />, label: "Téléphone", value: "+212 665474087", sub: "Lun-Ven: 9h - 19h" },
                  { icon: <Mail size={20} />, label: "Email", value: "contact@jamaliexpress.com", sub: "Réponse sous 24h" },
                  { icon: <MapPin size={20} />, label: "Adresse", value: "Casablanca, Maroc", sub: "Bureau Central" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 bg-white shadow-md flex items-center justify-center rounded-full text-[#41cdcf] group-hover:bg-[#41cdcf] group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <span className="navbar-font text-[9px] uppercase tracking-widest text-gray-400 block mb-1">{item.label}</span>
                      <p className="navbar-font text-sm font-medium text-[#1a1a2e]">{item.value}</p>
                      <p className="navbar-font text-[10px] text-gray-400 mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <span className="navbar-font text-[9px] uppercase tracking-widest text-gray-400 block mb-4">Suivez-nous</span>
                <div className="flex gap-4">
                  {[
                    { Icon: Instagram, href: "https://www.instagram.com/jamali_express/" },
                    { Icon: Facebook, href: "https://web.facebook.com/para.jamaliexpress?locale=fr_FR" },
                    { 
                      Icon: () => (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
                        </svg>
                      ), 
                      href: "https://www.tiktok.com/@jamali_express" 
                    }
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 border border-gray-100 flex items-center justify-center rounded-full text-gray-500 hover:text-[#f54f9a] hover:border-[#f54f9a] transition-all"
                    >
                      <social.Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 lg:p-12 shadow-2xl rounded-sm relative">
                <div className="absolute top-0 right-0 p-8 text-[#41cdcf]/10">
                  <MessageSquare size={120} />
                </div>
                
                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="navbar-font text-[10px] uppercase font-bold tracking-widest text-[#1a1a2e]">Nom Complet</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#FAF9F7] border-none text-gray-800 px-4 py-4 text-sm focus:ring-1 focus:ring-[#41cdcf] transition-all outline-none" 
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="navbar-font text-[10px] uppercase font-bold tracking-widest text-[#1a1a2e]">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#FAF9F7] border-none text-gray-800 px-4 py-4 text-sm focus:ring-1 focus:ring-[#41cdcf] transition-all outline-none" 
                        placeholder="jean@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="navbar-font text-[10px] uppercase font-bold tracking-widest text-[#1a1a2e]">Sujet</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#FAF9F7] border-none text-gray-800 px-4 py-4 text-sm focus:ring-1 focus:ring-[#41cdcf] transition-all outline-none" 
                      placeholder="Comment pouvons-nous vous aider ?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="navbar-font text-[10px] uppercase font-bold tracking-widest text-[#1a1a2e]">Votre Message</label>
                    <textarea 
                      rows={6} 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#FAF9F7] border-none text-gray-800 px-4 py-4 text-sm focus:ring-1 focus:ring-[#41cdcf] transition-all outline-none resize-none" 
                      placeholder="Racontez-nous tout..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#1a1a2e] text-white navbar-font text-[11px] font-bold uppercase tracking-[0.2em] py-5 px-8 flex items-center justify-center gap-3 hover:bg-[#41cdcf] transition-all duration-500 shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le Message"}
                    {!isSubmitting && <Send size={14} />}
                  </button>

                  {submitted && (
                    <div className="bg-[#41cdcf]/10 text-[#41cdcf] p-4 text-center navbar-font text-xs font-medium rounded-sm animate-[fadeIn_0.5s_ease-out]">
                      Merci ! Votre message a été envoyé avec succès. Nous vous répondrons très prochainement.
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-[#1a1a2e] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#41cdcf]/10 rounded-full blur-[100px]" />
        <div className="max-w-screen-xl mx-auto px-4 text-center relative z-10">
          <h2 className="logo-font text-3xl lg:text-4xl mb-8">Découvrez notre collection <span className="italic text-[#41cdcf]">exclusive</span></h2>
          <a href="/products" className="inline-block border-b-2 border-[#f54f9a] pb-2 navbar-font text-sm uppercase tracking-widest font-bold text-white hover:text-[#f54f9a] transition-all">
            Explorer la boutique
          </a>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
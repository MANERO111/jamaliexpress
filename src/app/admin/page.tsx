'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Package, ShoppingCart, Users, CreditCard, Settings,
  Home, Tag
} from 'lucide-react';
import AdminContent from './AdminContent';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: Home },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'categories', label: 'Catégories', icon: Tag },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'inventory', label: 'Inventaire', icon: Package },
    // { id: 'payments', label: 'Paiements', icon: CreditCard },
    // { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="flex h-screen mt-30 bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin jamali Express</h1>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-red-50 text-red-600 border-r-2 border-red-600' : 'text-gray-700'
                }`}
              >
                <IconComponent size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <AdminContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
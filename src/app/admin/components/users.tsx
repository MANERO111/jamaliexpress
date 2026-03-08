'use client';
import React from 'react';
import { Search, Plus, Users, Shield, UserCheck, UserX, Eye, Edit, Trash2 } from 'lucide-react';

import { User } from '@/types/admin';

interface UsersComponentProps {
  users: User[];
  getStatusColor: (status: string) => string;
  openModal: (type: string, item?: User | null) => void;
  deleteUser: (id: number) => Promise<void>;
}

const UsersComponent: React.FC<UsersComponentProps> = ({
  users,
  getStatusColor,
  openModal,
  deleteUser // Add this parameter
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUsers = (users || []).filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(term) ||
      (user.email || '').toLowerCase().includes(term) ||
      user.id.toString().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full md:w-64 text-gray-900"
            />
          </div>

          <button 
            onClick={() => openModal('user')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <Plus size={20} />
            <span>Nouvel Utilisateur</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.role === 'admin' ? <Shield size={12} className="mr-1" /> : <Users size={12} className="mr-1" />}
                    {user.role || 'customer'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.orders_count || user.orders?.length || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status || 'active')}`}>
                    {user.status === 'active' ? <UserCheck size={12} className="mr-1" /> : <UserX size={12} className="mr-1" />}
                    {user.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* <button 
                      className="text-blue-600 hover:text-blue-900"
                      title="Voir les détails"
                    >
                      <Eye size={16} />
                    </button> */}
                    <button 
                      onClick={() => openModal('user', user)}
                      className="text-green-600 hover:text-green-900"
                      title="Modifier l'utilisateur"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`)) {
                          deleteUser(user.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer l'utilisateur"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      {searchTerm ? 'Aucun résultat trouvé' : 'Aucun utilisateur'}
                    </p>
                    <p className="text-sm">
                      {searchTerm ? 'Modifiez vos critères de recherche.' : 'Commencez par créer votre premier utilisateur.'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersComponent;
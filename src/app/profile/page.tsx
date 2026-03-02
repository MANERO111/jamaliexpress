'use client';
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Save, Edit3, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import axios from 'axios';

interface UserData {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Remove any authorization headers - we're using cookies only
      delete api.defaults.headers.common['Authorization'];
      
      // Try to get user data using cookies
      const response = await api.get('/api/user');
      
      if (response.data) {
        const userData = response.data;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || ''
        });
      }
    } catch (error: unknown) {
      console.error('Failed to fetch user data:', error);
      
      // If unauthorized, redirect to home (user not logged in)
      if (axios.isAxiosError(error) && error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('User not authenticated, redirecting to home');
        window.location.href = '/';
        return;
      }
      
      // For other errors, also redirect but log the error
      console.error('Unexpected error:', error);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Get CSRF token first (important for POST/PUT requests)
      await api.get('/sanctum/csrf-cookie');
      
      // Wait a moment for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 300));

      const response = await api.put('/api/user/update', formData);

      if (response.data) {
        setUser(response.data.user || { ...user, ...formData });
        setIsEditing(false);
        setSuccessMessage('Profil mis à jour avec succès!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('Update failed:', error);
      
      // Handle authentication errors
      if (axios.isAxiosError(error) && error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('Authentication expired, redirecting to home');
        window.location.href = '/';
        return;
      }
      
      // Handle validation errors
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setErrors(error.response.data.errors || { general: error.response.data.message || 'Erreur lors de la mise à jour' });
      } else {
        setErrors({ general: 'Erreur de connexion' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    // Client-side validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrors({ newPassword: 'Le mot de passe doit contenir au moins 8 caractères' });
      setLoading(false);
      return;
    }

    try {
      // Get CSRF token first
      await api.get('/sanctum/csrf-cookie');
      
      // Wait a moment for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 300));

      const response = await api.put('/api/user/change-password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword
      });

      if (response.data) {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSuccessMessage('Mot de passe modifié avec succès!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('Password change failed:', error);
      
      // Handle authentication errors
      if (axios.isAxiosError(error) && error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('Authentication expired, redirecting to home');
        window.location.href = '/';
        return;
      }
      
      // Handle validation errors
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setErrors(error.response.data.errors || { general: error.response.data.message || 'Erreur lors du changement de mot de passe' });
      } else {
        setErrors({ general: 'Erreur de connexion' });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGoBack = () => {
    // Use proper navigation instead of window.history.back()
    window.location.href = '/';
  };

  // Show loading screen while fetching user data
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  // If no user data after loading, redirect (this shouldn't normally show)
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">Redirection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 mb-4 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            Mon Profil
          </h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg shadow-sm p-8 border border-gray-200">
              <div className="text-center">
                <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">{user?.name || 'Utilisateur'}</h2>
                <p className="text-gray-600 mb-4">{user?.email || 'Email non disponible'}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>Membre depuis: {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-teal-50 border border-teal-200 text-teal-700 px-6 py-4 rounded-lg animate-in slide-in-from-top-2">
                {successMessage}
              </div>
            )}

            {/* Profile Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-light text-gray-900">Informations Personnelles</h3>
                  <button
                    onClick={() => {
                      setIsEditing(!isEditing);
                      if (isEditing) {
                        // Reset form data when canceling
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || ''
                        });
                        setErrors({});
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded transition-all duration-200"
                  >
                    <Edit3 size={16} />
                    <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500 transition-all duration-300 text-gray-700 ${
                          !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                        } ${errors.name ? 'border-red-300' : ''}`}
                        required={isEditing}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500 transition-all duration-300 text-gray-700 ${
                          !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                        } ${errors.email ? 'border-red-300' : ''}`}
                        required={isEditing}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                      {errors.general}
                    </div>
                  )}

                  {/* Save Button */}
                  {isEditing && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sauvegarde...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          <span>Sauvegarder les modifications</span>
                        </>
                      )}
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Password Change Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-44">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-light text-gray-900">Sécurité</h3>
                  <button
                    onClick={() => {
                      setIsChangingPassword(!isChangingPassword);
                      if (isChangingPassword) {
                        // Reset password form when canceling
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setErrors({});
                        setShowPasswords({ current: false, new: false, confirm: false });
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded transition-all duration-200"
                  >
                    <Lock size={16} />
                    <span>{isChangingPassword ? 'Annuler' : 'Changer mot de passe'}</span>
                  </button>
                </div>

                {isChangingPassword && (
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordInputChange}
                          className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500 transition-all duration-300 text-gray-700 ${errors.currentPassword || errors.current_password ? 'border-red-300' : ''}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {(errors.currentPassword || errors.current_password) && (
                        <p className="text-red-600 text-sm mt-1">{errors.currentPassword || errors.current_password}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordInputChange}
                          className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500 transition-all duration-300 text-gray-700 ${errors.newPassword || errors.new_password ? 'border-red-300' : ''}`}
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {(errors.newPassword || errors.new_password) && (
                        <p className="text-red-600 text-sm mt-1">{errors.newPassword || errors.new_password}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-1">Le mot de passe doit contenir au moins 8 caractères</p>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordInputChange}
                          className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500 transition-all duration-300 text-gray-700 ${errors.confirmPassword ? 'border-red-300' : ''}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {errors.general && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                        {errors.general}
                      </div>
                    )}

                    {/* Save Password Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Changement...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={20} />
                          <span>Changer le mot de passe</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {!isChangingPassword && (
                  <p className="text-gray-600">
                    Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe régulièrement.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
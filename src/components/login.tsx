'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import axios from '@/lib/axios';

// Define the props interface
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: { name: string; [key: string]: unknown }) => void;
}

// Define error response type
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      // Get CSRF cookie first
      await axios.get('/sanctum/csrf-cookie');
      
      // Wait a moment to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 500));
    
      // Login request - cookies will handle authentication
      await axios.post('/api/login', { email, password });

      // Get user data
      const res = await axios.get('/api/user');
      
      // Call the success callback with user data only (no token)
      if (onLoginSuccess) {
        onLoginSuccess(res.data);
      }
      
      alert(`Welcome back ${res.data.name}!`);
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Login error:', err);
      setError(apiError.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      // Get CSRF cookie first
      await axios.get('/sanctum/csrf-cookie');
      
      // Wait to ensure cookie is properly set in browser
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Register request - cookies will handle authentication
      await axios.post('/api/register', {
        name,
        email,
        password,
        password_confirmation: password,
      });
      
      // After successful registration, get user data
      const userResponse = await axios.get('/api/user');
      
      // Call the success callback with user data only (no token)
      if (onLoginSuccess) {
        onLoginSuccess(userResponse.data);
      }
      
      alert('Registration successful!');
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Registration error:', err);
      setError(apiError.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (): void => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !loading && email && password && (!isRegisterMode || name)) {
      if (isRegisterMode) {
        handleRegister();
      } else {
        handleLogin();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setError('');
      setShowPassword(false);
      setIsRegisterMode(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-500 border border-gray-100"
        onKeyPress={handleKeyPress}
      >
        {/* Header */}
        <div className="relative p-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <User size={28} className="text-white" />
            </div>
            <h2 
              id="modal-title"
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              {isRegisterMode ? 'Créer un Compte' : 'Connexion'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isRegisterMode ? 'Rejoignez notre communauté Galby' : 'Connectez-vous à votre compte'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {/* Name Input - Only for Register */}
            <div className={`relative transition-all duration-500 ${
              isRegisterMode 
                ? 'opacity-100 transform translate-y-0 max-h-20' 
                : 'opacity-0 transform -translate-y-4 max-h-0 overflow-hidden'
            }`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-red-500" />
              </div>
              <input
                type="text"
                placeholder="Nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-500"
                aria-label="Nom complet"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-red-500" />
              </div>
              <input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-500"
                aria-label="Adresse email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-red-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-500"
                aria-label="Mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-red-500 hover:text-red-600 transition-colors duration-200"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={isRegisterMode ? handleRegister : handleLogin}
              disabled={loading || !email || !password || (isRegisterMode && !name)}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isRegisterMode ? 'Création du compte...' : 'Connexion...'}</span>
                </>
              ) : (
                <span>{isRegisterMode ? 'Créer un Compte' : 'Se Connecter'}</span>
              )}
            </button>

            {/* Forgot Password - Only for Login */}
            {!isRegisterMode && (
              <div className="text-center">
                <button 
                  type="button"
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-200 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-xl border-t border-gray-100">
          <p className="text-center text-sm text-gray-600">
            {isRegisterMode ? (
              <>
                Vous avez déjà un compte ?{' '}
                <button 
                  type="button"
                  onClick={switchMode}
                  className="text-red-500 hover:text-red-600 font-semibold transition-colors duration-200 hover:underline"
                >
                  Connectez-vous ici
                </button>
              </>
            ) : (
              <>
                Vous n&apos;avez pas de compte ?{' '}
                <button 
                  type="button"
                  onClick={switchMode}
                  className="text-red-500 hover:text-red-600 font-semibold transition-colors duration-200 hover:underline"
                >
                  Inscrivez-vous ici
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
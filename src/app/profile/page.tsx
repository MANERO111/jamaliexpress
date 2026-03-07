'use client';
import React, { useState, useEffect } from 'react';
import {
  User, Mail, Lock, Eye, EyeOff, Save, Edit3,
  ArrowLeft, CheckCircle, AlertCircle, Shield, Calendar, Sparkles
} from 'lucide-react';
import api from '@/lib/axios';
import axios from 'axios';

interface UserData { id: number; name: string; email: string; created_at: string; }

/* ── Styled field ── */
const Field = ({
  label, name, value, onChange, disabled, type = 'text',
  icon: Icon, error, hint, required = false,
  suffix
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean; type?: string; icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>;
  error?: string; hint?: string; required?: boolean;
  suffix?: React.ReactNode;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase mb-2"
        style={{ fontFamily: "'Jost', sans-serif", color: error ? '#f54f9a' : 'rgba(26,26,46,0.5)' }}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: focused && !disabled ? '#41cdcf' : 'rgba(26,26,46,0.25)' }}>
          <Icon size={15} />
        </div>
        <input
          type={type} name={name} value={value} onChange={onChange}
          disabled={disabled} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full pl-10 pr-4 py-3 text-[13px] font-light outline-none transition-all duration-300"
          style={{
            fontFamily: "'Jost', sans-serif",
            background: disabled ? 'rgba(26,26,46,0.02)' : focused ? '#fff' : 'rgba(26,26,46,0.02)',
            border: `1px solid ${error ? 'rgba(245,79,154,0.5)' : focused && !disabled ? '#41cdcf' : 'rgba(26,26,46,0.1)'}`,
            color: disabled ? 'rgba(26,26,46,0.45)' : '#1a1a2e',
            boxShadow: focused && !disabled ? '0 0 0 3px rgba(65,205,207,0.08)' : 'none',
            cursor: disabled ? 'default' : 'text',
            paddingRight: suffix ? '44px' : undefined,
          }}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-[10px] font-medium tracking-[0.06em]"
          style={{ fontFamily: "'Jost', sans-serif", color: '#f54f9a' }}>{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-[10px] font-light"
          style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.35)' }}>{hint}</p>
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

const CardTitle = ({ icon: Icon, title, accent = '#41cdcf', action }: {
  icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>; title: string; accent?: string; action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-7">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
        style={{ background: `rgba(${accent === '#41cdcf' ? '65,205,207' : '245,79,154'},0.1)`, border: `1px solid rgba(${accent === '#41cdcf' ? '65,205,207' : '245,79,154'},0.25)` }}>
        <Icon size={15} color={accent} />
      </div>
      <h3 className="text-[17px] font-light text-[#1a1a2e]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>{title}</h3>
    </div>
    {action}
  </div>
);

/* ── Toggle button ── */
const ToggleBtn = ({ isActive, onToggle, activeLabel, inactiveLabel }: {
  isActive: boolean; onToggle: () => void; activeLabel: string; inactiveLabel: string;
}) => (
  <button onClick={onToggle}
    className="flex items-center gap-2 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase transition-all duration-300"
    style={{
      fontFamily: "'Jost', sans-serif",
      background: isActive ? 'rgba(245,79,154,0.06)' : 'rgba(26,26,46,0.04)',
      border: `1px solid ${isActive ? 'rgba(245,79,154,0.3)' : 'rgba(26,26,46,0.1)'}`,
      color: isActive ? '#f54f9a' : 'rgba(26,26,46,0.5)',
      cursor: 'pointer',
    }}>
    <Edit3 size={11} />
    {isActive ? activeLabel : inactiveLabel}
  </button>
);

const ProfilePage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchUser(); }, []);

  const fetchUser = async () => {
    try {
      delete api.defaults.headers.common['Authorization'];
      const res = await api.get('/api/user');
      if (res.data) {
        setUser(res.data);
        setFormData({ name: res.data.name || '', email: res.data.email || '' });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status || 0)) {
        window.location.href = '/';
      }
    } finally { setLoading(false); }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3500);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErrors({});
    try {
      await api.get('/sanctum/csrf-cookie');
      await new Promise(r => setTimeout(r, 300));
      const res = await api.put('/api/user/update', formData);
      if (res.data) {
        setUser(res.data.user || { ...user, ...formData } as UserData);
        setIsEditing(false);
        showSuccess('Profil mis à jour avec succès !');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if ([401, 403].includes(err.response?.status || 0)) { window.location.href = '/'; return; }
        setErrors(err.response?.data?.errors || { general: err.response?.data?.message || 'Erreur de mise à jour' });
      } else setErrors({ general: 'Erreur de connexion' });
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' }); return;
    }
    if (passwordData.newPassword.length < 8) {
      setErrors({ newPassword: 'Au moins 8 caractères requis' }); return;
    }
    setSaving(true); setErrors({});
    try {
      await api.get('/sanctum/csrf-cookie');
      await new Promise(r => setTimeout(r, 300));
      await api.post('/api/user/change-password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword,
      });
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPwd({ current: false, new: false, confirm: false });
      showSuccess('Mot de passe modifié avec succès !');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if ([401, 403].includes(err.response?.status || 0)) { window.location.href = '/'; return; }
        setErrors(err.response?.data?.errors || { general: err.response?.data?.message || 'Erreur' });
      } else setErrors({ general: 'Erreur de connexion' });
    } finally { setSaving(false); }
  };

  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const onPwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'JE';
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    : '—';

  /* ── Loading ── */
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full animate-ping opacity-15"
              style={{ background: 'linear-gradient(135deg, #f54f9a, #41cdcf)' }} />
            <div className="absolute inset-2 rounded-full animate-pulse"
              style={{ background: 'linear-gradient(135deg, #f54f9a, #41cdcf)' }} />
          </div>
          <p className="text-[12px] font-light tracking-[0.18em] uppercase text-[#1a1a2e]/35"
            style={{ fontFamily: "'Jost', sans-serif" }}>
            Chargement…
          </p>
        </div>
        <style>{fonts}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-40 pb-24 relative overflow-hidden">

      {/* ── Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#f54f9a]/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-[#41cdcf]/[0.04] blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(rgba(26,26,46,0.8) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-4 md:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-300 group"
            style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f54f9a')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,46,0.4)')}>
            <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Retour
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#f54f9a]" />
              <span className="text-[9px] font-semibold tracking-[0.4em] uppercase text-[#1a1a2e]/30"
                style={{ fontFamily: "'Jost', sans-serif" }}>Mon compte</span>
              <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#41cdcf]" />
            </div>
            <h1 className="text-[28px] md:text-[36px] font-light text-[#1a1a2e]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Mon{' '}
              <em className="not-italic" style={{
                background: 'linear-gradient(110deg, #f54f9a, #41cdcf)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>profil</em>
            </h1>
          </div>
          <div className="w-[110px]" />
        </div>

        {/* ── Success toast ── */}
        {success && (
          <div className="relative overflow-hidden mb-6 p-4 transition-all duration-400"
            style={{ background: 'rgba(65,205,207,0.06)', border: '1px solid rgba(65,205,207,0.25)' }}>
            <div className="absolute top-0 left-0 right-0 h-[1.5px]"
              style={{ background: 'linear-gradient(90deg, #41cdcf, transparent)' }} />
            <div className="flex items-center gap-3">
              <Sparkles size={15} style={{ color: '#41cdcf', flexShrink: 0 }} />
              <p className="text-[12px] font-medium text-[#1a1a2e]"
                style={{ fontFamily: "'Jost', sans-serif" }}>{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Left: avatar card ── */}
          <div className="lg:col-span-4">
            <div className="relative overflow-hidden bg-[#1a1a2e] sticky top-28"
              style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 48px rgba(26,26,46,0.2)' }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, #f54f9a, #41cdcf)' }} />
              {/* ambient glows */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#f54f9a]/[0.08] blur-[60px]" />
              <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#41cdcf]/[0.08] blur-[50px]" />

              <div className="relative z-10 p-8 text-center">
                {/* Avatar */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full animate-pulse opacity-20"
                    style={{ background: 'linear-gradient(135deg, #f54f9a, #41cdcf)' }} />
                  <div className="relative w-20 h-20 flex items-center justify-center text-white text-[22px] font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif", background: 'linear-gradient(135deg, #f54f9a 0%, #d4326e 45%, #41cdcf 100%)', boxShadow: '0 10px 28px rgba(245,79,154,0.35)' }}>
                    {initials}
                  </div>
                </div>

                <h2 className="text-[22px] font-light text-white mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {user.name}
                </h2>
                <p className="text-[11px] font-light text-white/45 mb-6 tracking-[0.04em]"
                  style={{ fontFamily: "'Jost', sans-serif" }}>
                  {user.email}
                </p>

                <div className="h-px mb-6" style={{ background: 'rgba(255,255,255,0.08)' }} />

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={13} style={{ color: '#41cdcf', flexShrink: 0 }} />
                    <div className="text-left">
                      <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/30"
                        style={{ fontFamily: "'Jost', sans-serif" }}>Membre depuis</p>
                      <p className="text-[12px] font-light text-white/60"
                        style={{ fontFamily: "'Jost', sans-serif" }}>{memberSince}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield size={13} style={{ color: '#f54f9a', flexShrink: 0 }} />
                    <div className="text-left">
                      <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/30"
                        style={{ fontFamily: "'Jost', sans-serif" }}>Compte</p>
                      <p className="text-[12px] font-light text-white/60"
                        style={{ fontFamily: "'Jost', sans-serif" }}>Vérifié & sécurisé</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: forms ── */}
          <div className="lg:col-span-8 space-y-5">

            {/* Profile info */}
            <Card accent="#41cdcf">
              <CardTitle
                icon={User} title="Informations personnelles" accent="#41cdcf"
                action={
                  <ToggleBtn
                    isActive={isEditing} onToggle={() => {
                      setIsEditing(!isEditing);
                      if (isEditing) { setFormData({ name: user.name, email: user.email }); setErrors({}); }
                    }}
                    activeLabel="Annuler" inactiveLabel="Modifier"
                  />
                }
              />

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Nom complet" name="name" value={formData.name}
                    onChange={onFormChange} disabled={!isEditing} icon={User}
                    error={errors.name} required={isEditing} />
                  <Field label="Adresse email" name="email" value={formData.email}
                    onChange={onFormChange} disabled={!isEditing} type="email" icon={Mail}
                    error={errors.email} required={isEditing} />
                </div>

                {errors.general && (
                  <div className="flex items-center gap-2 p-3 text-[11px] font-light"
                    style={{ background: 'rgba(245,79,154,0.05)', border: '1px solid rgba(245,79,154,0.2)', fontFamily: "'Jost', sans-serif", color: '#f54f9a' }}>
                    <AlertCircle size={13} style={{ flexShrink: 0 }} /> {errors.general}
                  </div>
                )}

                {isEditing && (
                  <div className="flex justify-end">
                    <button type="submit" disabled={saving}
                      className="flex items-center gap-2 px-7 py-3 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        background: saving ? 'rgba(65,205,207,0.7)' : 'linear-gradient(135deg, #41cdcf, #2aabb0)',
                        border: 'none', cursor: saving ? 'wait' : 'pointer',
                        boxShadow: saving ? 'none' : '0 8px 24px rgba(65,205,207,0.28)',
                      }}>
                      {saving ? (
                        <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg> Sauvegarde…</>
                      ) : (
                        <><Save size={13} /> Sauvegarder</>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </Card>

            {/* Security */}
            <Card accent="#f54f9a">
              <CardTitle
                icon={Shield} title="Sécurité" accent="#f54f9a"
                action={
                  <ToggleBtn
                    isActive={isChangingPassword} onToggle={() => {
                      setIsChangingPassword(!isChangingPassword);
                      if (isChangingPassword) {
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setErrors({}); setShowPwd({ current: false, new: false, confirm: false });
                      }
                    }}
                    activeLabel="Annuler" inactiveLabel="Changer mdp"
                  />
                }
              />

              {!isChangingPassword ? (
                <div className="flex items-center gap-3 p-4"
                  style={{ background: 'rgba(26,26,46,0.02)', border: '1px solid rgba(26,26,46,0.07)' }}>
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(245,79,154,0.08)', border: '1px solid rgba(245,79,154,0.2)' }}>
                    <Lock size={14} style={{ color: '#f54f9a' }} />
                  </div>
                  <p className="text-[12px] font-light leading-relaxed"
                    style={{ fontFamily: "'Jost', sans-serif", color: 'rgba(26,26,46,0.5)' }}>
                    Pour votre sécurité, nous vous recommandons de changer votre mot de passe régulièrement.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-5">
                  {[
                    { label: 'Mot de passe actuel', name: 'currentPassword', key: 'current' as const, val: passwordData.currentPassword, errKey: 'currentPassword' },
                    { label: 'Nouveau mot de passe', name: 'newPassword', key: 'new' as const, val: passwordData.newPassword, errKey: 'newPassword', hint: 'Au moins 8 caractères' },
                    { label: 'Confirmer le nouveau', name: 'confirmPassword', key: 'confirm' as const, val: passwordData.confirmPassword, errKey: 'confirmPassword' },
                  ].map(({ label, name, key, val, errKey, hint }) => (
                    <Field
                      key={name} label={label} name={name} value={val}
                      onChange={onPwdChange} icon={Lock} type={showPwd[key] ? 'text' : 'password'}
                      error={errors[errKey] || errors[name]}
                      hint={hint} required
                      suffix={
                        <button type="button" onClick={() => setShowPwd(p => ({ ...p, [key]: !p[key] }))}
                          style={{ color: 'rgba(26,26,46,0.3)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                          {showPwd[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      }
                    />
                  ))}

                  {errors.general && (
                    <div className="flex items-center gap-2 p-3 text-[11px] font-light"
                      style={{ background: 'rgba(245,79,154,0.05)', border: '1px solid rgba(245,79,154,0.2)', fontFamily: "'Jost', sans-serif", color: '#f54f9a' }}>
                      <AlertCircle size={13} style={{ flexShrink: 0 }} /> {errors.general}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button type="submit" disabled={saving}
                      className="flex items-center gap-2 px-7 py-3 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        background: saving ? 'rgba(245,79,154,0.7)' : 'linear-gradient(135deg, #f54f9a, #d4326e)',
                        border: 'none', cursor: saving ? 'wait' : 'pointer',
                        boxShadow: saving ? 'none' : '0 8px 24px rgba(245,79,154,0.28)',
                      }}>
                      {saving ? (
                        <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg> Changement…</>
                      ) : (
                        <><Lock size={13} /> Changer le mot de passe</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>

      <style>{fonts}</style>
    </div>
  );
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500;600&display=swap');`;

export default ProfilePage;
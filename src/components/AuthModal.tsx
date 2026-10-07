import React, { useState, useRef } from 'react';
import { User, AtSign, ArrowRight, Lock, Camera, LogIn, UserPlus } from 'lucide-react';
import { SupabaseService } from '../services/supabase';
import type { UserProfile } from '../types';

interface AuthModalProps {
  onComplete: (user: UserProfile, isNewRegistration?: boolean) => void;
  currentUser?: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onComplete, currentUser }) => {
  const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%2307080a" stroke="%23ffffff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

  const initialDigits = (currentUser?.phone || '').replace('+998', '').trim();

  // Mode: 'login' for existing users, 'register' for new users
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  const [phoneDigits, setPhoneDigits] = useState<string>(initialDigits);
  const [nickname, setNickname] = useState<string>(currentUser?.nickname || '');
  const [name, setName] = useState<string>(currentUser?.name || '');
  const [password, setPassword] = useState<string>(currentUser?.password || '');
  const [avatar, setAvatar] = useState<string>(currentUser?.avatar || defaultAvatar);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanDigits = phoneDigits.replace(/\D/g, '').trim();
    if (!cleanDigits) {
      setErrorMessage("⚠️ Telefon raqamingizni kiriting!");
      return;
    }

    const fullPhone = `+998 ${cleanDigits}`;

    // 1. KIRISH (LOGIN) MODE
    if (authTab === 'login') {
      if (!password) {
        setErrorMessage("⚠️ Parolingizni kiriting!");
        return;
      }

      setIsSyncing(true);
      const res = await SupabaseService.loginUser(fullPhone, password);
      setIsSyncing(false);

      if (res.success && res.user) {
        onComplete(res.user, false);
      } else {
        setErrorMessage(res.message || "⚠️ Kirishda xatolik yuz berdi!");
      }
      return;
    }

    // 2. RO'YXATDAN O'TISH (REGISTER) MODE
    if (!name.trim()) {
      setErrorMessage("⚠️ Ismingizni kiriting!");
      return;
    }

    if (!nickname.trim()) {
      setErrorMessage("⚠️ Nikneymingizni kiriting!");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("⚠️ Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    const cleanNick = nickname.replace(/^@/, '').toLowerCase().trim();

    setIsSyncing(true);

    // Verify unique nickname and phone number against database & local registry
    const { nicknameTaken, phoneTaken } = await SupabaseService.checkUserExists(
      cleanNick,
      fullPhone,
      currentUser?.nickname
    );

    if (nicknameTaken) {
      setIsSyncing(false);
      setErrorMessage(`⚠️ @${cleanNick} nikneymi allaqachon band! Boshqa nikneym tanlang.`);
      return;
    }

    if (phoneTaken) {
      setIsSyncing(false);
      setErrorMessage(`⚠️ ${fullPhone} telefon raqami allaqachon ro'yxatdan o'tgan!`);
      return;
    }

    const newUser: UserProfile = {
      phone: fullPhone,
      nickname: cleanNick,
      name,
      avatar,
      password,
      isLoggedIn: true,
      isRegistered: true
    };

    // Register user profile to Supabase Database & local registry
    await SupabaseService.registerUser(newUser);

    setIsSyncing(false);
    onComplete(newUser, true);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 8, 10, 0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.25rem'
    }}>
      <input
        type="file"
        ref={avatarInputRef}
        accept="image/*"
        onChange={handleAvatarSelect}
        style={{ display: 'none' }}
      />

      <form onSubmit={handleSubmit} className="fade-in" style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(18, 20, 26, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '2rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
      }}>
        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            type="button"
            onClick={() => { setAuthTab('login'); setErrorMessage(''); }}
            style={{
              flex: 1,
              background: authTab === 'login' ? '#ffffff' : 'transparent',
              color: authTab === 'login' ? '#000000' : '#ffffff',
              border: 'none',
              padding: '8px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={15} /> Kirish
          </button>

          <button
            type="button"
            onClick={() => { setAuthTab('register'); setErrorMessage(''); }}
            style={{
              flex: 1,
              background: authTab === 'register' ? '#ffffff' : 'transparent',
              color: authTab === 'register' ? '#000000' : '#ffffff',
              border: 'none',
              padding: '8px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={15} /> Ro'yxatdan O'tish
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          {/* Avatar Upload Circle in Register mode */}
          {authTab === 'register' && (
            <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 0.75rem' }}>
              <img
                src={avatar}
                alt="Avatar preview"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255, 255, 255, 0.25)',
                  background: '#07080a'
                }}
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                }}
                title="Avatar rasmini tanlash"
              >
                <Camera size={13} />
              </button>
            </div>
          )}

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px', margin: 0 }}>
            {authTab === 'login' ? 'YETTIGA KIRISH' : "YETTIGA RO'YXATDAN O'TISH"}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>
            {authTab === 'login'
              ? 'Telefon raqam va parolingiz bilan profilga kiring.'
              : 'Shaxsiy profilingizni yarating va parolingizni belgilang.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Locked +998 Phone Input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{
              position: 'absolute',
              left: '12px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              paddingRight: '6px',
              borderRight: '1px solid rgba(255,255,255,0.15)',
              userSelect: 'none'
            }}>
              <span>+998</span>
            </div>
            <input
              type="text"
              placeholder="90 123 45 67"
              value={phoneDigits}
              onChange={(e) => {
                setPhoneDigits(e.target.value);
                setErrorMessage('');
              }}
              required
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                borderRadius: '14px',
                padding: '12px 14px 12px 72px',
                fontSize: '0.9rem',
                outline: 'none',
                fontWeight: 700
              }}
            />
          </div>

          {/* Name & Nickname in Register mode only */}
          {authTab === 'register' && (
            <>
              {/* Name */}
              <div style={{ position: 'relative' }}>
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Ismingiz (masalan: Azizbek)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMessage('');
                  }}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    borderRadius: '14px',
                    padding: '12px 14px 12px 42px',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Nickname */}
              <div style={{ position: 'relative' }}>
                <AtSign size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Nikneym (masalan: aziz_yetti)"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setErrorMessage('');
                  }}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    borderRadius: '14px',
                    padding: '12px 14px 12px 42px',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </>
          )}

          {/* Password Input */}
          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="password"
              placeholder={authTab === 'register' ? "Parol (kamida 6 ta belgi)" : "Parolingizni kiriting"}
              value={password}
              minLength={authTab === 'register' ? 6 : 1}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
              required
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                borderRadius: '14px',
                padding: '12px 14px 12px 42px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '0.82rem',
            textAlign: 'center',
            fontWeight: 600,
            lineHeight: 1.4
          }}>
            {errorMessage}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={isSyncing}
            style={{
              flex: 1,
              background: '#ffffff',
              border: 'none',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.95rem',
              padding: '13px',
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15)'
            }}
          >
            {isSyncing ? 'Sinxronlanmoqda...' : (authTab === 'login' ? 'Kirish' : "Ro'yxatdan O'tish")} <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

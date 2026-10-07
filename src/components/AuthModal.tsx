import React, { useState } from 'react';
import { Phone, User, AtSign, Zap, ArrowRight } from 'lucide-react';
import { SupabaseService } from '../services/supabase';
import type { UserProfile } from '../types';

interface AuthModalProps {
  onComplete: (user: UserProfile) => void;
  currentUser?: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onComplete, currentUser }) => {
  const [phone, setPhone] = useState(currentUser?.phone || '+998 ');
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [name, setName] = useState(currentUser?.name || '');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!phone.trim() || !nickname.trim() || !name.trim()) return;

    const cleanNick = nickname.replace(/^@/, '').toLowerCase().trim();
    const cleanPhone = phone.trim();

    setIsSyncing(true);

    // Verify unique nickname and phone number against database & local registry
    const { nicknameTaken, phoneTaken } = await SupabaseService.checkUserExists(
      cleanNick,
      cleanPhone,
      currentUser?.nickname
    );

    if (nicknameTaken) {
      setIsSyncing(false);
      setErrorMessage(`⚠️ @${cleanNick} nikneymi allaqachon band! Boshqa nikneym tanlang.`);
      return;
    }

    if (phoneTaken) {
      setIsSyncing(false);
      setErrorMessage(`⚠️ ${cleanPhone} telefon raqami allaqachon ro'yxatdan o'tgan!`);
      return;
    }

    const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%2307080a" stroke="%23ffffff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

    const user: UserProfile = {
      phone: cleanPhone,
      nickname: cleanNick,
      name,
      avatar: currentUser?.avatar && !currentUser.avatar.includes('unsplash') ? currentUser.avatar : defaultAvatar,
      isLoggedIn: true,
      isRegistered: true
    };

    // Register user profile to Supabase Database & local registry
    await SupabaseService.registerUser(user);

    setIsSyncing(false);
    onComplete(user);
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
      <form onSubmit={handleSubmit} className="fade-in" style={{
        width: '100%',
        maxWidth: '390px',
        background: 'rgba(18, 20, 26, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '2rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.85rem'
          }}>
            <Zap size={24} color="#ffffff" fill="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px', margin: 0 }}>
            YETTIGA KIRISH
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
            Shaxsiy profilingizni yarating. Ma'lumotlaringiz xavfsiz biriktiriladi.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Phone */}
          <div style={{ position: 'relative' }}>
            <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Telefon raqam (+998 ...)"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
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
            {isSyncing ? 'Sinxronlanmoqda...' : 'Davom etish'} <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

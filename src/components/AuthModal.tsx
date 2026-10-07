import React, { useState } from 'react';
import { Phone, User, AtSign, Zap, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
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
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !nickname.trim() || !name.trim()) return;

    setIsSyncing(true);

    const user: UserProfile = {
      phone,
      nickname: nickname.replace('@', ''),
      name,
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isLoggedIn: true
    };

    // Register user profile to Supabase Database
    await SupabaseService.registerUser(user);

    setIsSyncing(false);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 }, colors: ['#d4af37', '#f5e396'] });
    onComplete(user);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 5, 7, 0.92)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <form onSubmit={handleSubmit} className="fade-in" style={{
        width: '100%',
        maxWidth: '390px',
        background: '#0d0c12',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '28px',
        padding: '1.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.15)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--gold-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            boxShadow: '0 0 20px rgba(212,175,55,0.4)'
          }}>
            <Zap size={28} color="#000" fill="#000" />
          </div>
          <h2 className="text-gold-metallic" style={{ fontSize: '1.35rem', margin: 0 }}>
            YETTI GOLD KIRISH
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '6px' }}>
            Telefon raqam, ism va nik kiritib ma'lumotlar bazasiga ulaning va momental rasmlaringiz tavsiyalarga chiqsin!
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Phone */}
          <div style={{ position: 'relative' }}>
            <Phone size={18} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Telefon raqam (+998 ...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(212,175,55,0.06)',
                border: '1px solid rgba(212,175,55,0.25)',
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
            <User size={18} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Ismingiz (masalan: Azizbek)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(212,175,55,0.06)',
                border: '1px solid rgba(212,175,55,0.25)',
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
            <AtSign size={18} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Nikname (masalan: aziz_yetti)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(212,175,55,0.06)',
                border: '1px solid rgba(212,175,55,0.25)',
                color: '#fff',
                borderRadius: '14px',
                padding: '12px 14px 12px 42px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={isSyncing}
            style={{
              flex: 1,
              background: 'var(--gold-gradient)',
              border: 'none',
              color: '#000',
              fontWeight: 900,
              fontSize: '0.95rem',
              padding: '13px',
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 20px rgba(212,175,55,0.35)'
            }}
          >
            <CheckCircle size={18} /> {isSyncing ? 'Baza bilan sinxronlanmoqda...' : 'Tasdiqlash'}
          </button>
        </div>
      </form>
    </div>
  );
};

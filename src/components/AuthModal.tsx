import React, { useState } from 'react';
import { Phone, User, AtSign, Zap, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { UserProfile } from '../types';

interface AuthModalProps {
  onComplete: (user: UserProfile) => void;
  onClose: () => void;
  currentUser?: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onComplete, currentUser }) => {
  const [phone, setPhone] = useState(currentUser?.phone || '+998 ');
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [name, setName] = useState(currentUser?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !nickname.trim() || !name.trim()) return;

    const user: UserProfile = {
      phone,
      nickname: nickname.replace('@', ''),
      name,
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isLoggedIn: true
    };

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    onComplete(user);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <form onSubmit={handleSubmit} className="fade-in" style={{
        width: '100%',
        maxWidth: '380px',
        background: '#111116',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '24px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00f2fe, #ff007f)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem'
          }}>
            <Zap size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>YETTI ga Kirish</h2>
          <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '4px' }}>
            Telefon raqam, ism va nikingizni kiriting va darhol rasmlaringiz tavsiyalarga chiqsin!
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Phone */}
          <div style={{ position: 'relative' }}>
            <Phone size={18} color="#a1a1aa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Telefon raqam (+998 ...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
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
            <User size={18} color="#a1a1aa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Ismingiz (masalan: Azizbek)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
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
            <AtSign size={18} color="#a1a1aa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Nikname (masalan: aziz_yetti)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
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
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
              border: 'none',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.95rem',
              padding: '12px',
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle size={18} /> Tasdiqlash
          </button>
        </div>
      </form>
    </div>
  );
};

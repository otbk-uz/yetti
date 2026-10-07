import React from 'react';
import { Settings, Grid, Heart, Camera } from 'lucide-react';
import type { UserProfile as UserProfileType, MediaPost } from '../types';

interface UserProfileProps {
  user: UserProfileType;
  userPosts: MediaPost[];
  onOpenEditAuth: () => void;
  onGoToCamera: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  userPosts,
  onOpenEditAuth,
  onGoToCamera
}) => {
  const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%2307080a" stroke="%23ffffff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
  const displayAvatar = (user.avatar && !user.avatar.includes('unsplash')) ? user.avatar : defaultAvatar;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#07080a', overflowY: 'auto', paddingBottom: '90px', padding: '1.25rem' }}>
      {/* Profile Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '0.85rem',
        padding: '1.75rem 1rem',
        background: 'rgba(18, 20, 26, 0.75)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
      }}>
        <div style={{ position: 'relative' }}>
          <img
            src={displayAvatar}
            alt={user.name}
            style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255, 255, 255, 0.2)' }}
          />
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>{user.name}</h2>
          <span style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 700 }}>@{user.nickname}</span>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>📱 {user.phone}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px' }}>
          <button
            onClick={onOpenEditAuth}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '7px 16px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Settings size={14} /> Profilni tahrirlash
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1.5rem 0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
          <Grid size={18} color="#38bdf8" />
          <span>Mening Momental Postlarim ({userPosts.length})</span>
        </div>
        <button
          onClick={onGoToCamera}
          style={{
            background: 'none',
            border: 'none',
            color: '#38bdf8',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Camera size={14} /> Yangi olish
        </button>
      </div>

      {/* Media Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        {userPosts.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            Hali instant rasmlar yoki videolar yo'q. Kamera orqali hosil qiling!
          </div>
        ) : (
          userPosts.map(post => (
            <div key={post.id} style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.08)' }}>
              {post.type === 'photo' ? (
                <img src={post.mediaUrl} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <video src={post.mediaUrl} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                background: 'rgba(7,8,10,0.85)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <Heart size={10} fill="#ef4444" color="#ef4444" /> {post.likes}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

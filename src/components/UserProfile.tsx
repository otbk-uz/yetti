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
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflowY: 'auto', paddingBottom: '90px', padding: '1.25rem' }}>
      {/* Profile Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '0.85rem',
        padding: '1.5rem 1rem',
        background: '#111116',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ position: 'relative' }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00f2fe' }}
          />
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>{user.name}</h2>
          <span style={{ fontSize: '0.85rem', color: '#00f2fe', fontWeight: 600 }}>@{user.nickname}</span>
          <span style={{ fontSize: '0.78rem', color: '#a1a1aa', display: 'block', marginTop: '2px' }}>📱 {user.phone}</span>
        </div>

        <button
          onClick={onOpenEditAuth}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '0.78rem',
            fontWeight: 600,
            padding: '6px 14px',
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

      {/* Grid Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1.5rem 0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
          <Grid size={18} color="#00f2fe" />
          <span>Mening Momental Postlarim ({userPosts.length})</span>
        </div>
        <button
          onClick={onGoToCamera}
          style={{
            background: 'none',
            border: 'none',
            color: '#00f2fe',
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
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 1rem', color: '#71717a', fontSize: '0.85rem' }}>
            Hali olingan instant rasmlar yoki videolar yo'q. Kamera orqali hosil qiling!
          </div>
        ) : (
          userPosts.map(post => (
            <div key={post.id} style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', background: '#18181b' }}>
              {post.type === 'photo' ? (
                <img src={post.mediaUrl} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <video src={post.mediaUrl} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                <Heart size={10} fill="#ff0055" color="#ff0055" /> {post.likes}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

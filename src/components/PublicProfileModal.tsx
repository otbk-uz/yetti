import React from 'react';
import { X, Grid, Heart } from 'lucide-react';
import type { MediaPost } from '../types';

interface PublicProfileModalProps {
  authorName: string;
  authorNickname: string;
  authorAvatar: string;
  authorPosts: MediaPost[];
  onClose: () => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  authorName,
  authorNickname,
  authorAvatar,
  authorPosts,
  onClose
}) => {
  const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%2307080a" stroke="%23ffffff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
  const displayAvatar = (authorAvatar && !authorAvatar.includes('unsplash')) ? authorAvatar : defaultAvatar;

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
      zIndex: 150,
      padding: '1.25rem'
    }}>
      <div className="fade-in" style={{
        width: '100%',
        maxWidth: '420px',
        maxHeight: '90vh',
        background: 'rgba(18, 20, 26, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '1.75rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            borderRadius: '50%',
            padding: '8px',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Profile Card Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '0.75rem',
          paddingTop: '0.5rem'
        }}>
          <img
            src={displayAvatar}
            alt={authorName}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              background: '#07080a'
            }}
          />

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              {authorName}
            </h3>
            <span style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 700 }}>
              @{authorNickname}
            </span>
          </div>
        </div>

        {/* Grid Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 800, color: '#fff', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Grid size={16} color="#38bdf8" />
          <span>Instant Postlar ({authorPosts.length})</span>
        </div>

        {/* Media Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {authorPosts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.82rem' }}>
              Ushbu foydalanuvchida hali joylangan postlar yo'q.
            </div>
          ) : (
            authorPosts.map(post => (
              <div key={post.id} style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
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
    </div>
  );
};

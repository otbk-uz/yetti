import React, { useState } from 'react';
import { Settings, Grid, Heart, Camera, Trash2, Edit3, Check, X } from 'lucide-react';
import type { UserProfile as UserProfileType, MediaPost } from '../types';

interface UserProfileProps {
  user: UserProfileType;
  userPosts: MediaPost[];
  onDeletePost: (postId: string) => void;
  onEditCaption: (postId: string, newCaption: string) => void;
  onOpenEditAuth: () => void;
  onGoToCamera: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  userPosts,
  onDeletePost,
  onEditCaption,
  onOpenEditAuth,
  onGoToCamera
}) => {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editCaptionText, setEditCaptionText] = useState<string>('');

  const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%2307080a" stroke="%23ffffff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
  const displayAvatar = (user.avatar && !user.avatar.includes('unsplash')) ? user.avatar : defaultAvatar;

  const handleStartEdit = (post: MediaPost) => {
    setEditingPostId(post.id);
    setEditCaptionText(post.caption || '');
  };

  const handleSaveEdit = (postId: string) => {
    onEditCaption(postId, editCaptionText);
    setEditingPostId(null);
  };

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
        {userPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            Hali instant rasmlar yoki videolar yo'q. Kamera orqali hosil qiling!
          </div>
        ) : (
          userPosts.map(post => (
            <div
              key={post.id}
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'rgba(18, 20, 26, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '260px', background: '#000' }}>
                {post.type === 'photo' ? (
                  <img src={post.mediaUrl} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <video src={post.mediaUrl} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}

                {/* Top Action overlay: Edit & Delete */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  display: 'flex',
                  gap: '6px',
                  zIndex: 10
                }}>
                  <button
                    onClick={() => handleStartEdit(post)}
                    style={{
                      background: 'rgba(7, 8, 10, 0.75)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      borderRadius: '50%',
                      padding: '8px',
                      cursor: 'pointer'
                    }}
                    title="Izohni tahrirlash"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("Rasm yoki videoni o'chirib tashlamoqchimisiz?")) {
                        onDeletePost(post.id);
                      }
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#fff',
                      borderRadius: '50%',
                      padding: '8px',
                      cursor: 'pointer'
                    }}
                    title="O'chirish (Delete)"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(7,8,10,0.85)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}>
                  <Heart size={12} fill="#ef4444" color="#ef4444" /> {post.likes}
                </div>
              </div>

              {/* Caption display & inline editing */}
              <div style={{ padding: '0.85rem' }}>
                {editingPostId === post.id ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      value={editCaptionText}
                      onChange={(e) => setEditCaptionText(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '6px 10px',
                        fontSize: '0.82rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      onClick={() => handleSaveEdit(post.id)}
                      style={{ background: '#ffffff', color: '#000', border: 'none', borderRadius: '10px', padding: '6px 10px', cursor: 'pointer' }}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingPostId(null)}
                      style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '10px', padding: '6px 10px', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: 0, lineHeight: 1.4 }}>
                    {post.caption || "Izoh yo'q"}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

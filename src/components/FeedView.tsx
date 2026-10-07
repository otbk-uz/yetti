import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Zap, Volume2, VolumeX, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { MediaPost } from '../types';

interface FeedViewProps {
  posts: MediaPost[];
  onLikePost: (id: string) => void;
  onGoToCamera: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ posts, onLikePost, onGoToCamera }) => {
  const [activeTab, setActiveTab] = useState<'recs' | 'momental' | 'following'>('recs');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({
    'post-1': ['Juda chiroyli manzara! 🔥', 'Dahshat moment!'],
    'post-2': ['Darak berdi YETTI app ✨']
  });

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), commentInput]
    }));
    setCommentInput('');
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflowY: 'auto', paddingBottom: '90px' }}>
      {/* Top Recommendations Filter Bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        padding: '12px 1rem',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.4))',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        <button
          className={`filter-chip ${activeTab === 'recs' ? 'active' : ''}`}
          onClick={() => setActiveTab('recs')}
        >
          🔥 Tavsiyalar (Recommendation)
        </button>
        <button
          className={`filter-chip ${activeTab === 'momental' ? 'active' : ''}`}
          onClick={() => setActiveTab('momental')}
        >
          ⚡ Momental
        </button>
      </div>

      {/* Media Posts Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0 0.75rem' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#a1a1aa' }}>
            <Zap size={48} color="#00f2fe" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Hozircha momentlar yo'q</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Birinchi bo'lib rasm yoki video ulashing!</p>
            <button
              onClick={onGoToCamera}
              style={{
                marginTop: '1.25rem',
                background: '#00f2fe',
                color: '#000',
                border: 'none',
                fontWeight: 800,
                padding: '10px 20px',
                borderRadius: '999px',
                cursor: 'pointer'
              }}
            >
              📸 Rasm / Video Olish
            </button>
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#111116',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              {/* Media element */}
              <div style={{ position: 'relative', width: '100%', height: '420px', background: '#000' }}>
                {post.type === 'photo' ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.caption || 'Media'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <video
                      src={post.mediaUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>
                )}

                {/* Author Info Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '999px'
                }}>
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', display: 'block', lineHeight: 1.2 }}>
                      @{post.authorNickname}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#a1a1aa' }}>{post.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => onLikePost(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: post.isLiked ? '#ff0055' : '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      <Heart size={22} fill={post.isLiked ? '#ff0055' : 'none'} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      <MessageCircle size={22} />
                      <span>{post.commentsCount + (commentsMap[post.id]?.length || 0)}</span>
                    </button>
                  </div>

                  <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <Share2 size={20} />
                  </button>
                </div>

                {post.caption && (
                  <p style={{ fontSize: '0.85rem', color: '#e4e4e7', lineHeight: 1.4, margin: 0 }}>
                    <strong style={{ color: '#fff', marginRight: '6px' }}>@{post.authorNickname}</strong>
                    {post.caption}
                  </p>
                )}

                {/* Inline Comment Modal section */}
                {activeCommentPostId === post.id && (
                  <div className="fade-in" style={{
                    marginTop: '0.5rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    {commentsMap[post.id]?.map((c, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                        💬 <strong style={{ color: '#fff' }}>Siz:</strong> {c}
                      </div>
                    ))}

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px' }}>
                      <input
                        type="text"
                        placeholder="Izoh yozing..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        style={{
                          flex: 1,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                          borderRadius: '999px',
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        style={{ background: '#00f2fe', color: '#000', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Zap, Volume2, VolumeX, Send, Search, Trash2, Edit3, Check, X } from 'lucide-react';
import { PublicProfileModal } from './PublicProfileModal';
import type { MediaPost } from '../types';

interface FeedViewProps {
  posts: MediaPost[];
  onLikePost: (id: string) => void;
  onDeletePost?: (id: string) => void;
  onEditCaption?: (id: string, newCaption: string) => void;
  currentUserNickname?: string;
  onGoToCamera: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  onLikePost,
  onDeletePost,
  onEditCaption,
  currentUserNickname,
  onGoToCamera
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [editingCaptionPostId, setEditingCaptionPostId] = useState<string | null>(null);
  const [editCaptionText, setEditCaptionText] = useState<string>('');
  const [commentInput, setCommentInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<{ name: string; nickname: string; avatar: string } | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({});

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), commentInput]
    }));
    setCommentInput('');
  };

  const handleStartEdit = (post: MediaPost) => {
    setEditingCaptionPostId(post.id);
    setEditCaptionText(post.caption || '');
  };

  const handleSaveEdit = (postId: string) => {
    if (onEditCaption) {
      onEditCaption(postId, editCaptionText);
    }
    setEditingCaptionPostId(null);
  };

  const normalize = (s?: string) => (s || '').replace(/^@/, '').toLowerCase().trim();

  // Filter posts by search query (author, hashtag, caption)
  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (post.authorName || '').toLowerCase().includes(q) ||
      (post.authorNickname || '').toLowerCase().includes(q) ||
      (post.caption || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#07080a', overflowY: 'auto', paddingBottom: '90px' }}>
      {/* Search & Top Feed Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        padding: '12px 1rem',
        background: 'rgba(7, 8, 10, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Qidiruv (@nikneym, #xesteg, izoh)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              borderRadius: '999px',
              padding: '8px 14px 8px 36px',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Media Posts Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0.75rem 0' }}>
        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: '#94a3b8' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Zap size={28} color="#ffffff" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              {searchQuery ? 'Hech narsa topilmadi' : "Hozircha momentlar yo'q"}
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
              {searchQuery ? "Boshqa kalit so'z bilan qidirib ko'ring." : "Birinchi bo'lib instant rasm yoki video joylang!"}
            </p>
            {!searchQuery && (
              <button
                onClick={onGoToCamera}
                style={{
                  marginTop: '1.25rem',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  cursor: 'pointer'
                }}
              >
                📸 Instant Rasm / Video Olish
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map(post => {
            const isOwner = normalize(post.authorNickname) === normalize(currentUserNickname) && !!currentUserNickname;

            return (
              <div
                key={post.id}
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: 'rgba(18, 20, 26, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
                }}
              >
                {/* Media Container */}
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
                          background: 'rgba(7,8,10,0.7)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
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

                  {/* Author Badge */}
                  <div
                    onClick={() => setSelectedAuthor({ name: post.authorName, nickname: post.authorNickname, avatar: post.authorAvatar })}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      background: 'rgba(7, 8, 10, 0.75)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '4px 12px 4px 6px',
                      borderRadius: '999px',
                      cursor: 'pointer'
                    }}
                    title={`${post.authorName} (@${post.authorNickname}) profilini ko'rish`}
                  >
                    <img
                      src={post.authorAvatar || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%2307080a" stroke="%23ffffff" stroke-width="2"><circle cx="12" cy="7" r="4"></circle></svg>`}
                      alt={post.authorName}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', display: 'block', lineHeight: 1.2 }}>
                        @{post.authorNickname}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{post.timestamp}</span>
                    </div>
                  </div>

                  {/* Owner Controls (Edit/Delete) */}
                  {isOwner && (
                    <div style={{ position: 'absolute', top: '12px', right: post.type === 'video' ? '54px' : '12px', display: 'flex', gap: '6px', zIndex: 10 }}>
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
                            onDeletePost?.(post.id);
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
                  )}
                </div>

                {/* Actions Bar */}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        onClick={() => onLikePost(post.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: post.isLiked ? '#ef4444' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.88rem',
                          fontWeight: 800
                        }}
                      >
                        <Heart size={22} fill={post.isLiked ? '#ef4444' : 'none'} color={post.isLiked ? '#ef4444' : '#fff'} />
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
                          fontSize: '0.88rem',
                          fontWeight: 700
                        }}
                      >
                        <MessageCircle size={22} />
                        <span>{post.commentsCount + (commentsMap[post.id]?.length || 0)}</span>
                      </button>
                    </div>

                    <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <Share2 size={20} />
                    </button>
                  </div>

                  {editingCaptionPostId === post.id ? (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <input
                        type="text"
                        value={editCaptionText}
                        onChange={(e) => setEditCaptionText(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
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
                        onClick={() => setEditingCaptionPostId(null)}
                        style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none', borderRadius: '10px', padding: '6px 10px', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    post.caption && (
                      <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.4, margin: 0 }}>
                        <strong style={{ color: '#ffffff', marginRight: '6px' }}>@{post.authorNickname}</strong>
                        {post.caption}
                      </p>
                    )
                  )}

                  {/* Inline Comment Section */}
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
                        <div key={i} style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          💬 <strong style={{ color: '#ffffff' }}>Siz:</strong> {c}
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
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#fff',
                            borderRadius: '999px',
                            padding: '6px 14px',
                            fontSize: '0.8rem',
                            outline: 'none'
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          style={{ background: '#ffffff', color: '#000000', border: 'none', borderRadius: '50%', padding: '7px', cursor: 'pointer' }}
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Public Author Profile Modal */}
      {selectedAuthor && (
        <PublicProfileModal
          authorName={selectedAuthor.name}
          authorNickname={selectedAuthor.nickname}
          authorAvatar={selectedAuthor.avatar}
          authorPosts={posts.filter(p => normalize(p.authorNickname) === normalize(selectedAuthor.nickname))}
          onClose={() => setSelectedAuthor(null)}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Users, Send, ShieldCheck, Heart } from 'lucide-react';
import { COMMUNITY_MEMBERS } from '../data/mockData';

export const CommunityHub: React.FC = () => {
  const [feed, setFeed] = useState([
    {
      id: 1,
      author: 'Sherzod Tursunov',
      role: 'Lead Architect',
      time: '10 daqiqa oldin',
      content: 'YETTI v7.0 platformasi ultra-tezkor Vite va TypeScript arxitekturasida muvaffaqiyatli ishga tushdi! 🚀 Repository d:\\project\\yetti ichida.',
      likes: 24
    },
    {
      id: 2,
      author: 'Dina YETTI AI',
      role: 'Autonomous Neural Agent',
      time: '25 daqiqa oldin',
      content: 'Barcha 7 modul sinxronizatsiyasi 100% ga tenglashdi. Latency 14ms ga kamaytirildi. ⚡',
      likes: 42
    }
  ]);

  const [postInput, setPostInput] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postInput.trim()) return;

    const newPost = {
      id: Date.now(),
      author: 'Siz (Developer)',
      role: 'Core Contributor',
      time: 'Hozir',
      content: postInput,
      likes: 1
    };

    setFeed([newPost, ...feed]);
    setPostInput('');
  };

  const handleLike = (id: number) => {
    setFeed(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            <Users size={26} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Modul 6: Cyber Hub</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Dasturchilar va AI Agentlar Jamoaviy Hamjamiyati</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#38bdf8' }}>
          <span className="pulse-indicator"></span> 94 A'zo Online
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem' }}>
        {/* Main Feed Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Post Creator */}
          <form onSubmit={handleCreatePost} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <textarea
              className="glass-input"
              rows={2}
              placeholder="Jamoaga xabar yoki yangilik yozing..."
              value={postInput}
              onChange={(e) => setPostInput(e.target.value)}
              style={{ width: '100%', resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ fontSize: '0.85rem' }}>
                <Send size={14} /> E'lon qilish
              </button>
            </div>
          </form>

          {/* Feed Posts */}
          {feed.map(post => (
            <div key={post.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{post.author}</h4>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{post.role} • {post.time}</span>
                </div>
                <ShieldCheck size={18} color="#10b981" />
              </div>

              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>
                {post.content}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{ background: 'none', border: 'none', color: '#ec4899', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                >
                  <Heart size={16} fill="#ec4899" /> {post.likes} Ta'sirchan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Online Roster Sidebar */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Faol A'zolar</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {COMMUNITY_MEMBERS.map(member => (
              <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: member.status === 'online' ? '#10b981' : member.status === 'busy' ? '#f59e0b' : '#64748b',
                    border: '2px solid #070913'
                  }} />
                </div>

                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{member.name}</h5>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Camera, Flame, User, Zap, UserCheck } from 'lucide-react';
import { InstantCamera } from './components/InstantCamera';
import { FeedView } from './components/FeedView';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';
import { INITIAL_USER, INITIAL_RECOMMENDATIONS } from './data/mockData';
import type { MainView, MediaPost, UserProfile as UserProfileType } from './types';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<MainView>('camera'); // Camera First as requested!
  const [user, setUser] = useState<UserProfileType>(INITIAL_USER);
  const [posts, setPosts] = useState<MediaPost[]>(INITIAL_RECOMMENDATIONS);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Load persistent user profile from localStorage if present
  useEffect(() => {
    const savedUser = localStorage.getItem('yetti_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  const handlePublishPost = (newPost: MediaPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  const handleSaveUser = (updatedUser: UserProfileType) => {
    setUser(updatedUser);
    localStorage.setItem('yetti_user', JSON.stringify(updatedUser));
    setShowAuthModal(false);
  };

  const userPosts = posts.filter(p => p.authorNickname === user.nickname);

  return (
    <div className="yetti-app">
      {/* Top Bar Header */}
      <header className="yetti-header">
        <div className="yetti-logo" onClick={() => setActiveView('camera')}>
          <Zap size={22} color="#00f2fe" fill="#00f2fe" />
          <span>YETTI</span>
          <span className="yetti-badge">MOMENTAL</span>
        </div>

        {/* User login / profile trigger button */}
        <button
          onClick={() => setShowAuthModal(true)}
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <UserCheck size={14} color="#00f2fe" />
          <span>@{user.nickname}</span>
        </button>
      </header>

      {/* Viewport content */}
      <main style={{ flex: 1, position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {activeView === 'camera' && (
          <InstantCamera
            onPublishPost={handlePublishPost}
            onGoToFeed={() => setActiveView('feed')}
            authorName={user.name}
            authorNickname={user.nickname}
            authorAvatar={user.avatar}
          />
        )}

        {activeView === 'feed' && (
          <FeedView
            posts={posts}
            onLikePost={handleLikePost}
            onGoToCamera={() => setActiveView('camera')}
          />
        )}

        {activeView === 'profile' && (
          <UserProfile
            user={user}
            userPosts={userPosts}
            onOpenEditAuth={() => setShowAuthModal(true)}
            onGoToCamera={() => setActiveView('camera')}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Tabbar */}
      <nav className="yetti-tabbar">
        <button
          className={`tab-item ${activeView === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveView('camera')}
        >
          <div className="tab-icon-wrapper">
            <Camera size={22} color={activeView === 'camera' ? '#00f2fe' : '#a1a1aa'} />
          </div>
          <span>Momental Kamera</span>
        </button>

        <button
          className={`tab-item ${activeView === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveView('feed')}
        >
          <div className="tab-icon-wrapper">
            <Flame size={22} color={activeView === 'feed' ? '#ff007f' : '#a1a1aa'} />
          </div>
          <span>Tavsiyalar</span>
        </button>

        <button
          className={`tab-item ${activeView === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveView('profile')}
        >
          <div className="tab-icon-wrapper">
            <User size={22} color={activeView === 'profile' ? '#ffaa00' : '#a1a1aa'} />
          </div>
          <span>Profil</span>
        </button>
      </nav>

      {/* Auth Modal Registration */}
      {showAuthModal && (
        <AuthModal
          onComplete={handleSaveUser}
          onClose={() => setShowAuthModal(false)}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default App;

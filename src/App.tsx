import React, { useState, useEffect } from 'react';
import { Camera, Flame, User, Zap, UserCheck } from 'lucide-react';
import { InstantCamera } from './components/InstantCamera';
import { FeedView } from './components/FeedView';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';
import { SupabaseService } from './services/supabase';
import { INITIAL_USER, INITIAL_RECOMMENDATIONS } from './data/mockData';
import type { MainView, MediaPost, UserProfile as UserProfileType } from './types';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<MainView>('camera'); // Camera First as requested!
  const [user, setUser] = useState<UserProfileType>(INITIAL_USER);
  const [posts, setPosts] = useState<MediaPost[]>(INITIAL_RECOMMENDATIONS);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Load persistent user profile & Supabase live database feed
  useEffect(() => {
    const savedUser = localStorage.getItem('yetti_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.log(e);
      }
    }

    // Attempt Supabase live database feed fetch
    SupabaseService.fetchRecommendationFeed().then(remotePosts => {
      if (remotePosts && remotePosts.length > 0) {
        setPosts(prev => [...remotePosts, ...prev]);
      }
    });
  }, []);

  const handlePublishPost = (newPost: MediaPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        const newLikes = isLiked ? p.likes + 1 : p.likes - 1;
        SupabaseService.toggleLikePost(postId, newLikes);
        return {
          ...p,
          isLiked,
          likes: newLikes
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
          <Zap size={22} color="#d4af37" fill="#d4af37" />
          <span className="text-gold-metallic">YETTI</span>
        </div>

        {/* User profile badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              background: 'rgba(212,175,55,0.12)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: '#f5e396',
              padding: '5px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <UserCheck size={14} color="#d4af37" />
            <span>@{user.nickname}</span>
          </button>
        </div>
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
            <Camera size={22} color={activeView === 'camera' ? '#d4af37' : '#71717a'} />
          </div>
          <span>Momental Kamera</span>
        </button>

        <button
          className={`tab-item ${activeView === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveView('feed')}
        >
          <div className="tab-icon-wrapper">
            <Flame size={22} color={activeView === 'feed' ? '#d4af37' : '#71717a'} />
          </div>
          <span>Tavsiyalar</span>
        </button>

        <button
          className={`tab-item ${activeView === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveView('profile')}
        >
          <div className="tab-icon-wrapper">
            <User size={22} color={activeView === 'profile' ? '#d4af37' : '#71717a'} />
          </div>
          <span>Profil</span>
        </button>
      </nav>

      {/* Auth Modal Registration */}
      {showAuthModal && (
        <AuthModal
          onComplete={handleSaveUser}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default App;

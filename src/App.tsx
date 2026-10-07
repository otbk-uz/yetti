import React, { useState, useEffect } from 'react';
import { Camera, Flame, User, Zap, HelpCircle } from 'lucide-react';
import { InstantCamera } from './components/InstantCamera';
import { FeedView } from './components/FeedView';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SupabaseService } from './services/supabase';
import { INITIAL_USER, INITIAL_RECOMMENDATIONS } from './data/mockData';
import type { MainView, MediaPost, UserProfile as UserProfileType } from './types';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<MainView>('camera'); // Camera First as requested!
  const [user, setUser] = useState<UserProfileType>(INITIAL_USER);
  const [posts, setPosts] = useState<MediaPost[]>(INITIAL_RECOMMENDATIONS);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(!localStorage.getItem('yetti_user'));
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const normalizeNick = (nick?: string) => (nick || '').replace(/^@/, '').toLowerCase().trim();

  // Load persistent user profile & posts & check registration status
  useEffect(() => {
    const savedUserStr = localStorage.getItem('yetti_user');
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        setUser(parsed);
        if (!parsed.isRegistered) {
          setShowAuthModal(true);
        }
      } catch (e) {
        setShowAuthModal(true);
      }
    } else {
      // First time user -> Force registration modal first!
      setShowAuthModal(true);
    }

    // Load saved local user posts
    let localPosts: MediaPost[] = [];
    const savedLocalPosts = localStorage.getItem('yetti_user_posts');
    if (savedLocalPosts) {
      try {
        localPosts = JSON.parse(savedLocalPosts);
      } catch (e) {
        console.log(e);
      }
    }

    if (localPosts.length > 0) {
      setPosts(prev => {
        const combined = [...localPosts, ...prev];
        const uniqueMap = new Map<string, MediaPost>();
        combined.forEach(item => {
          if (!uniqueMap.has(item.id)) {
            uniqueMap.set(item.id, item);
          }
        });
        return Array.from(uniqueMap.values());
      });
    }

    // Fetch remote posts from Supabase DB
    SupabaseService.fetchRecommendationFeed().then(remotePosts => {
      if (remotePosts && remotePosts.length > 0) {
        setPosts(prev => {
          const combined = [...localPosts, ...remotePosts, ...prev];
          const uniqueMap = new Map<string, MediaPost>();
          combined.forEach(item => {
            if (!uniqueMap.has(item.id)) {
              uniqueMap.set(item.id, item);
            }
          });
          return Array.from(uniqueMap.values());
        });
      }
    });
  }, []);

  const handlePublishPost = (newPost: MediaPost) => {
    const cleanedPost: MediaPost = {
      ...newPost,
      authorNickname: normalizeNick(newPost.authorNickname || user.nickname)
    };

    setPosts(prev => [cleanedPost, ...prev]);

    // Save to local user posts storage
    const savedLocalPosts = localStorage.getItem('yetti_user_posts');
    let localArray: MediaPost[] = [];
    if (savedLocalPosts) {
      try {
        localArray = JSON.parse(savedLocalPosts);
      } catch (e) {
        localArray = [];
      }
    }
    localArray = [cleanedPost, ...localArray];
    localStorage.setItem('yetti_user_posts', JSON.stringify(localArray));
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

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));

    // Remove from local storage yetti_user_posts
    const savedLocalPosts = localStorage.getItem('yetti_user_posts');
    if (savedLocalPosts) {
      try {
        const localArray: MediaPost[] = JSON.parse(savedLocalPosts);
        const updated = localArray.filter(p => p.id !== postId);
        localStorage.setItem('yetti_user_posts', JSON.stringify(updated));
      } catch (e) {}
    }

    // Delete from Supabase DB
    SupabaseService.deletePost(postId);
  };

  const handleEditCaption = (postId: string, newCaption: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, caption: newCaption };
      }
      return p;
    }));

    // Update in local storage
    const savedLocalPosts = localStorage.getItem('yetti_user_posts');
    if (savedLocalPosts) {
      try {
        const localArray: MediaPost[] = JSON.parse(savedLocalPosts);
        const updated = localArray.map(p => p.id === postId ? { ...p, caption: newCaption } : p);
        localStorage.setItem('yetti_user_posts', JSON.stringify(updated));
      } catch (e) {}
    }

    // Update in Supabase DB
    SupabaseService.updatePostCaption(postId, newCaption);
  };

  const handleSaveUser = (updatedUser: UserProfileType, isNewRegistration?: boolean) => {
    const cleanedUser = {
      ...updatedUser,
      nickname: normalizeNick(updatedUser.nickname)
    };
    setUser(cleanedUser);
    localStorage.setItem('yetti_user', JSON.stringify(cleanedUser));
    setShowAuthModal(false);
    if (isNewRegistration) {
      setShowOnboarding(true); // Open onboarding tutorial for new registrations!
    }
  };

  // Filter posts belonging to current user safely ignoring '@' and case
  const userPosts = posts.filter(p => {
    const postNick = normalizeNick(p.authorNickname);
    const userNick = normalizeNick(user.nickname);
    return postNick === userNick && userNick !== '';
  });

  return (
    <div className="yetti-app">
      {/* Top Bar Header */}
      <header className="yetti-header">
        <div className="yetti-logo" onClick={() => setActiveView('camera')}>
          <Zap size={20} color="#ffffff" fill="#ffffff" />
          <span>YETTI</span>
        </div>

        {/* User profile & Onboarding help button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#e2e8f0',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Qanday ishlaydi?"
          >
            <HelpCircle size={14} color="#94a3b8" />
            <span>Qanday ishlaydi?</span>
          </button>

          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <User size={14} color="#ffffff" />
            <span>@{user.nickname || 'kirish'}</span>
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
            onDeletePost={handleDeletePost}
            onEditCaption={handleEditCaption}
            currentUserNickname={user.nickname}
            onGoToCamera={() => setActiveView('camera')}
          />
        )}

        {activeView === 'profile' && (
          <UserProfile
            user={user}
            userPosts={userPosts}
            onDeletePost={handleDeletePost}
            onEditCaption={handleEditCaption}
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
            <Camera size={22} color={activeView === 'camera' ? '#ffffff' : '#64748b'} />
          </div>
          <span>Momental Kamera</span>
        </button>

        <button
          className={`tab-item ${activeView === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveView('feed')}
        >
          <div className="tab-icon-wrapper">
            <Flame size={22} color={activeView === 'feed' ? '#ffffff' : '#64748b'} />
          </div>
          <span>Tavsiyalar</span>
        </button>

        <button
          className={`tab-item ${activeView === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveView('profile')}
        >
          <div className="tab-icon-wrapper">
            <User size={22} color={activeView === 'profile' ? '#ffffff' : '#64748b'} />
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

      {/* Interactive Onboarding Tutorial */}
      {showOnboarding && (
        <OnboardingModal
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
};

export default App;

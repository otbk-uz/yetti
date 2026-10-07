import type { MediaPost, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Azizbek Rahimov',
  nickname: 'aziz_yetti',
  phone: '+998 90 123 45 67',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: '⚡ YETTI instant creator | Momental lahzalar',
  isLoggedIn: true
};

export const INITIAL_RECOMMENDATIONS: MediaPost[] = [
  {
    id: 'post-1',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    authorName: 'Malika Zokirova',
    authorNickname: 'malika_moments',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Hozirgina',
    likes: 184,
    commentsCount: 12,
    shares: 8,
    caption: 'Toshkent kechki shahar chiroqlari 🔥 #momental #yetti',
    filter: 'Vivid'
  },
  {
    id: 'post-2',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    authorName: 'Jasur Bek',
    authorNickname: 'jasur_vlog',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timestamp: '5 daqiqa oldin',
    likes: 412,
    commentsCount: 34,
    shares: 29,
    caption: 'Tabiat bag\'rida instant moment 🌿⚡',
    filter: 'Cyber'
  },
  {
    id: 'post-3',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&auto=format&fit=crop&q=80',
    authorName: 'Sevara Alimova',
    authorNickname: 'sevara_live',
    authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    timestamp: '12 daqiqa oldin',
    likes: 290,
    commentsCount: 18,
    shares: 14,
    caption: 'Qahva tanaffusi ☕ Momentally captured on YETTI',
    filter: 'Warm'
  },
  {
    id: 'post-4',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    authorName: 'Sardor Rustamov',
    authorNickname: 'sardor_motion',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    timestamp: '1 soat oldin',
    likes: 890,
    commentsCount: 76,
    shares: 51,
    caption: 'Dengiz to\'lqinlari momintal rolik 🌊',
    filter: 'Normal'
  }
];

export type MainView = 'camera' | 'feed' | 'profile';

export interface UserProfile {
  name: string;
  nickname: string;
  phone: string;
  avatar: string;
  password?: string;
  bio?: string;
  isLoggedIn: boolean;
  isRegistered?: boolean;
}

export interface MediaPost {
  id: string;
  type: 'photo' | 'video';
  mediaUrl: string;
  authorName: string;
  authorNickname: string;
  authorAvatar: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  shares: number;
  caption?: string;
  filter?: string;
  isLiked?: boolean;
}

import type { MediaPost, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Foydalanuvchi',
  nickname: 'yetti_user',
  phone: '+998 90 000 00 00',
  avatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="%230d0c12" stroke="%23d4af37" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  bio: '⚡ YETTI instant creator | Momental lahzalar',
  isLoggedIn: false,
  isRegistered: false
};

// Real system only: No fake photos/videos
export const INITIAL_RECOMMENDATIONS: MediaPost[] = [];


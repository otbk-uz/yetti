import { createClient } from '@supabase/supabase-js';
import type { MediaPost, UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompanyyetti.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'samplekey';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class SupabaseService {
  // 1. Fetch live posts from Supabase Postgres Database
  static async fetchRecommendationFeed(): Promise<MediaPost[]> {
    try {
      const { data, error } = await supabase
        .from('yetti_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Supabase DB notice:', error.message);
        return [];
      }

      if (data && data.length > 0) {
        return data.map(item => ({
          id: item.id,
          type: item.type,
          mediaUrl: item.media_url,
          authorName: item.author_name,
          authorNickname: item.author_nickname,
          authorAvatar: item.author_avatar,
          timestamp: new Date(item.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
          likes: item.likes_count || 0,
          commentsCount: item.comments_count || 0,
          shares: 0,
          caption: item.caption,
          filter: item.filter_name
        }));
      }
    } catch (err) {
      console.log('Supabase connection fallback:', err);
    }
    return [];
  }

  // 2. Save instant captured photo/video to Supabase Storage and Postgres Table
  static async uploadInstantPost(post: MediaPost): Promise<{ success: boolean; mediaUrl: string }> {
    try {
      let finalMediaUrl = post.mediaUrl;

      // If media is base64 data URL, upload to Supabase Storage bucket 'yetti-media'
      if (post.mediaUrl.startsWith('data:image')) {
        const fileName = `instant_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
        const res = await fetch(post.mediaUrl);
        const blob = await res.blob();

        const { data: storageData, error: storageErr } = await supabase.storage
          .from('yetti-media')
          .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true });

        if (!storageErr && storageData) {
          const { data: publicUrlData } = supabase.storage
            .from('yetti-media')
            .getPublicUrl(fileName);
          if (publicUrlData?.publicUrl) {
            finalMediaUrl = publicUrlData.publicUrl;
          }
        }
      }

      // Insert record into Supabase yetti_posts table
      const { error: dbErr } = await supabase
        .from('yetti_posts')
        .insert({
          author_name: post.authorName,
          author_nickname: post.authorNickname,
          author_avatar: post.authorAvatar,
          type: post.type,
          media_url: finalMediaUrl,
          caption: post.caption,
          filter_name: post.filter || 'oddiy',
          likes_count: post.likes || 1,
          comments_count: 0
        });

      if (!dbErr) {
        return { success: true, mediaUrl: finalMediaUrl };
      }
    } catch (e) {
      console.log('Supabase upload sync notice:', e);
    }
    return { success: true, mediaUrl: post.mediaUrl };
  }

  // 3. Check if nickname or phone number is already registered
  static async checkUserExists(nickname: string, phone: string, currentNick?: string): Promise<{ nicknameTaken: boolean; phoneTaken: boolean }> {
    const cleanNick = nickname.replace(/^@/, '').toLowerCase().trim();
    const cleanPhone = phone.replace(/\D/g, '').trim();

    let nicknameTaken = false;
    let phoneTaken = false;

    // Check local storage registered users registry
    let localUsers: UserProfile[] = [];
    const stored = localStorage.getItem('yetti_registered_users_db');
    if (stored) {
      try {
        localUsers = JSON.parse(stored);
      } catch (e) {}
    }

    const currentCleanNick = (currentNick || '').replace(/^@/, '').toLowerCase().trim();

    for (const u of localUsers) {
      const uNick = (u.nickname || '').replace(/^@/, '').toLowerCase().trim();
      const uPhone = (u.phone || '').replace(/\D/g, '').trim();

      // If editing existing profile, skip matching self
      if (currentCleanNick && uNick === currentCleanNick) {
        continue;
      }

      if (uNick === cleanNick && cleanNick !== '') {
        nicknameTaken = true;
      }
      if (uPhone === cleanPhone && cleanPhone.length > 5) {
        phoneTaken = true;
      }
    }

    // Check remote Supabase yetti_users table
    try {
      const { data } = await supabase.from('yetti_users').select('nickname, phone');
      if (data) {
        for (const u of data) {
          const uNick = (u.nickname || '').replace(/^@/, '').toLowerCase().trim();
          const uPhone = (u.phone || '').replace(/\D/g, '').trim();

          if (currentCleanNick && uNick === currentCleanNick) {
            continue;
          }

          if (uNick === cleanNick && cleanNick !== '') {
            nicknameTaken = true;
          }
          if (uPhone === cleanPhone && cleanPhone.length > 5) {
            phoneTaken = true;
          }
        }
      }
    } catch (e) {}

    return { nicknameTaken, phoneTaken };
  }

  // 4. Register user profile into Supabase yetti_users table and local registry
  static async registerUser(user: UserProfile): Promise<boolean> {
    try {
      // Maintain local registered users registry
      let localUsers: UserProfile[] = [];
      const stored = localStorage.getItem('yetti_registered_users_db');
      if (stored) {
        try {
          localUsers = JSON.parse(stored);
        } catch (e) {}
      }

      const cleanNick = user.nickname.replace(/^@/, '').toLowerCase().trim();
      const filtered = localUsers.filter(u => (u.nickname || '').replace(/^@/, '').toLowerCase().trim() !== cleanNick);
      filtered.push(user);
      localStorage.setItem('yetti_registered_users_db', JSON.stringify(filtered));

      const { error } = await supabase
        .from('yetti_users')
        .upsert({
          phone: user.phone,
          nickname: user.nickname,
          name: user.name,
          avatar: user.avatar
        }, { onConflict: 'nickname' });

      return !error;
    } catch (e) {
      return true;
    }
  }

  // 5. Update post likes in Supabase DB
  static async toggleLikePost(postId: string, newLikesCount: number): Promise<void> {
    try {
      await supabase
        .from('yetti_posts')
        .update({ likes_count: newLikesCount })
        .eq('id', postId);
    } catch (e) {
      console.log('Supabase like sync notice:', e);
    }
  }

  // 6. Delete post from Supabase DB
  static async deletePost(postId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('yetti_posts')
        .delete()
        .eq('id', postId);
      return !error;
    } catch (e) {
      return true;
    }
  }

  // 7. Update post caption in Supabase DB
  static async updatePostCaption(postId: string, newCaption: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('yetti_posts')
        .update({ caption: newCaption })
        .eq('id', postId);
      return !error;
    } catch (e) {
      return true;
    }
  }
}

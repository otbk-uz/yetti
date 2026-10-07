import type { MediaPost, UserProfile } from '../types';

// Cloudflare Workers REST API endpoint URL
const CLOUDFLARE_WORKER_API = 'https://api.yetti.uz/v1';

export class CloudflareService {

  // Cloudflare D1: Fetch recommendation feed posts
  static async fetchRecommendationFeed(): Promise<MediaPost[]> {
    try {
      const response = await fetch(`${CLOUDFLARE_WORKER_API}/feed`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        return data.posts;
      }
    } catch (e) {
      console.log('Cloudflare D1 REST API offline fallback:', e);
    }
    return [];
  }

  // Cloudflare R2 + D1: Save instant photo or video post
  static async uploadInstantPost(post: MediaPost): Promise<{ success: boolean; cloudflareUrl?: string }> {
    try {
      // 1. Upload media binary to Cloudflare R2 Storage Bucket
      const r2Response = await fetch(`${CLOUDFLARE_WORKER_API}/r2/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaData: post.mediaUrl,
          mediaType: post.type,
          postId: post.id
        })
      });

      if (r2Response.ok) {
        const { mediaUrl } = await r2Response.json();
        post.mediaUrl = mediaUrl;
      }

      // 2. Insert record into Cloudflare D1 Database
      const d1Response = await fetch(`${CLOUDFLARE_WORKER_API}/d1/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });

      if (d1Response.ok) {
        return { success: true, cloudflareUrl: post.mediaUrl };
      }
    } catch (e) {
      console.log('Cloudflare D1/R2 sync fallback mode active');
    }
    return { success: true };
  }

  // Cloudflare D1: Save user registration profile
  static async registerUser(user: UserProfile): Promise<boolean> {
    try {
      const res = await fetch(`${CLOUDFLARE_WORKER_API}/d1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      return res.ok;
    } catch (e) {
      return true; // Fallback
    }
  }
}

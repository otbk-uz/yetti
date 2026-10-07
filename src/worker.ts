/// <reference types="@cloudflare/workers-types" />

// Cloudflare Worker API Backend for YETTI Instant Platform (D1 Database)

export interface Env {
  DB: D1Database;
  MEDIA_BUCKET?: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. GET /v1/feed - Fetch D1 Database recommendation feed
      if (url.pathname === '/v1/feed' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM posts ORDER BY created_at DESC LIMIT 30'
        ).all();
        return new Response(JSON.stringify({ posts: results }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 2. POST /v1/d1/posts - Insert new post into Cloudflare D1
      if (url.pathname === '/v1/d1/posts' && request.method === 'POST') {
        const post = await request.json() as any;
        await env.DB.prepare(
          `INSERT INTO posts (id, author_name, author_nickname, author_avatar, type, media_url, caption, filter_name, likes_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          post.id,
          post.authorName,
          post.authorNickname,
          post.authorAvatar,
          post.type,
          post.mediaUrl,
          post.caption || '',
          post.filter || 'oddiy',
          post.likes || 1
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 3. POST /v1/r2/upload - Upload media
      if (url.pathname === '/v1/r2/upload' && request.method === 'POST') {
        const { mediaData, mediaType, postId } = await request.json() as any;
        const key = `yetti_${postId}.${mediaType === 'video' ? 'mp4' : 'jpg'}`;

        if (env.MEDIA_BUCKET) {
          const base64Data = mediaData.split(',')[1] || mediaData;
          const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          await env.MEDIA_BUCKET.put(key, binaryData, {
            httpMetadata: { contentType: mediaType === 'video' ? 'video/mp4' : 'image/jpeg' },
          });
        }

        return new Response(JSON.stringify({ success: true, mediaUrl: mediaData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 4. POST /v1/d1/users - Register user profile into Cloudflare D1
      if (url.pathname === '/v1/d1/users' && request.method === 'POST') {
        const user = await request.json() as any;
        await env.DB.prepare(
          `INSERT INTO users (id, phone, nickname, name, avatar)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(nickname) DO UPDATE SET phone=excluded.phone, name=excluded.name`
        ).bind(
          `user-${Date.now()}`,
          user.phone,
          user.nickname,
          user.name,
          user.avatar
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response('YETTI Cloudflare Worker D1 API Operational', { headers: corsHeaders });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

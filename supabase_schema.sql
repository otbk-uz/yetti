-- Supabase Database Schema for YETTI Instant Platform

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.yetti_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL UNIQUE,
    nickname TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Posts Table (Photos & Videos)
CREATE TABLE IF NOT EXISTS public.yetti_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_name TEXT NOT NULL,
    author_nickname TEXT NOT NULL,
    author_avatar TEXT,
    type TEXT CHECK (type IN ('photo', 'video')) NOT NULL,
    media_url TEXT NOT NULL,
    caption TEXT,
    filter_name TEXT DEFAULT 'oddiy',
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Comments Table
CREATE TABLE IF NOT EXISTS public.yetti_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.yetti_posts(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE public.yetti_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yetti_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yetti_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read yetti_users" ON public.yetti_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert yetti_users" ON public.yetti_users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read yetti_posts" ON public.yetti_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert yetti_posts" ON public.yetti_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update yetti_posts" ON public.yetti_posts FOR UPDATE USING (true);

CREATE POLICY "Allow public read yetti_comments" ON public.yetti_comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert yetti_comments" ON public.yetti_comments FOR INSERT WITH CHECK (true);

-- 5. Supabase Storage Bucket setup for media uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('yetti-media', 'yetti-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Yetti Media Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'yetti-media');
CREATE POLICY "Public Insert Yetti Media Bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'yetti-media');

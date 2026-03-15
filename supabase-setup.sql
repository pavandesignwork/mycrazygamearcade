-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Games table
CREATE TABLE games (
  id text PRIMARY KEY,
  title text NOT NULL,
  thumbnail text,
  embed_url text NOT NULL,
  category text DEFAULT 'other',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Anyone can read games" ON games FOR SELECT USING (true);

-- Allow public write (for your admin panel)
CREATE POLICY "Anyone can insert games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update games" ON games FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete games" ON games FOR DELETE USING (true);

-- Create storage bucket for thumbnails
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);

-- Allow public upload/read for thumbnails
CREATE POLICY "Anyone can upload thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'thumbnails');
CREATE POLICY "Anyone can read thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');

-- Supabase Storage Policies for issue_images bucket
-- Run this in Supabase SQL Editor after creating the bucket

-- 1. Allow public read access to images
CREATE POLICY "Public read access for issue images" ON storage.objects
FOR SELECT USING (bucket_id = 'issue_images');

-- 2. Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'issue_images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow users to update their own images
CREATE POLICY "Users can update own images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'issue_images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow users to delete their own images
CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'issue_images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
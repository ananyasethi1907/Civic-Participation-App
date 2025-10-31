-- Migration: 004_fix_rls_policies.sql
-- Description: Drop and recreate RLS policies with correct settings
-- Created: 2025-11-01

-- First, drop all existing policies
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON citizens;
DROP POLICY IF EXISTS "Allow anyone to view citizen profiles" ON citizens;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON citizens;

DROP POLICY IF EXISTS "Allow authenticated users to insert issues" ON issues;
DROP POLICY IF EXISTS "Allow anyone to view issues" ON issues;
DROP POLICY IF EXISTS "Allow users to update their own issues" ON issues;
DROP POLICY IF EXISTS "Allow users to delete their own issues" ON issues;

DROP POLICY IF EXISTS "Allow authenticated users to insert votes" ON votes;
DROP POLICY IF EXISTS "Allow anyone to view votes" ON votes;
DROP POLICY IF EXISTS "Allow users to delete their own votes" ON votes;
DROP POLICY IF EXISTS "Allow users to update their own votes" ON votes;

DROP POLICY IF EXISTS "Allow authenticated users to insert feedback" ON feedbacks;
DROP POLICY IF EXISTS "Allow anyone to view feedback" ON feedbacks;
DROP POLICY IF EXISTS "Allow users to delete their own feedback" ON feedbacks;

DROP POLICY IF EXISTS "Allow users to view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow system to insert notifications" ON notifications;
DROP POLICY IF EXISTS "Allow users to update their own notifications" ON notifications;

-- CITIZENS TABLE POLICIES (More permissive for auto-creation)
CREATE POLICY "Allow users to insert their own profile"
ON citizens
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow any authenticated user to insert

CREATE POLICY "Allow anyone to view citizen profiles"
ON citizens
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow users to update their own profile"
ON citizens
FOR UPDATE
TO authenticated
USING (citizen_id = auth.uid())
WITH CHECK (citizen_id = auth.uid());

-- ISSUES TABLE POLICIES (More permissive)
CREATE POLICY "Allow authenticated users to insert issues"
ON issues
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow any authenticated user to insert

CREATE POLICY "Allow anyone to view issues"
ON issues
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow users to update their own issues"
ON issues
FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow users to delete their own issues"
ON issues
FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- VOTES TABLE POLICIES
CREATE POLICY "Allow authenticated users to insert votes"
ON votes
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow any authenticated user

CREATE POLICY "Allow anyone to view votes"
ON votes
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow users to delete their own votes"
ON votes
FOR DELETE
TO authenticated
USING (citizen_id = auth.uid());

CREATE POLICY "Allow users to update their own votes"
ON votes
FOR UPDATE
TO authenticated
USING (citizen_id = auth.uid())
WITH CHECK (citizen_id = auth.uid());

-- FEEDBACKS TABLE POLICIES
CREATE POLICY "Allow authenticated users to insert feedback"
ON feedbacks
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow any authenticated user

CREATE POLICY "Allow anyone to view feedback"
ON feedbacks
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow users to delete their own feedback"
ON feedbacks
FOR DELETE
TO authenticated
USING (citizen_id = auth.uid());

-- NOTIFICATIONS TABLE POLICIES
CREATE POLICY "Allow users to view their own notifications"
ON notifications
FOR SELECT
TO authenticated
USING (citizen_id = auth.uid());

CREATE POLICY "Allow system to insert notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow users to update their own notifications"
ON notifications
FOR UPDATE
TO authenticated
USING (citizen_id = auth.uid())
WITH CHECK (citizen_id = auth.uid());

-- Migration: 003_add_rls_policies.sql
-- Description: Add Row Level Security policies for all tables
-- Created: 2025-11-01

-- Enable RLS on all tables
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- CITIZENS TABLE POLICIES
CREATE POLICY "Allow users to insert their own profile"
ON citizens
FOR INSERT
TO authenticated
WITH CHECK (citizen_id = auth.uid());

CREATE POLICY "Allow anyone to view citizen profiles"
ON citizens
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow users to update their own profile"
ON citizens
FOR UPDATE
TO authenticated
USING (citizen_id = auth.uid())
WITH CHECK (citizen_id = auth.uid());

-- ISSUES TABLE POLICIES
CREATE POLICY "Allow authenticated users to insert issues"
ON issues
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow anyone to view issues"
ON issues
FOR SELECT
TO public
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
WITH CHECK (citizen_id = auth.uid());

CREATE POLICY "Allow anyone to view votes"
ON votes
FOR SELECT
TO public
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
WITH CHECK (citizen_id = auth.uid());

CREATE POLICY "Allow anyone to view feedback"
ON feedbacks
FOR SELECT
TO public
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

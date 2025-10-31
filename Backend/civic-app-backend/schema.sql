-- Civic Participation App Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types for better data integrity
CREATE TYPE issue_status AS ENUM ('Pending', 'In Progress', 'Resolved');
CREATE TYPE vote_type AS ENUM ('Upvote', 'Downvote');

-- 1. Citizens Table
CREATE TABLE citizens (
    citizen_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    ward VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Issues Table
CREATE TABLE issues (
    issue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    location VARCHAR(255),
    status issue_status DEFAULT 'Pending',
    created_by UUID NOT NULL REFERENCES citizens(citizen_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Votes Table
CREATE TABLE votes (
    vote_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(issue_id) ON DELETE CASCADE,
    citizen_id UUID NOT NULL REFERENCES citizens(citizen_id) ON DELETE CASCADE,
    vote_type vote_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id, citizen_id) -- Prevent duplicate votes from same citizen on same issue
);

-- 4. Feedbacks Table
CREATE TABLE feedbacks (
    feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID NOT NULL REFERENCES citizens(citizen_id) ON DELETE CASCADE,
    issue_id UUID NOT NULL REFERENCES issues(issue_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Notifications Table
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID NOT NULL REFERENCES citizens(citizen_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX idx_issues_created_by ON issues(created_by);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);

CREATE INDEX idx_votes_issue_id ON votes(issue_id);
CREATE INDEX idx_votes_citizen_id ON votes(citizen_id);

CREATE INDEX idx_feedbacks_issue_id ON feedbacks(issue_id);
CREATE INDEX idx_feedbacks_citizen_id ON feedbacks(citizen_id);

CREATE INDEX idx_notifications_citizen_id ON notifications(citizen_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

CREATE INDEX idx_citizens_email ON citizens(email);
CREATE INDEX idx_citizens_ward ON citizens(ward);

-- Enable Row Level Security (RLS) for Supabase
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (you can customize these based on your needs)
-- Citizens can only see their own data
CREATE POLICY "Citizens can view own profile" ON citizens
    FOR SELECT USING (auth.uid()::text = citizen_id::text);

-- Anyone can view issues
CREATE POLICY "Anyone can view issues" ON issues
    FOR SELECT USING (true);

-- Citizens can create issues
CREATE POLICY "Citizens can create issues" ON issues
    FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);

-- Citizens can vote on issues
CREATE POLICY "Citizens can vote" ON votes
    FOR ALL USING (auth.uid()::text = citizen_id::text);

-- Citizens can add feedback
CREATE POLICY "Citizens can add feedback" ON feedbacks
    FOR ALL USING (auth.uid()::text = citizen_id::text);

-- Citizens can view their notifications
CREATE POLICY "Citizens can view own notifications" ON notifications
    FOR ALL USING (auth.uid()::text = citizen_id::text);
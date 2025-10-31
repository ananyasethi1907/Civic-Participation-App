-- Simplified Schema for Testing
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Citizens Table (simplified)
CREATE TABLE IF NOT EXISTS citizens (
    citizen_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    ward VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Issues Table (simplified)
CREATE TABLE IF NOT EXISTS issues (
    issue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Pending',
    created_by UUID REFERENCES citizens(citizen_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Votes Table (simplified)
CREATE TABLE IF NOT EXISTS votes (
    vote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES issues(issue_id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES citizens(citizen_id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id, citizen_id)
);

-- 4. Feedbacks Table (simplified)
CREATE TABLE IF NOT EXISTS feedbacks (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID REFERENCES citizens(citizen_id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(issue_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Notifications Table (simplified)
CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID REFERENCES citizens(citizen_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_issues_created_by ON issues(created_by);
CREATE INDEX IF NOT EXISTS idx_votes_issue_id ON votes(issue_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_issue_id ON feedbacks(issue_id);
CREATE INDEX IF NOT EXISTS idx_citizens_email ON citizens(email);
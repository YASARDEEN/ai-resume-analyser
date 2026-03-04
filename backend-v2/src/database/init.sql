-- Create Tables for AI ATS (Raw SQL)

-- Enable Extensions for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'candidate', -- 'candidate' or 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure RLS is handled (Disable it for easy development access via anon key)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;

-- Parsed Resumes Table
CREATE TABLE IF NOT EXISTS parsed_resumes (
  resume_id UUID PRIMARY KEY REFERENCES resumes(id) ON DELETE CASCADE,
  extracted_data JSONB NOT NULL,
  raw_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE parsed_resumes DISABLE ROW LEVEL SECURITY;

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  department VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active', -- 'active' or 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;

-- Keywords Table
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  keyword VARCHAR(100) NOT NULL,
  type VARCHAR(50) DEFAULT 'preferred', -- 'mandatory' or 'preferred'
  weight INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE keywords DISABLE ROW LEVEL SECURITY;

-- ATS Scores Table
CREATE TABLE IF NOT EXISTS ats_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  confidence FLOAT DEFAULT 0.0,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ats_scores DISABLE ROW LEVEL SECURITY;

-- Analytics Logs Table
CREATE TABLE IF NOT EXISTS analytics_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE analytics_logs DISABLE ROW LEVEL SECURITY;

-- Seed Admin User
INSERT INTO users (name, email, password, role)
VALUES ('yasar', 'yasardeen25@gmail.com', '$2b$12$ccfKiO8MgErhnGLIV1Qblux8Wo92Nx5D5GX6NqmKdhKXkZPun24Wm', 'admin')
ON CONFLICT (email) 
DO UPDATE SET password = EXCLUDED.password, role = 'admin';

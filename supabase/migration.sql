-- ===================================================
-- AI Chatbot — Supabase Database Migration
-- Run this in the Supabase SQL Editor
-- ===================================================

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module TEXT NOT NULL CHECK (module IN ('study_buddy', 'placement_prep', 'feedback')),
  title TEXT DEFAULT 'New Chat',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Study materials
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  extracted_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Feedback responses
CREATE TABLE IF NOT EXISTS feedback_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('course', 'faculty', 'event', 'general')),
  subject TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===================================================
-- Row Level Security (RLS)
-- ===================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Chat sessions: users can CRUD their own sessions
CREATE POLICY "Users can manage own sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Chat messages: users can access messages from their sessions
CREATE POLICY "Users can manage messages in own sessions" ON chat_messages
  FOR ALL USING (
    session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
  );

-- Study materials: users can manage their own materials
CREATE POLICY "Users can manage own materials" ON study_materials
  FOR ALL USING (auth.uid() = user_id);

-- Feedback: users can insert and read their own feedback
CREATE POLICY "Users can manage own feedback" ON feedback_responses
  FOR ALL USING (auth.uid() = user_id);

-- Admin can read all feedback (for analytics)
CREATE POLICY "Admins can read all feedback" ON feedback_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ===================================================
-- Auto-create profile on signup (trigger)
-- ===================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists to avoid errors on re-run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================================================
-- Storage bucket (run this separately or via dashboard)
-- Create a bucket called 'study-materials' in Supabase Storage
-- ===================================================

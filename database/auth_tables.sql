-- Create students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  student_id VARCHAR(20) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counsellors table
CREATE TABLE counsellors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  license_number VARCHAR(50) UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_counsellors_email ON counsellors(email);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE counsellors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students
CREATE POLICY "Students can view their own data"
ON students FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update their own data"
ON students FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for counsellors
CREATE POLICY "Counsellors can view their own data"
ON counsellors FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Counsellors can update their own data"
ON counsellors FOR UPDATE USING (auth.uid() = id);

-- Admin policies for counsellors
CREATE POLICY "Admin counsellors can view all data"
ON students FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM counsellors 
    WHERE counsellors.id = auth.uid() 
    AND counsellors.is_admin = true
  )
);

CREATE POLICY "Admin counsellors can view all counsellors"
ON counsellors FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM counsellors 
    WHERE counsellors.id = auth.uid() 
    AND counsellors.is_admin = true
  )
);
-- Create reading_progress table to track user reading progress
CREATE TABLE public.reading_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id TEXT NOT NULL,
  current_chapter INTEGER NOT NULL DEFAULT 1,
  scroll_position NUMERIC DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Enable Row Level Security
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own reading progress
CREATE POLICY "Users can view their own reading progress"
ON public.reading_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own reading progress
CREATE POLICY "Users can create their own reading progress"
ON public.reading_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own reading progress
CREATE POLICY "Users can update their own reading progress"
ON public.reading_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own reading progress
CREATE POLICY "Users can delete their own reading progress"
ON public.reading_progress
FOR DELETE
USING (auth.uid() = user_id);
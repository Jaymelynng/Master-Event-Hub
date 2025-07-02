-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create gyms table
CREATE TABLE public.gyms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  address TEXT,
  phone TEXT,
  booking_page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event types table
CREATE TABLE public.event_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  color TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false,
  min_required INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gym event type URLs table
CREATE TABLE public.gym_event_type_urls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
  event_type_id UUID REFERENCES public.event_types(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gym_id, event_type_id)
);

-- Create events table
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
  event_type_id UUID REFERENCES public.event_types(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  price TEXT,
  day_of_week TEXT,
  specific_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_gym_id ON public.events(gym_id);
CREATE INDEX idx_events_event_type_id ON public.events(event_type_id);
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_gym_event_type_urls_gym_id ON public.gym_event_type_urls(gym_id);
CREATE INDEX idx_gym_event_type_urls_event_type_id ON public.gym_event_type_urls(event_type_id);

-- Insert the 4 event categories
INSERT INTO public.event_types (name, display_name, color, is_required, min_required) VALUES
('KIDS NIGHT OUT', 'KIDS NIGHT OUT', '#fef7f0', true, 2),
('CLINIC', 'CLINIC', '#f3e8ff', true, 1),
('OPEN GYM', 'OPEN GYM', '#f0fdf4', true, 1),
('Summer Camp', 'Summer Camp', '#eff6ff', false, 0);

-- Enable RLS on all tables
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_event_type_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for read access (everyone can read)
CREATE POLICY "Enable read access for all users" ON public.gyms FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.event_types FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.gym_event_type_urls FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.events FOR SELECT USING (true);

-- Create a view for events with all details
CREATE VIEW public.events_with_details AS
SELECT 
  e.id,
  e.title,
  e.event_date,
  e.event_time,
  e.price,
  e.day_of_week,
  e.specific_url,
  e.created_at,
  e.updated_at,
  g.name as gym_name,
  g.address as gym_address,
  g.phone as gym_phone,
  g.booking_page_url as gym_booking_page,
  et.name as event_type,
  et.display_name as event_type_display,
  et.color as event_type_color,
  et.is_required,
  et.min_required
FROM public.events e
JOIN public.gyms g ON e.gym_id = g.id
JOIN public.event_types et ON e.event_type_id = et.id
ORDER BY e.event_date, e.event_time;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_gyms_updated_at
  BEFORE UPDATE ON public.gyms
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_gym_event_type_urls_updated_at
  BEFORE UPDATE ON public.gym_event_type_urls
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- First, let's check what gyms and event types exist
SELECT 'Existing Gyms:' as info;
SELECT name FROM public.gyms ORDER BY name;

SELECT 'Existing Event Types:' as info;
SELECT name, display_name FROM public.event_types ORDER BY name;

-- Insert the required gyms if they don't exist
INSERT INTO public.gyms (name, address, phone, booking_page_url)
SELECT * FROM (VALUES 
  ('Capital Gymnastics - Cedar Park', 'Cedar Park, TX', '', 'https://portal.iclasspro.com/capgymavery'),
  ('Capital Gymnastics - Pflugerville', 'Pflugerville, TX', '', 'https://portal.iclasspro.com/capgymhp'),
  ('Capital Gymnastics - Round Rock', 'Round Rock, TX', '', 'https://portal.iclasspro.com/capgymroundrock')
) AS new_gyms(name, address, phone, booking_page_url)
WHERE NOT EXISTS (
  SELECT 1 FROM public.gyms WHERE gyms.name = new_gyms.name
);

-- Verify gyms were inserted
SELECT 'Gyms after insert:' as info;
SELECT name, address FROM public.gyms ORDER BY name;

-- Verify event types exist (they should from the setup script)
SELECT 'Event types verification:' as info;
SELECT name, display_name, is_required, min_required FROM public.event_types ORDER BY name;

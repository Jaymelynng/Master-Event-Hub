-- First, let's see ALL gyms in your database
SELECT 'ALL GYMS IN DATABASE:' as info, COUNT(*) as total_gyms FROM public.gyms;

SELECT name, address, created_at FROM public.gyms ORDER BY name;

-- Check ALL events by month to see what data you actually have
SELECT 
  'EVENTS BY MONTH:' as info,
  EXTRACT(YEAR FROM event_date) as year,
  EXTRACT(MONTH FROM event_date) as month,
  COUNT(*) as event_count
FROM public.events 
GROUP BY EXTRACT(YEAR FROM event_date), EXTRACT(MONTH FROM event_date)
ORDER BY year, month;

-- Check which gyms have events and in what months
SELECT 
  'GYMS WITH EVENTS:' as info,
  g.name as gym_name,
  EXTRACT(YEAR FROM e.event_date) as year,
  EXTRACT(MONTH FROM e.event_date) as month,
  COUNT(*) as events_in_month
FROM public.events e
JOIN public.gyms g ON e.gym_id = g.id
GROUP BY g.name, EXTRACT(YEAR FROM e.event_date), EXTRACT(MONTH FROM e.event_date)
ORDER BY g.name, year, month;

-- Show gyms that have NO events at all
SELECT 
  'GYMS WITH NO EVENTS:' as info,
  g.name as gym_name
FROM public.gyms g
LEFT JOIN public.events e ON g.id = e.gym_id
WHERE e.id IS NULL
ORDER BY g.name;

-- Check all gyms in the database
SELECT 'ALL GYMS IN DATABASE:' as section;
SELECT name, address FROM public.gyms ORDER BY name;

-- Check all events by gym for July 2025
SELECT 'JULY 2025 EVENTS BY GYM:' as section;
SELECT 
  g.name as gym_name,
  COUNT(*) as event_count,
  STRING_AGG(DISTINCT et.display_name, ', ') as event_types
FROM public.events e
JOIN public.gyms g ON e.gym_id = g.id  
JOIN public.event_types et ON e.event_type_id = et.id
WHERE e.event_date >= '2025-07-01' AND e.event_date < '2025-08-01'
GROUP BY g.name
ORDER BY g.name;

-- Check what months have events for each gym
SELECT 'EVENTS BY MONTH AND GYM:' as section;
SELECT 
  g.name as gym_name,
  EXTRACT(YEAR FROM e.event_date) as year,
  EXTRACT(MONTH FROM e.event_date) as month,
  COUNT(*) as event_count
FROM public.events e
JOIN public.gyms g ON e.gym_id = g.id
GROUP BY g.name, EXTRACT(YEAR FROM e.event_date), EXTRACT(MONTH FROM e.event_date)
ORDER BY g.name, year, month;

-- Show total events per gym (all months)
SELECT 'TOTAL EVENTS PER GYM (ALL MONTHS):' as section;
SELECT 
  g.name as gym_name,
  COUNT(*) as total_events
FROM public.events e
JOIN public.gyms g ON e.gym_id = g.id
GROUP BY g.name
ORDER BY total_events DESC;

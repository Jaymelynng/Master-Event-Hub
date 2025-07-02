-- Check total counts
SELECT 
  'Database Summary' as section,
  (SELECT COUNT(*) FROM public.gyms) as total_gyms,
  (SELECT COUNT(*) FROM public.events) as total_events,
  (SELECT COUNT(*) FROM public.events WHERE event_date >= '2025-07-01' AND event_date < '2025-08-01') as july_events;

-- Show all gyms
SELECT 'All Gyms:' as section, name, address FROM public.gyms ORDER BY name;

-- Show all event types  
SELECT 'Event Types:' as section, name, display_name FROM public.event_types ORDER BY name;

-- Show July events specifically
SELECT 
  'July 2025 Events:' as section,
  g.name as gym_name,
  et.display_name as event_type,
  e.title,
  e.event_date,
  e.event_time,
  e.price
FROM public.events e
JOIN public.gyms g ON e.gym_id = g.id  
JOIN public.event_types et ON e.event_type_id = et.id
WHERE e.event_date >= '2025-07-01' AND e.event_date < '2025-08-01'
ORDER BY e.event_date, g.name;

-- Show recent events (last 10 inserted)
SELECT 
  'Recent Events:' as section,
  g.name as gym_name,
  e.title,
  e.event_date,
  e.created_at
FROM public.events e
JOIN public.gyms g ON e.gym_id = g.id
ORDER BY e.created_at DESC
LIMIT 10;

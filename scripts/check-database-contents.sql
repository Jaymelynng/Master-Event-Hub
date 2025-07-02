-- Check what's actually in the database
SELECT 
  'gyms' as table_name,
  COUNT(*) as row_count
FROM public.gyms

UNION ALL

SELECT 
  'events' as table_name,
  COUNT(*) as row_count  
FROM public.events

UNION ALL

SELECT 
  'events_with_details' as table_name,
  COUNT(*) as row_count
FROM public.events_with_details;

-- Show sample events to verify data
SELECT 
  gym_name,
  title,
  event_date,
  event_type
FROM public.events_with_details
ORDER BY event_date
LIMIT 10;

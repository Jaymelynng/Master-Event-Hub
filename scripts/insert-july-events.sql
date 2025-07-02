-- Insert July events for Capital Gymnastics - Cedar Park
INSERT INTO public.events (gym_id, event_type_id, title, event_date, event_time, price, day_of_week, specific_url)
SELECT 
  g.id as gym_id,
  et.id as event_type_id,
  'Christmas in July - Kids Night Out' as title,
  DATE '2025-07-11' as event_date,
  '6:30 PM - 9:30 PM' as event_time,
  '$35' as price,
  'Friday' as day_of_week,
  'https://portal.iclasspro.com/capgymavery/booking/kids-night-out/christmas-july' as specific_url
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Under the Sea - Kids Night Out', DATE '2025-07-18', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/capgymavery/booking/kids-night-out/under-the-sea'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Handstand and Cartwheel Clinic', DATE '2025-07-10', '7:00 PM - 7:55 PM', '$25', 'Thursday',
  'https://portal.iclasspro.com/capgymavery/camps/7?sortBy=time'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'CLINIC'

UNION ALL

SELECT 
  g.id, et.id, 'Cartwheel Clinic', DATE '2025-07-24', '7:00 PM - 7:55 PM', '$25', 'Thursday',
  'https://portal.iclasspro.com/capgymavery/camps/7?sortBy=time'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'CLINIC'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym | Ages 6-17 | July 11th', DATE '2025-07-11', '6:00 PM - 7:30 PM', '$15', 'Friday',
  'https://portal.iclasspro.com/capgymavery/camps/17?sortBy=time'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym | Ages 6-17 | July 25th', DATE '2025-07-25', '6:00 PM - 7:30 PM', '$15', 'Friday',
  'https://portal.iclasspro.com/capgymavery/camps/17?sortBy=time'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'ART WORKSHOP', DATE '2025-07-01', '9:00 AM - 3:00 PM', '$295', 'Tuesday',
  'https://portal.iclasspro.com/capgymavery/camp-details/1029'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'Summer Camp'

UNION ALL

SELECT 
  g.id, et.id, 'DOWN ON THE FARM', DATE '2025-07-07', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/capgymavery/camp-details/1031'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'Summer Camp'

UNION ALL

SELECT 
  g.id, et.id, 'CHRISTMAS IN JULY', DATE '2025-07-14', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/capgymavery/camp-details/1033'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'Summer Camp'

UNION ALL

SELECT 
  g.id, et.id, 'UNDER THE SEA', DATE '2025-07-21', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/capgymavery/camp-details/1035'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'Summer Camp'

UNION ALL

SELECT 
  g.id, et.id, 'DRESS UP & SPIRIT WEEK', DATE '2025-07-28', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/capgymavery/camp-details/1037'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Cedar Park' AND et.name = 'Summer Camp'

-- Capital Gymnastics - Pflugerville July Events
UNION ALL

SELECT 
  g.id, et.id, 'WELCOME TO THE JUNGLE: Kids Night Out', DATE '2025-07-11', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/capgymhp/booking/kids-night-out/jungle'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Pflugerville' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'WILD WEST: Kids Night Out', DATE '2025-07-25', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/capgymhp/booking/kids-night-out/wild-west'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Pflugerville' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym | Ages 6-17 | July 11th', DATE '2025-07-11', '6:00 PM - 7:30 PM', '$15', 'Friday',
  'https://portal.iclasspro.com/capgymhp/camps/81?sortBy=name'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Pflugerville' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym | Ages 6-17 | July 25th', DATE '2025-07-25', '6:00 PM - 7:30 PM', '$15', 'Friday',
  'https://portal.iclasspro.com/capgymhp/camps/81?sortBy=name'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Pflugerville' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'Superhero Week', DATE '2025-07-07', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/capgymhp/camp-details/2345'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Pflugerville' AND et.name = 'Summer Camp'

UNION ALL

SELECT 
  g.id, et.id, 'Welcome to the Jungle', DATE '2025-07-14', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/capgymhp/camp-details/2349'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Pflugerville' AND et.name = 'Summer Camp'

UNION ALL

SELECT 
  g.id, et.id, 'Wild West Week', DATE '2025-07-21', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/capgymhp/camp-details/2353'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Pflugerville' AND et.name = 'Summer Camp'

UNION ALL

SELECT 
  g.id, et.id, 'LEGOLAND', DATE '2025-07-28', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/capgymhp/camp-details/2357'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Pflugerville' AND et.name = 'Summer Camp'

-- Capital Gymnastics - Round Rock July Events
UNION ALL

SELECT 
  g.id, et.id, 'Neon Nerf Battle Night | Kids Night Out', DATE '2025-07-11', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/capgymroundrock/booking/kids-night-out/neon-nerf'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Round Rock' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Neon Rave Night | Kids Night Out', DATE '2025-07-25', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/capgymroundrock/booking/kids-night-out/neon-rave'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Round Rock' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Beginner Dance Clinic', DATE '2025-07-18', '6:30 PM - 7:30 PM', '$25', 'Friday',
  'https://portal.iclasspro.com/capgymroundrock/camps/28?sortBy=time'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Round Rock' AND et.name = 'CLINIC'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym | Ages 6-17 | July 11th', DATE '2025-07-11', '6:00 PM - 7:30 PM', '$15', 'Friday',
  'https://portal.iclasspro.com/capgymroundrock/camps/35?sortBy=time'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Round Rock' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym | Ages 6-17 | July 25th', DATE '2025-07-25', '6:00 PM - 7:30 PM', '$15', 'Friday',
  'https://portal.iclasspro.com/capgymroundrock/camps/35?sortBy=time'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Round Rock' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'Color Wars Week', DATE '2025-07-01', '9:00 AM - 3:00 PM', '$295', 'Tuesday',
  'https://portal.iclasspro.com/capgymroundrock/camp-details/1396'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Capital Gymnastics - Round Rock' AND et.name = 'Summer Camp';

-- Insert all the missing gyms first
INSERT INTO public.gyms (name, address, phone, booking_page_url)
SELECT * FROM (VALUES 
  ('Houston Gymnastics Academy', '5201 Gulfton St., Houston, TX 77081', '(713) 668-6001', 'https://portal.iclasspro.com/houstongymnastics'),
  ('Estrella Gymnastics', 'Houston, TX', '', 'https://portal.iclasspro.com/estrellagymnastics'),
  ('Oasis Gymnastics', 'Houston, TX', '', 'https://portal.iclasspro.com/oasisgymnastics'),
  ('Scottsdale Gymnastics', 'Scottsdale, AZ', '', 'https://portal.iclasspro.com/scottsdalegymnastics'),
  ('Tigar Gymnastics', '', '', 'https://portal.iclasspro.com/tigar'),
  ('Rowland Ballard - Atascocita', 'Atascocita, TX', '', 'https://portal.iclasspro.com/rbatascocita'),
  ('Rowland Ballard - Kingwood', 'Kingwood, TX', '', 'https://portal.iclasspro.com/rbkingwood')
) AS new_gyms(name, address, phone, booking_page_url)
WHERE NOT EXISTS (
  SELECT 1 FROM public.gyms WHERE gyms.name = new_gyms.name
);

-- Now add July events for Houston Gymnastics Academy
INSERT INTO public.events (gym_id, event_type_id, title, event_date, event_time, price, day_of_week, specific_url)
SELECT 
  g.id as gym_id,
  et.id as event_type_id,
  'Superhero Training - Kids Night Out' as title,
  DATE '2025-07-11' as event_date,
  '6:00 PM - 9:00 PM' as event_time,
  '$35' as price,
  'Friday' as day_of_week,
  'https://portal.iclasspro.com/houstongymnastics/camps/7' as specific_url
FROM public.gyms g, public.event_types et
WHERE g.name = 'Houston Gymnastics Academy' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Princess & Pirates - Kids Night Out', DATE '2025-07-25', '6:00 PM - 9:00 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/houstongymnastics/camps/7'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Houston Gymnastics Academy' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Tumbling Skills Clinic', DATE '2025-07-10', '7:00 PM - 8:00 PM', '$25', 'Thursday',
  'https://portal.iclasspro.com/houstongymnastics/camps/2'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Houston Gymnastics Academy' AND et.name = 'CLINIC'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym Session', DATE '2025-07-12', '10:00 AM - 11:30 AM', '$15', 'Saturday',
  'https://portal.iclasspro.com/houstongymnastics/camps/15'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Houston Gymnastics Academy' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym Session', DATE '2025-07-26', '10:00 AM - 11:30 AM', '$15', 'Saturday',
  'https://portal.iclasspro.com/houstongymnastics/camps/15'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Houston Gymnastics Academy' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'Superhero Training Camp', DATE '2025-07-07', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/houstongymnastics/camp-details/738'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Houston Gymnastics Academy' AND et.name = 'Summer Camp'

UNION ALL

SELECT 
  g.id, et.id, 'Princess & Pirates Camp', DATE '2025-07-21', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/houstongymnastics/camp-details/739'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Houston Gymnastics Academy' AND et.name = 'Summer Camp'

-- Estrella Gymnastics July Events
UNION ALL

SELECT 
  g.id, et.id, 'Glow Party - Kids Night Out', DATE '2025-07-18', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/estrellagymnastics/camps/3'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Estrella Gymnastics' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Handstand Workshop', DATE '2025-07-17', '6:30 PM - 7:30 PM', '$25', 'Thursday',
  'https://portal.iclasspro.com/estrellagymnastics/camps/24'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Estrella Gymnastics' AND et.name = 'CLINIC'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym Fun', DATE '2025-07-19', '10:00 AM - 11:30 AM', '$15', 'Saturday',
  'https://portal.iclasspro.com/estrellagymnastics/camps/99'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Estrella Gymnastics' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'Space Adventure Camp', DATE '2025-07-14', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/estrellagymnastics/camp-details/453'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Estrella Gymnastics' AND et.name = 'Summer Camp'

-- Oasis Gymnastics July Events
UNION ALL

SELECT 
  g.id, et.id, 'Movie Night - Kids Night Out', DATE '2025-07-11', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/oasisgymnastics/camps/27'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Oasis Gymnastics' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Cartwheel Clinic', DATE '2025-07-24', '6:30 PM - 7:30 PM', '$25', 'Thursday',
  'https://portal.iclasspro.com/oasisgymnastics/camps/33'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Oasis Gymnastics' AND et.name = 'CLINIC'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym Session', DATE '2025-07-12', '10:00 AM - 11:30 AM', '$15', 'Saturday',
  'https://portal.iclasspro.com/oasisgymnastics/camps/60'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Oasis Gymnastics' AND et.name = 'OPEN GYM'

-- Scottsdale Gymnastics July Events
UNION ALL

SELECT 
  g.id, et.id, 'Desert Adventure - Kids Night Out', DATE '2025-07-25', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/scottsdalegymnastics/camps/32'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Scottsdale Gymnastics' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Back Walkover Clinic', DATE '2025-07-31', '6:30 PM - 7:30 PM', '$25', 'Thursday',
  'https://portal.iclasspro.com/scottsdalegymnastics/camps/28'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Scottsdale Gymnastics' AND et.name = 'CLINIC'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym Fun', DATE '2025-07-19', '11:00 AM - 12:30 PM', '$15', 'Saturday',
  'https://portal.iclasspro.com/scottsdalegymnastics/camps/88'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Scottsdale Gymnastics' AND et.name = 'OPEN GYM'

-- Tigar Gymnastics July Events
UNION ALL

SELECT 
  g.id, et.id, 'Ninja Night - Kids Night Out', DATE '2025-07-18', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/tigar/camps/8'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Tigar Gymnastics' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Flexibility Clinic', DATE '2025-07-17', '6:30 PM - 7:30 PM', '$25', 'Thursday',
  'https://portal.iclasspro.com/tigar/camps/2'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Tigar Gymnastics' AND et.name = 'CLINIC'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym Session', DATE '2025-07-26', '9:00 AM - 10:30 AM', '$15', 'Saturday',
  'https://portal.iclasspro.com/tigar/camps/22'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Tigar Gymnastics' AND et.name = 'OPEN GYM'

-- Rowland Ballard - Atascocita July Events
UNION ALL

SELECT 
  g.id, et.id, 'Summer Splash - Kids Night Out', DATE '2025-07-11', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/rbatascocita/camps/35'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Rowland Ballard - Atascocita' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Tropical Paradise - Kids Night Out', DATE '2025-07-25', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/rbatascocita/camps/35'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Rowland Ballard - Atascocita' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Round-off Clinic', DATE '2025-07-10', '6:30 PM - 7:30 PM', '$25', 'Thursday',
  'https://portal.iclasspro.com/rbatascocita/camps/33'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Rowland Ballard - Atascocita' AND et.name = 'CLINIC'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym Session', DATE '2025-07-12', '10:00 AM - 11:30 AM', '$15', 'Saturday',
  'https://portal.iclasspro.com/rbatascocita/camps/76'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Rowland Ballard - Atascocita' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'Summer Splash Camp', DATE '2025-07-07', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/rbatascocita/camps'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Rowland Ballard - Atascocita' AND et.name = 'Summer Camp'

-- Rowland Ballard - Kingwood July Events
UNION ALL

SELECT 
  g.id, et.id, 'Glow in the Dark - Kids Night Out', DATE '2025-07-18', '6:30 PM - 9:30 PM', '$35', 'Friday',
  'https://portal.iclasspro.com/rbkingwood/camps/26'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Rowland Ballard - Kingwood' AND et.name = 'KIDS NIGHT OUT'

UNION ALL

SELECT 
  g.id, et.id, 'Bridge Kickover Clinic', DATE '2025-07-24', '6:30 PM - 7:30 PM', '$25', 'Thursday',
  'https://portal.iclasspro.com/rbkingwood/camps/31'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Rowland Ballard - Kingwood' AND et.name = 'CLINIC'

UNION ALL

SELECT 
  g.id, et.id, 'Open Gym Session', DATE '2025-07-19', '10:00 AM - 11:30 AM', '$15', 'Saturday',
  'https://portal.iclasspro.com/rbkingwood/camps/6'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Rowland Ballard - Kingwood' AND et.name = 'OPEN GYM'

UNION ALL

SELECT 
  g.id, et.id, 'Glow Party Camp', DATE '2025-07-21', '9:00 AM - 3:00 PM', '$295', 'Monday',
  'https://portal.iclasspro.com/rbkingwood/camps'
FROM public.gyms g, public.event_types et
WHERE g.name = 'Rowland Ballard - Kingwood' AND et.name = 'Summer Camp';

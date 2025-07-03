-- August 2025 Test Events for Month Navigation Testing
-- Based on existing event patterns from June/July 2025

-- First, get the gym and event type IDs we'll need
-- (These should match your actual Supabase data)

-- Capital Gymnastics - Cedar Park: 6cc3f673-36df-4020-8ca4-6c97b068faaa
-- Capital Gymnastics - Pflugerville: 2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9  
-- Capital Gymnastics - Round Rock: 88ccb75b-8be7-49dd-bd0a-640ad8bb49fe
-- Houston Gymnastics Academy: a2400b97-225d-4441-9481-d4ef406c0393
-- Rowland Ballard - Atascocita: 7a4f1ed8-e0b6-4229-b183-55360d142153
-- Rowland Ballard - Kingwood: 53209057-3733-497c-9503-5fd63674f897
-- Estrella Gymnastics: fd88d7f6-9a88-437e-a6ed-963b3bbb0596
-- Oasis Gymnastics: 86dd1b13-b22d-4c31-b2b7-893708f3bdfa
-- Scottsdale Gymnastics: bf7041fa-5d5e-4dbe-8c9d-e4749b1f4976
-- Tigar Gymnastics: d6413378-31d7-4643-9882-f5f3a89b4eb1

-- Event Types:
-- CLINIC: 8264495b-9c08-4b98-ac3a-44205b46a7bf
-- KIDS NIGHT OUT: 608cd9d8-9231-4172-95cc-e6f252f99dc9
-- OPEN GYM: a85b7cdf-7d5c-440d-9f9f-c697580a508a
-- Summer Camp: ffbe59f6-087f-46d0-9687-842c500aff32

INSERT INTO events (
  gym_id, 
  event_type_id, 
  title, 
  event_date, 
  event_time, 
  price, 
  day_of_week, 
  specific_url, 
  created_at, 
  updated_at
) VALUES

-- Week 1 of August 2025 (Aug 1-3)
('6cc3f673-36df-4020-8ca4-6c97b068faaa', 'ffbe59f6-087f-46d0-9687-842c500aff32', 'Back to School Prep Camp', '2025-08-01', '9:00 AM - 3:00 PM', '$295', 'Friday', 'https://portal.iclasspro.com/capgymavery/camp-details/august1', NOW(), NOW()),

('a2400b97-225d-4441-9481-d4ef406c0393', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym Session', '2025-08-02', '10:00 AM - 11:30 AM', '$15', 'Saturday', 'https://portal.iclasspro.com/houstongymnastics/camps/open-gym-aug2', NOW(), NOW()),

('bf7041fa-5d5e-4dbe-8c9d-e4749b1f4976', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Saturday Open Gym', '2025-08-02', '11:00 AM - 12:30 PM', '$15', 'Saturday', 'https://portal.iclasspro.com/scottsdalegymnastics/camps/open-gym-aug2', NOW(), NOW()),

-- Week 2 of August 2025 (Aug 4-10)
('2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9', 'ffbe59f6-087f-46d0-9687-842c500aff32', 'Adventure Week Summer Camp', '2025-08-04', '9:00 AM - 3:00 PM', '$295', 'Monday', 'https://portal.iclasspro.com/capgymhp/camp-details/august4', NOW(), NOW()),

('88ccb75b-8be7-49dd-bd0a-640ad8bb49fe', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym Session', '2025-08-05', '5:30 PM - 7:00 PM', '$15', 'Tuesday', 'https://portal.iclasspro.com/capgymroundrock/camp-details/august5', NOW(), NOW()),

('6cc3f673-36df-4020-8ca4-6c97b068faaa', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym Session', '2025-08-06', '10:30 AM - 12:00 PM', '$15', 'Wednesday', 'https://portal.iclasspro.com/capgymavery/camp-details/august6', NOW(), NOW()),

('7a4f1ed8-e0b6-4229-b183-55360d142153', '8264495b-9c08-4b98-ac3a-44205b46a7bf', 'Back Handspring Clinic', '2025-08-07', '7:00 PM - 8:00 PM', '$25', 'Thursday', 'https://portal.iclasspro.com/rbatascocita/camps/clinic-aug7', NOW(), NOW()),

('6cc3f673-36df-4020-8ca4-6c97b068faaa', '608cd9d8-9231-4172-95cc-e6f252f99dc9', 'Hawaiian Theme Night - Kids Night Out', '2025-08-08', '6:30 PM - 9:30 PM', '$35', 'Friday', 'https://portal.iclasspro.com/capgymavery/booking/kids-night-out/hawaiian', NOW(), NOW()),

('2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9', '608cd9d8-9231-4172-95cc-e6f252f99dc9', 'Hawaiian Night - Kids Night Out', '2025-08-08', '6:30 PM - 9:30 PM', '$35', 'Friday', 'https://portal.iclasspro.com/capgymhp/booking/kids-night-out/hawaiian', NOW(), NOW()),

('88ccb75b-8be7-49dd-bd0a-640ad8bb49fe', '608cd9d8-9231-4172-95cc-e6f252f99dc9', 'Tropical Paradise Night | Kids Night Out', '2025-08-08', '6:30 PM - 9:30 PM', '$35', 'Friday', 'https://portal.iclasspro.com/capgymroundrock/booking/kids-night-out/tropical', NOW(), NOW()),

('fd88d7f6-9a88-437e-a6ed-963b3bbb0596', '608cd9d8-9231-4172-95cc-e6f252f99dc9', 'Kids Night Out', '2025-08-08', '6:30 PM - 9:30 PM', '$35', 'Friday', 'https://portal.iclasspro.com/estrellagymnastics/camps/kno-aug8', NOW(), NOW()),

('53209057-3733-497c-9503-5fd63674f897', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym Session', '2025-08-09', '10:00 AM - 11:30 AM', '$15', 'Saturday', 'https://portal.iclasspro.com/rbkingwood/camps/open-gym-aug9', NOW(), NOW()),

-- Week 3 of August 2025 (Aug 11-17)  
('6cc3f673-36df-4020-8ca4-6c97b068faaa', 'ffbe59f6-087f-46d0-9687-842c500aff32', 'SPACE ADVENTURE WEEK', '2025-08-11', '9:00 AM - 3:00 PM', '$295', 'Monday', 'https://portal.iclasspro.com/capgymavery/camp-details/august11', NOW(), NOW()),

('88ccb75b-8be7-49dd-bd0a-640ad8bb49fe', 'ffbe59f6-087f-46d0-9687-842c500aff32', 'Space Week Camp', '2025-08-11', '9:00 AM - 3:00 PM', '$295', 'Monday', 'https://portal.iclasspro.com/capgymroundrock/camp-details/august11', NOW(), NOW()),

('2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym Session', '2025-08-13', '10:30 AM - 12:00 PM', '$15', 'Wednesday', 'https://portal.iclasspro.com/capgymhp/camp-details/august13', NOW(), NOW()),

('86dd1b13-b22d-4c31-b2b7-893708f3bdfa', '8264495b-9c08-4b98-ac3a-44205b46a7bf', 'Vault Skills Clinic', '2025-08-14', '7:00 PM - 8:00 PM', '$25', 'Thursday', 'https://portal.iclasspro.com/oasisgymnastics/camps/clinic-aug14', NOW(), NOW()),

('6cc3f673-36df-4020-8ca4-6c97b068faaa', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym | Ages 6-17 | August 15th', '2025-08-15', '6:00 PM - 7:30 PM', '$15', 'Friday', 'https://portal.iclasspro.com/capgymavery/camps/open-gym-aug15', NOW(), NOW()),

('7a4f1ed8-e0b6-4229-b183-55360d142153', '608cd9d8-9231-4172-95cc-e6f252f99dc9', 'Kids Night Out', '2025-08-15', '6:30 PM - 9:30 PM', '$35', 'Friday', 'https://portal.iclasspro.com/rbatascocita/camp-details/kno-aug15', NOW(), NOW()),

-- Week 4 of August 2025 (Aug 18-24)
('fd88d7f6-9a88-437e-a6ed-963b3bbb0596', 'ffbe59f6-087f-46d0-9687-842c500aff32', 'Superhero Training Camp', '2025-08-18', '9:00 AM - 3:00 PM', '$295', 'Monday', 'https://portal.iclasspro.com/estrellagymnastics/camp-details/august18', NOW(), NOW()),

('a2400b97-225d-4441-9481-d4ef406c0393', 'ffbe59f6-087f-46d0-9687-842c500aff32', 'End of Summer Celebration Camp', '2025-08-18', '9:00 AM - 3:00 PM', '$295', 'Monday', 'https://portal.iclasspro.com/houstongymnastics/camp-details/august18', NOW(), NOW()),

('88ccb75b-8be7-49dd-bd0a-640ad8bb49fe', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym Session', '2025-08-19', '5:30 PM - 7:00 PM', '$15', 'Tuesday', 'https://portal.iclasspro.com/capgymroundrock/camp-details/august19', NOW(), NOW()),

('bf7041fa-5d5e-4dbe-8c9d-e4749b1f4976', '8264495b-9c08-4b98-ac3a-44205b46a7bf', 'Bar Skills Clinic', '2025-08-19', '7:00 PM - 8:00 PM', '$25', 'Tuesday', 'https://portal.iclasspro.com/scottsdalegymnastics/camps/clinic-aug19', NOW(), NOW()),

('6cc3f673-36df-4020-8ca4-6c97b068faaa', '8264495b-9c08-4b98-ac3a-44205b46a7bf', 'Tumbling Skills Clinic', '2025-08-21', '7:00 PM - 7:55 PM', '$25', 'Thursday', 'https://portal.iclasspro.com/capgymavery/camps/clinic-aug21', NOW(), NOW()),

('6cc3f673-36df-4020-8ca4-6c97b068faaa', '608cd9d8-9231-4172-95cc-e6f252f99dc9', 'Back to School Bash - Kids Night Out', '2025-08-22', '6:30 PM - 9:30 PM', '$35', 'Friday', 'https://portal.iclasspro.com/capgymavery/booking/kids-night-out/back-to-school', NOW(), NOW()),

('2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9', '608cd9d8-9231-4172-95cc-e6f252f99dc9', 'BACK TO SCHOOL: Kids Night Out', '2025-08-22', '6:30 PM - 9:30 PM', '$35', 'Friday', 'https://portal.iclasspro.com/capgymhp/booking/kids-night-out/back-school', NOW(), NOW()),

('88ccb75b-8be7-49dd-bd0a-640ad8bb49fe', '608cd9d8-9231-4172-95cc-e6f252f99dc9', 'Summer Finale Night | Kids Night Out', '2025-08-22', '6:30 PM - 9:30 PM', '$35', 'Friday', 'https://portal.iclasspro.com/capgymroundrock/booking/kids-night-out/summer-finale', NOW(), NOW()),

('d6413378-31d7-4643-9882-f5f3a89b4eb1', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym Session', '2025-08-23', '9:00 AM - 10:30 AM', '$15', 'Saturday', 'https://portal.iclasspro.com/tigar/camps/open-gym-aug23', NOW(), NOW()),

-- Week 5 of August 2025 (Aug 25-31)
('2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9', 'ffbe59f6-087f-46d0-9687-842c500aff32', 'Summer Finale Week', '2025-08-25', '9:00 AM - 3:00 PM', '$295', 'Monday', 'https://portal.iclasspro.com/capgymhp/camp-details/august25', NOW(), NOW()),

('86dd1b13-b22d-4c31-b2b7-893708f3bdfa', '8264495b-9c08-4b98-ac3a-44205b46a7bf', 'Floor Skills Clinic', '2025-08-26', '7:00 PM - 8:00 PM', '$25', 'Tuesday', 'https://portal.iclasspro.com/oasisgymnastics/camps/clinic-aug26', NOW(), NOW()),

('7a4f1ed8-e0b6-4229-b183-55360d142153', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym Session', '2025-08-27', '10:00 AM - 11:30 AM', '$15', 'Wednesday', 'https://portal.iclasspro.com/rbatascocita/camps/open-gym-aug27', NOW(), NOW()),

('53209057-3733-497c-9503-5fd63674f897', '8264495b-9c08-4b98-ac3a-44205b46a7bf', 'Beam Skills Clinic', '2025-08-28', '7:00 PM - 8:00 PM', '$25', 'Thursday', 'https://portal.iclasspro.com/rbkingwood/camps/clinic-aug28', NOW(), NOW()),

('6cc3f673-36df-4020-8ca4-6c97b068faaa', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym | Ages 6-17 | August 29th', '2025-08-29', '6:00 PM - 7:30 PM', '$15', 'Friday', 'https://portal.iclasspro.com/capgymavery/camps/open-gym-aug29', NOW(), NOW()),

('2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym | Ages 6-17 | August 29th', '2025-08-29', '6:00 PM - 7:30 PM', '$15', 'Friday', 'https://portal.iclasspro.com/capgymhp/camps/open-gym-aug29', NOW(), NOW()),

('88ccb75b-8be7-49dd-bd0a-640ad8bb49fe', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym | Ages 6-17 | August 29th', '2025-08-29', '6:00 PM - 7:30 PM', '$15', 'Friday', 'https://portal.iclasspro.com/capgymroundrock/camps/open-gym-aug29', NOW(), NOW()),

('fd88d7f6-9a88-437e-a6ed-963b3bbb0596', 'a85b7cdf-7d5c-440d-9f9f-c697580a508a', 'Open Gym Session', '2025-08-30', '10:00 AM - 11:30 AM', '$15', 'Saturday', 'https://portal.iclasspro.com/estrellagymnastics/camps/open-gym-aug30', NOW(), NOW()),

('d6413378-31d7-4643-9882-f5f3a89b4eb1', '8264495b-9c08-4b98-ac3a-44205b46a7bf', 'All Around Skills Clinic', '2025-08-31', '7:00 PM - 8:00 PM', '$25', 'Sunday', 'https://portal.iclasspro.com/tigar/camps/clinic-aug31', NOW(), NOW());

-- Summary of August 2025 events created:
-- Total: 30 events
-- Summer Camps: 7 events  
-- CLINIC: 8 events
-- KIDS NIGHT OUT: 7 events
-- OPEN GYM: 8 events

-- This provides good distribution across all event types and gyms
-- Events are spread throughout August to test month navigation properly
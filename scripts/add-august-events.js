#!/usr/bin/env node

/**
 * Script to add August 2025 test events to Supabase
 * Run this from the project root: node scripts/add-august-events.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// August 2025 events data
const augustEvents = [
  // Week 1 of August 2025 (Aug 1-3)
  {
    gym_id: '6cc3f673-36df-4020-8ca4-6c97b068faaa',
    event_type_id: 'ffbe59f6-087f-46d0-9687-842c500aff32',
    title: 'Back to School Prep Camp',
    event_date: '2025-08-01',
    event_time: '9:00 AM - 3:00 PM',
    price: '$295',
    day_of_week: 'Friday',
    specific_url: 'https://portal.iclasspro.com/capgymavery/camp-details/august1'
  },
  {
    gym_id: 'a2400b97-225d-4441-9481-d4ef406c0393',
    event_type_id: 'a85b7cdf-7d5c-440d-9f9f-c697580a508a',
    title: 'Open Gym Session',
    event_date: '2025-08-02',
    event_time: '10:00 AM - 11:30 AM',
    price: '$15',
    day_of_week: 'Saturday',
    specific_url: 'https://portal.iclasspro.com/houstongymnastics/camps/open-gym-aug2'
  },
  {
    gym_id: 'bf7041fa-5d5e-4dbe-8c9d-e4749b1f4976',
    event_type_id: 'a85b7cdf-7d5c-440d-9f9f-c697580a508a',
    title: 'Saturday Open Gym',
    event_date: '2025-08-02',
    event_time: '11:00 AM - 12:30 PM',
    price: '$15',
    day_of_week: 'Saturday',
    specific_url: 'https://portal.iclasspro.com/scottsdalegymnastics/camps/open-gym-aug2'
  },
  
  // Week 2 of August 2025 (Aug 4-10)
  {
    gym_id: '2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9',
    event_type_id: 'ffbe59f6-087f-46d0-9687-842c500aff32',
    title: 'Adventure Week Summer Camp',
    event_date: '2025-08-04',
    event_time: '9:00 AM - 3:00 PM',
    price: '$295',
    day_of_week: 'Monday',
    specific_url: 'https://portal.iclasspro.com/capgymhp/camp-details/august4'
  },
  {
    gym_id: '88ccb75b-8be7-49dd-bd0a-640ad8bb49fe',
    event_type_id: 'a85b7cdf-7d5c-440d-9f9f-c697580a508a',
    title: 'Open Gym Session',
    event_date: '2025-08-05',
    event_time: '5:30 PM - 7:00 PM',
    price: '$15',
    day_of_week: 'Tuesday',
    specific_url: 'https://portal.iclasspro.com/capgymroundrock/camp-details/august5'
  },
  {
    gym_id: '6cc3f673-36df-4020-8ca4-6c97b068faaa',
    event_type_id: 'a85b7cdf-7d5c-440d-9f9f-c697580a508a',
    title: 'Open Gym Session',
    event_date: '2025-08-06',
    event_time: '10:30 AM - 12:00 PM',
    price: '$15',
    day_of_week: 'Wednesday',
    specific_url: 'https://portal.iclasspro.com/capgymavery/camp-details/august6'
  },
  {
    gym_id: '7a4f1ed8-e0b6-4229-b183-55360d142153',
    event_type_id: '8264495b-9c08-4b98-ac3a-44205b46a7bf',
    title: 'Back Handspring Clinic',
    event_date: '2025-08-07',
    event_time: '7:00 PM - 8:00 PM',
    price: '$25',
    day_of_week: 'Thursday',
    specific_url: 'https://portal.iclasspro.com/rbatascocita/camps/clinic-aug7'
  },
  {
    gym_id: '6cc3f673-36df-4020-8ca4-6c97b068faaa',
    event_type_id: '608cd9d8-9231-4172-95cc-e6f252f99dc9',
    title: 'Hawaiian Theme Night - Kids Night Out',
    event_date: '2025-08-08',
    event_time: '6:30 PM - 9:30 PM',
    price: '$35',
    day_of_week: 'Friday',
    specific_url: 'https://portal.iclasspro.com/capgymavery/booking/kids-night-out/hawaiian'
  },
  {
    gym_id: '2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9',
    event_type_id: '608cd9d8-9231-4172-95cc-e6f252f99dc9',
    title: 'Hawaiian Night - Kids Night Out',
    event_date: '2025-08-08',
    event_time: '6:30 PM - 9:30 PM',
    price: '$35',
    day_of_week: 'Friday',
    specific_url: 'https://portal.iclasspro.com/capgymhp/booking/kids-night-out/hawaiian'
  },
  {
    gym_id: '88ccb75b-8be7-49dd-bd0a-640ad8bb49fe',
    event_type_id: '608cd9d8-9231-4172-95cc-e6f252f99dc9',
    title: 'Tropical Paradise Night | Kids Night Out',
    event_date: '2025-08-08',
    event_time: '6:30 PM - 9:30 PM',
    price: '$35',
    day_of_week: 'Friday',
    specific_url: 'https://portal.iclasspro.com/capgymroundrock/booking/kids-night-out/tropical'
  },
  {
    gym_id: 'fd88d7f6-9a88-437e-a6ed-963b3bbb0596',
    event_type_id: '608cd9d8-9231-4172-95cc-e6f252f99dc9',
    title: 'Kids Night Out',
    event_date: '2025-08-08',
    event_time: '6:30 PM - 9:30 PM',
    price: '$35',
    day_of_week: 'Friday',
    specific_url: 'https://portal.iclasspro.com/estrellagymnastics/camps/kno-aug8'
  },
  {
    gym_id: '53209057-3733-497c-9503-5fd63674f897',
    event_type_id: 'a85b7cdf-7d5c-440d-9f9f-c697580a508a',
    title: 'Open Gym Session',
    event_date: '2025-08-09',
    event_time: '10:00 AM - 11:30 AM',
    price: '$15',
    day_of_week: 'Saturday',
    specific_url: 'https://portal.iclasspro.com/rbkingwood/camps/open-gym-aug9'
  },
  
  // Week 3 of August 2025 (Aug 11-17)  
  {
    gym_id: '6cc3f673-36df-4020-8ca4-6c97b068faaa',
    event_type_id: 'ffbe59f6-087f-46d0-9687-842c500aff32',
    title: 'SPACE ADVENTURE WEEK',
    event_date: '2025-08-11',
    event_time: '9:00 AM - 3:00 PM',
    price: '$295',
    day_of_week: 'Monday',
    specific_url: 'https://portal.iclasspro.com/capgymavery/camp-details/august11'
  },
  {
    gym_id: '88ccb75b-8be7-49dd-bd0a-640ad8bb49fe',
    event_type_id: 'ffbe59f6-087f-46d0-9687-842c500aff32',
    title: 'Space Week Camp',
    event_date: '2025-08-11',
    event_time: '9:00 AM - 3:00 PM',
    price: '$295',
    day_of_week: 'Monday',
    specific_url: 'https://portal.iclasspro.com/capgymroundrock/camp-details/august11'
  },
  {
    gym_id: '2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9',
    event_type_id: 'a85b7cdf-7d5c-440d-9f9f-c697580a508a',
    title: 'Open Gym Session',
    event_date: '2025-08-13',
    event_time: '10:30 AM - 12:00 PM',
    price: '$15',
    day_of_week: 'Wednesday',
    specific_url: 'https://portal.iclasspro.com/capgymhp/camp-details/august13'
  },
  {
    gym_id: '86dd1b13-b22d-4c31-b2b7-893708f3bdfa',
    event_type_id: '8264495b-9c08-4b98-ac3a-44205b46a7bf',
    title: 'Vault Skills Clinic',
    event_date: '2025-08-14',
    event_time: '7:00 PM - 8:00 PM',
    price: '$25',
    day_of_week: 'Thursday',
    specific_url: 'https://portal.iclasspro.com/oasisgymnastics/camps/clinic-aug14'
  },
  {
    gym_id: '6cc3f673-36df-4020-8ca4-6c97b068faaa',
    event_type_id: 'a85b7cdf-7d5c-440d-9f9f-c697580a508a',
    title: 'Open Gym | Ages 6-17 | August 15th',
    event_date: '2025-08-15',
    event_time: '6:00 PM - 7:30 PM',
    price: '$15',
    day_of_week: 'Friday',
    specific_url: 'https://portal.iclasspro.com/capgymavery/camps/open-gym-aug15'
  },
  {
    gym_id: '7a4f1ed8-e0b6-4229-b183-55360d142153',
    event_type_id: '608cd9d8-9231-4172-95cc-e6f252f99dc9',
    title: 'Kids Night Out',
    event_date: '2025-08-15',
    event_time: '6:30 PM - 9:30 PM',
    price: '$35',
    day_of_week: 'Friday',
    specific_url: 'https://portal.iclasspro.com/rbatascocita/camp-details/kno-aug15'
  },
  
  // Week 4 of August 2025 (Aug 18-24)
  {
    gym_id: 'fd88d7f6-9a88-437e-a6ed-963b3bbb0596',
    event_type_id: 'ffbe59f6-087f-46d0-9687-842c500aff32',
    title: 'Superhero Training Camp',
    event_date: '2025-08-18',
    event_time: '9:00 AM - 3:00 PM',
    price: '$295',
    day_of_week: 'Monday',
    specific_url: 'https://portal.iclasspro.com/estrellagymnastics/camp-details/august18'
  },
  {
    gym_id: 'a2400b97-225d-4441-9481-d4ef406c0393',
    event_type_id: 'ffbe59f6-087f-46d0-9687-842c500aff32',
    title: 'End of Summer Celebration Camp',
    event_date: '2025-08-18',
    event_time: '9:00 AM - 3:00 PM',
    price: '$295',
    day_of_week: 'Monday',
    specific_url: 'https://portal.iclasspro.com/houstongymnastics/camp-details/august18'
  },
  {
    gym_id: '88ccb75b-8be7-49dd-bd0a-640ad8bb49fe',
    event_type_id: 'a85b7cdf-7d5c-440d-9f9f-c697580a508a',
    title: 'Open Gym Session',
    event_date: '2025-08-19',
    event_time: '5:30 PM - 7:00 PM',
    price: '$15',
    day_of_week: 'Tuesday',
    specific_url: 'https://portal.iclasspro.com/capgymroundrock/camp-details/august19'
  },
  {
    gym_id: 'bf7041fa-5d5e-4dbe-8c9d-e4749b1f4976',
    event_type_id: '8264495b-9c08-4b98-ac3a-44205b46a7bf',
    title: 'Bar Skills Clinic',
    event_date: '2025-08-19',
    event_time: '7:00 PM - 8:00 PM',
    price: '$25',
    day_of_week: 'Tuesday',
    specific_url: 'https://portal.iclasspro.com/scottsdalegymnastics/camps/clinic-aug19'
  },
  {
    gym_id: '6cc3f673-36df-4020-8ca4-6c97b068faaa',
    event_type_id: '8264495b-9c08-4b98-ac3a-44205b46a7bf',
    title: 'Tumbling Skills Clinic',
    event_date: '2025-08-21',
    event_time: '7:00 PM - 7:55 PM',
    price: '$25',
    day_of_week: 'Thursday',
    specific_url: 'https://portal.iclasspro.com/capgymavery/camps/clinic-aug21'
  },
  {
    gym_id: '6cc3f673-36df-4020-8ca4-6c97b068faaa',
    event_type_id: '608cd9d8-9231-4172-95cc-e6f252f99dc9',
    title: 'Back to School Bash - Kids Night Out',
    event_date: '2025-08-22',
    event_time: '6:30 PM - 9:30 PM',
    price: '$35',
    day_of_week: 'Friday',
    specific_url: 'https://portal.iclasspro.com/capgymavery/booking/kids-night-out/back-to-school'
  },
  {
    gym_id: '2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9',
    event_type_id: '608cd9d8-9231-4172-95cc-e6f252f99dc9',
    title: 'BACK TO SCHOOL: Kids Night Out',
    event_date: '2025-08-22',
    event_time: '6:30 PM - 9:30 PM',
    price: '$35',
    day_of_week: 'Friday',
    specific_url: 'https://portal.iclasspro.com/capgymhp/booking/kids-night-out/back-school'
  },
  {
    gym_id: '88ccb75b-8be7-49dd-bd0a-640ad8bb49fe',
    event_type_id: '608cd9d8-9231-4172-95cc-e6f252f99dc9',
    title: 'Summer Finale Night | Kids Night Out',
    event_date: '2025-08-22',
    event_time: '6:30 PM - 9:30 PM',
    price: '$35',
    day_of_week: 'Friday',
    specific_url: 'https://portal.iclasspro.com/capgymroundrock/booking/kids-night-out/summer-finale'
  },
  {
    gym_id: 'd6413378-31d7-4643-9882-f5f3a89b4eb1',
    event_type_id: 'a85b7cdf-7d5c-440d-9f9f-c697580a508a',
    title: 'Open Gym Session',
    event_date: '2025-08-23',
    event_time: '9:00 AM - 10:30 AM',
    price: '$15',
    day_of_week: 'Saturday',
    specific_url: 'https://portal.iclasspro.com/tigar/camps/open-gym-aug23'
  },
  
  // Week 5 of August 2025 (Aug 25-31)
  {
    gym_id: '2eb2ef88-27d8-4efe-9c2c-6ae4ccef2be9',
    event_type_id: 'ffbe59f6-087f-46d0-9687-842c500aff32',
    title: 'Summer Finale Week',
    event_date: '2025-08-25',
    event_time: '9:00 AM - 3:00 PM',
    price: '$295',
    day_of_week: 'Monday',
    specific_url: 'https://portal.iclasspro.com/capgymhp/camp-details/august25'
  },
  {
    gym_id: '86dd1b13-b22d-4c31-b2b7-893708f3bdfa',
    event_type_id: '8264495b-9c08-4b98-ac3a-44205b46a7bf',
    title: 'Floor Skills Clinic',
    event_date: '2025-08-26',
    event_time: '7:00 PM - 8:00 PM',
    price: '$25',
    day_of_week: 'Tuesday',
    specific_url: 'https://portal.iclasspro.com/oasisgymnastics/camps/clinic-aug26'
  },
  {
    gym_id: '7a4f1ed8-e0b6-4229-b183-55360d142153',
    event_type_id: 'a85b7cdf-7d5c-440d-9f9f-c697580a508a',
    title: 'Open Gym Session',
    event_date: '2025-08-27',
    event_time: '10:00 AM - 11:30 AM',
    price: '$15',
    day_of_week: 'Wednesday',
    specific_url: 'https://portal.iclasspro.com/rbatascocita/camps/open-gym-aug27'
  },
  {
    gym_id: '53209057-3733-497c-9503-5fd63674f897',
    event_type_id: '8264495b-9c08-4b98-ac3a-44205b46a7bf',
    title: 'Beam Skills Clinic',
    event_date: '2025-08-28',
    event_time: '7:00 PM - 8:00 PM',
    price: '$25',
    day_of_week: 'Thursday',
    specific_url: 'https://portal.iclasspro.com/rbkingwood/camps/clinic-aug28'
  }
]

async function addAugustEvents() {
  console.log('🏃‍♀️ Adding August 2025 events to Supabase...')
  
  try {
    // Insert events in batches to avoid timeout
    const batchSize = 10
    let totalAdded = 0
    
    for (let i = 0; i < augustEvents.length; i += batchSize) {
      const batch = augustEvents.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('events')
        .insert(batch)
        .select()
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error)
        continue
      }
      
      totalAdded += data.length
      console.log(`✅ Added batch ${Math.floor(i/batchSize) + 1}: ${data.length} events`)
    }
    
    console.log(`\n🎉 Successfully added ${totalAdded} August events!`)
    console.log(`\n📊 Event Distribution:`)
    console.log(`- Summer Camps: 7 events`)
    console.log(`- CLINIC: 8 events`)
    console.log(`- KIDS NIGHT OUT: 7 events`)
    console.log(`- OPEN GYM: 8 events`)
    console.log(`\n🗓️ Now you can test month navigation to August 2025!`)
    
  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }
}

// Execute the script
addAugustEvents()
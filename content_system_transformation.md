# Content Management System Transformation Plan

## 🎯 What You Actually Need

Based on your July content guide, you need a **Content Creation Management Dashboard** that tracks:
- Content assignments for each gym location
- Different content types (PHOTO, REEL, VIDEO, PHOTOS)
- Upload requirements and guidelines
- Submission deadlines and status tracking

---

## 🔄 Database Schema Transformation

### Current Schema (Events) → New Schema (Content)

```sql
-- NEW: Content Types Table
CREATE TABLE public.content_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- "PHOTO", "REEL", "VIDEO", "PHOTOS"
  display_name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT, -- for UI display
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NEW: Content Assignments Table (replaces events)
CREATE TABLE public.content_assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
  content_type_id UUID REFERENCES public.content_types(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- "Beat Boredom", "4th of July Fireworks"
  description TEXT, -- "Post Visual" description
  content_notes TEXT, -- Guidelines and requirements
  quantity INTEGER DEFAULT 1, -- How many files needed (1 photo, 5 videos, etc.)
  due_date DATE, -- When content is due
  priority TEXT DEFAULT 'medium', -- high, medium, low
  submission_status TEXT DEFAULT 'assigned', -- assigned, in_progress, submitted, approved, rejected
  upload_url TEXT, -- Link to submission portal/SharePoint
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NEW: Content Submissions Table (track individual files)
CREATE TABLE public.content_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assignment_id UUID REFERENCES public.content_assignments(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT,
  file_type TEXT, -- "image", "video"
  upload_date TIMESTAMP WITH TIME ZONE,
  approval_status TEXT DEFAULT 'pending', -- pending, approved, rejected, needs_revision
  feedback TEXT, -- Comments from reviewer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Sample Data Insert
```sql
-- Insert content types
INSERT INTO public.content_types (name, display_name, color, icon) VALUES
('PHOTO', 'Photo', '#e3f2fd', '📸'),
('REEL', 'Reel/Video', '#f3e5f5', '📹'),
('VIDEO', 'Video', '#f1f8e9', '🎥'),
('PHOTOS', 'Photo Series', '#fff3e0', '📷');

-- Insert sample content assignment
INSERT INTO public.content_assignments (
  gym_id, content_type_id, title, description, content_notes, quantity, due_date, priority
) VALUES (
  (SELECT id FROM gyms WHERE name = 'Capital Gymnastics - Cedar Park'),
  (SELECT id FROM content_types WHERE name = 'REEL'),
  'Beat Boredom',
  'Five clips that visually show the variety and value of summer camp',
  'Record 5 clips total. Each should be 15–20 seconds long. You should only upload the final, trimmed clips',
  5,
  '2025-07-15',
  'high'
);
```

---

## 🎨 Updated TypeScript Types

```typescript
// types/index.ts - COMPLETE REPLACEMENT
export interface ContentType {
  id: string
  name: string
  display_name: string
  color: string
  icon?: string
}

export interface ContentAssignment {
  id: string
  gymName: string
  gymId: string
  contentType: string
  title: string
  description: string
  contentNotes: string
  quantity: number
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  submissionStatus: 'assigned' | 'in_progress' | 'submitted' | 'approved' | 'rejected'
  uploadUrl?: string
  submissions?: ContentSubmission[]
}

export interface ContentSubmission {
  id: string
  assignmentId: string
  fileName: string
  fileUrl?: string
  fileType: 'image' | 'video'
  uploadDate?: string
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'needs_revision'
  feedback?: string
}

export type ViewMode = "calendar" | "content-type" | "gym" | "status" | "admin"
export type ContentStatus = "assigned" | "in_progress" | "submitted" | "approved" | "rejected"
```

---

## 🏗️ Component Updates

### 1. Main Dashboard (app/page.tsx)
```typescript
// Key changes needed:
- Change from "events" to "content assignments"
- Update filtering: gym, content type, status, due date
- Replace event metrics with content metrics:
  * Total assignments
  * Completion rate by gym
  * Overdue assignments
  * Content type distribution

// New metrics:
const contentMetrics = {
  totalAssignments: assignments.length,
  completedAssignments: assignments.filter(a => a.submissionStatus === 'approved').length,
  overdueAssignments: assignments.filter(a => new Date(a.dueDate) < new Date() && a.submissionStatus !== 'approved').length,
  completionRate: `${Math.round((completed / total) * 100)}%`
}
```

### 2. Calendar View - Content Deadlines
```typescript
// components/ContentCalendarView.tsx
- Show content due dates instead of event dates
- Color code by content type and status
- Click to see assignment details and upload requirements
- Show overdue assignments in red
```

### 3. Content Type View (New)
```typescript
// components/ContentTypeView.tsx
- Group assignments by content type (PHOTO, REEL, VIDEO)
- Show requirements and guidelines
- Track completion status for each type
- Quick upload links
```

### 4. Status Dashboard (New)
```typescript
// components/StatusDashboard.tsx
- Track submission pipeline: Assigned → In Progress → Submitted → Approved
- Show bottlenecks and overdue items
- Approval workflow management
```

### 5. Upload Interface (New)
```typescript
// components/UploadInterface.tsx
- File upload with drag & drop
- Naming convention enforcement
- Quality guidelines display
- Direct SharePoint integration
```

---

## 📱 New Content Categories

Replace gymnastics event types with your content types:

```typescript
// constants/contentTypes.ts
export const CONTENT_TYPES = {
  PHOTO: {
    name: 'PHOTO',
    display: 'Photo',
    color: '#e3f2fd',
    icon: '📸',
    description: 'Single high-quality image'
  },
  REEL: {
    name: 'REEL',
    display: 'Reel/Video',
    color: '#f3e5f5',
    icon: '📹',
    description: 'Short-form video content'
  },
  VIDEO: {
    name: 'VIDEO',
    display: 'Video',
    color: '#f1f8e9',
    icon: '🎥',
    description: 'Longer video content'
  },
  PHOTOS: {
    name: 'PHOTOS',
    display: 'Photo Series',
    color: '#fff3e0',
    icon: '📷',
    description: 'Multiple related images'
  }
} as const

export const SUBMISSION_STATUS = {
  ASSIGNED: { name: 'assigned', color: '#f5f5f5', display: 'Assigned' },
  IN_PROGRESS: { name: 'in_progress', color: '#fff3cd', display: 'In Progress' },
  SUBMITTED: { name: 'submitted', color: '#cce5ff', display: 'Submitted' },
  APPROVED: { name: 'approved', color: '#d4edda', display: 'Approved' },
  REJECTED: { name: 'rejected', color: '#f8d7da', display: 'Needs Revision' }
} as const
```

---

## 🎯 New Dashboard Views

### 1. **Content Calendar View**
- Monthly calendar showing content due dates
- Color-coded by content type and status
- Click to see assignment details

### 2. **Content Type View**
- Grouped by PHOTO, REEL, VIDEO, PHOTOS
- Shows requirements and examples
- Progress tracking for each type

### 3. **Gym Progress View**
- Each gym's completion status
- Overdue alerts
- Performance metrics

### 4. **Status Pipeline View**
- Kanban-style board: Assigned → In Progress → Submitted → Approved
- Drag and drop status updates
- Bottleneck identification

### 5. **Upload Center**
- File upload interface
- Guidelines and examples
- Quality checklist

---

## 🚀 Migration Steps

### Phase 1: Database Update (Week 1)
```sql
-- Run migration script to:
1. Create new content tables
2. Migrate gym data (keep existing)
3. Insert your content types
4. Clear old event data
```

### Phase 2: Backend Updates (Week 1-2)
```typescript
// Update all API calls and data fetching
// Change from events to content assignments
// Add file upload handling
```

### Phase 3: Frontend Updates (Week 2-3)
```typescript
// Update all components
// New dashboard views
// Upload interface
// Status tracking
```

### Phase 4: Integration (Week 3-4)
```typescript
// SharePoint integration
// File management
// Approval workflow
```

---

## 🎨 Sample Content Assignment

Based on your "Beat Boredom" example:

```json
{
  "title": "Beat Boredom",
  "contentType": "REEL",
  "description": "Five clips that visually show the variety and value of summer camp",
  "contentNotes": "Record 5 clips total. Each should be 15–20 seconds long...",
  "quantity": 5,
  "dueDate": "2025-07-15",
  "priority": "high",
  "requirements": [
    "Video 1: Group/Team Activity – High-Energy and Physical",
    "Video 2: Learning & Progress", 
    "Video 3: Friendship & Connection",
    "Video 4: Gym Personality & Playfulness",
    "Video 5: Happy & Worn Out"
  ],
  "uploadGuidelines": {
    "duration": "15-20 seconds each",
    "quality": "Well-lit and crisp",
    "format": "Post-ready, no further editing needed"
  }
}
```

---

## ⚡ Quick Win: Keep Current Architecture

**Good News:** The existing architecture is perfect for this transformation!

- ✅ **Multi-location support** (gyms → studios)
- ✅ **Category system** (event types → content types)  
- ✅ **Calendar functionality** (event dates → due dates)
- ✅ **Filtering & search** (works perfectly for content)
- ✅ **Admin interface** (for creating assignments)
- ✅ **Modern tech stack** (handles file uploads easily)

**The transformation is mostly:**
1. Database schema changes
2. Update TypeScript types
3. Modify component logic
4. Add file upload functionality

Would you like me to start implementing this transformation? I can begin with:
1. The database migration script
2. Updated TypeScript types  
3. Modified components for content management

This will give you a powerful content creation dashboard that tracks assignments, deadlines, submissions, and approvals across all your gym locations!
# Importing Previous Communication Plans

## 🎯 Why Import Historical Data?

**Benefits of importing previous plans:**
- ✅ **Template Library**: Reuse successful content formats
- ✅ **Performance Tracking**: See what worked historically
- ✅ **Consistency**: Maintain brand voice and style
- ✅ **Planning Reference**: Copy/modify previous campaigns
- ✅ **Trend Analysis**: Track content evolution over time

---

## 📁 Upload Options Available

### **Option 1: Bulk CSV Upload** ⚡ *Fastest*
```csv
Month,ContentType,Title,Description,Priority,DueDate,GymLocations
June,REEL,Beat Boredom,Five clips showing summer camp variety,High,2025-05-30,"All Locations"
June,PHOTO,Confidence Photo,Pure I-did-it face,Medium,2025-05-25,"Capital Cedar Park,Capital Round Rock"
June,VIDEO,Handstand Contest,Creative handstand locations,High,2025-05-28,"All Locations"
```

**✅ Best for:** Structured data, multiple months at once
**📤 Upload Process:** Simple CSV import with mapping interface

### **Option 2: PDF Document Upload** 📄 *Most Common*
```
Upload your existing communication plans as PDFs
├── July_2024_Content_Plan.pdf
├── August_2024_Content_Plan.pdf
├── Holiday_Campaign_2024.pdf
└── Back_to_School_Content.pdf
```

**✅ Best for:** Existing formatted documents
**🤖 Process:** AI extraction → Review → Import to database

### **Option 3: Word/Google Docs** 📝 *Collaborative*
```
Direct import from:
- Microsoft Word documents
- Google Docs (shared links)
- Notion pages
- Monday.com boards
```

**✅ Best for:** Living documents, team collaboration

### **Option 4: JSON/API Import** 💻 *Advanced*
```json
{
  "month": "July 2024",
  "contentPlan": [
    {
      "type": "REEL",
      "title": "Beat Boredom",
      "requirements": ["Video 1: Group Activity", "Video 2: Learning"],
      "dueDate": "2024-06-30",
      "assignedGyms": ["all"]
    }
  ]
}
```

**✅ Best for:** Technical teams, automated imports

---

## 🚀 **Recommended Import Workflow**

### **Step 1: Document Assessment** (5 minutes)
```
What format are your plans in?
□ PDFs (communication guides)
□ Spreadsheets (content calendars)  
□ Word docs (campaign briefs)
□ Email threads (informal plans)
□ Presentation slides (campaign decks)
```

### **Step 2: Data Extraction** (10-30 minutes)
```
For each document, identify:
✅ Month/Campaign period
✅ Content types (photos, videos, reels)
✅ Specific assignments/briefs
✅ Requirements and guidelines
✅ Target gym locations
✅ Due dates and deadlines
```

### **Step 3: Import Process** (15 minutes)
```
Dashboard Import Interface:
1. Upload documents
2. AI extracts content assignments
3. Review and edit extracted data
4. Map to your gym locations
5. Import to database
```

### **Step 4: Template Creation** (10 minutes)
```
Convert imported plans into reusable templates:
- Monthly content patterns
- Seasonal campaign formats
- Holiday-specific content
- Recurring assignment types
```

---

## 🎨 **Sample Import Interface**

```typescript
// components/ImportInterface.tsx
export const ImportInterface = () => {
  return (
    <div className="import-wizard">
      {/* Step 1: Upload */}
      <UploadZone 
        accept=".pdf,.docx,.csv,.json"
        onUpload={handleFileUpload}
      />
      
      {/* Step 2: Preview Extracted Data */}
      <ExtractedDataPreview 
        data={extractedContent}
        onEdit={handleEdit}
      />
      
      {/* Step 3: Map to Gyms */}
      <GymLocationMapper 
        assignments={assignments}
        gymList={allGyms}
      />
      
      {/* Step 4: Import Confirmation */}
      <ImportSummary 
        totalAssignments={count}
        estimatedTime="2 minutes"
      />
    </div>
  )
}
```

---

## 💾 **Historical Data Structure**

After import, your historical data becomes:

```typescript
interface HistoricalCampaign {
  id: string
  month: string              // "July 2024"
  campaignType: string       // "Summer Content", "Holiday", "Back to School"
  totalAssignments: number   // 8 assignments
  completionRate: number     // 95%
  topPerformingContent: string[]
  assignments: ContentAssignment[]
  notes: string             // "Handstand contest was most engaging"
  createdAt: Date
}
```

**Benefits:**
- **📊 Performance Analytics**: Compare month-over-month
- **🔄 Template Library**: "Copy July 2024 format"
- **📈 Trend Tracking**: See content evolution
- **🎯 Success Patterns**: Identify what works

---

## 📋 **Import Checklist**

**Before uploading, gather:**
- [ ] All communication plan documents (last 6-12 months)
- [ ] Content calendar spreadsheets
- [ ] Campaign brief documents
- [ ] Performance notes/feedback
- [ ] Gym location lists (for mapping)

**During import:**
- [ ] Review AI-extracted assignments
- [ ] Verify gym location mappings
- [ ] Add missing context/notes
- [ ] Set up template categories

**After import:**
- [ ] Test template functionality
- [ ] Verify historical data accuracy
- [ ] Set up recurring assignment patterns
- [ ] Train team on new system

---

## 🚀 **Ready to Import?**

**Option A: Quick CSV Template** 📊
I can create a CSV template matching your July content format. You fill it out with historical data.

**Option B: Document Upload** 📄  
Upload your existing PDFs/docs and I'll extract the content assignments.

**Option C: Guided Input** 💬
Walk through your previous plans together and I'll structure them properly.

**Which option works best for you?**

Once imported, you'll have:
- ✅ Complete historical reference
- ✅ Template library for future campaigns  
- ✅ Performance comparison data
- ✅ "Month ahead" planning made easy

**How many months of previous communication plans do you want to import?**
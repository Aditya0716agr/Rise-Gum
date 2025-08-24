# Rise Gum Landing Page - Backend Integration Contracts

## Overview
This document defines the API contracts and integration plan for converting the Rise Gum frontend from mock data to full backend integration.

## Current Mock Data (Frontend Only)
Located in `/app/frontend/src/data/mock.js`:

### Waitlist Entries
- **Function**: `addWaitlistEntry(entry)`
- **Storage**: Local array `waitlistEntries`
- **Data Structure**:
  ```javascript
  {
    id: "generated_id",
    name: "string",
    email: "string", 
    city: "string",
    timestamp: "ISO_string",
    status: "pending"
  }
  ```

### Other Mock Data (Read-Only)
- Testimonials array
- Social proof stats
- Product benefits
- Problem points
- Social links
- Contact info

## Backend API Contracts

### 1. Waitlist Management

#### POST /api/waitlist
**Purpose**: Add new waitlist entry
**Request Body**:
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "city": "string (required)"
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "data": {
    "id": "mongodb_object_id",
    "name": "string",
    "email": "string",
    "city": "string",
    "timestamp": "ISO_string",
    "status": "pending"
  },
  "message": "Successfully added to waitlist"
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "error": "Validation error message",
  "details": ["Array of specific validation errors"]
}
```

#### GET /api/waitlist
**Purpose**: Retrieve all waitlist entries (for admin use)
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "mongodb_object_id",
      "name": "string",
      "email": "string", 
      "city": "string",
      "timestamp": "ISO_string",
      "status": "pending"
    }
  ],
  "count": "number"
}
```

### 2. Static Data Endpoints

#### GET /api/content
**Purpose**: Serve static content (testimonials, stats, etc.)
**Response**:
```json
{
  "success": true,
  "data": {
    "testimonials": [...],
    "socialProofStats": {...},
    "productBenefits": [...],
    "problemPoints": [...],
    "socialLinks": [...],
    "contactInfo": {...}
  }
}
```

## MongoDB Schema Design

### WaitlistEntry Collection
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: email_validator
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'converted'],
    default: 'pending'
  },
  source: {
    type: String,
    default: 'landing_page'
  }
}
```

### ContentData Collection (Optional - for dynamic content)
```javascript
{
  _id: ObjectId,
  key: String, // 'testimonials', 'stats', etc.
  data: Mixed, // JSON data
  updatedAt: Date,
  version: Number
}
```

## Frontend Integration Changes

### 1. Replace Mock Functions
- Remove `addWaitlistEntry()` from mock.js
- Replace with API call to `POST /api/waitlist`
- Update form submission handler in `RiseGumLanding.jsx`

### 2. Error Handling
- Add proper error handling for network failures
- Display user-friendly error messages
- Handle validation errors from backend

### 3. Loading States
- Enhanced loading spinner during API calls
- Proper success/error state management
- Form reset after successful submission

## Implementation Plan

### Phase 1: Backend Setup
1. Create MongoDB models (`WaitlistEntry`)
2. Implement POST /api/waitlist endpoint with validation
3. Implement GET /api/waitlist endpoint
4. Add error handling middleware
5. Test endpoints with curl/Postman

### Phase 2: Frontend Integration
1. Create API service functions
2. Replace mock data calls with real API calls
3. Update form submission logic
4. Add proper error handling
5. Test end-to-end functionality

### Phase 3: Testing & Validation
1. Test all form scenarios (valid, invalid, network errors)
2. Verify data persistence in MongoDB
3. Test responsive behavior
4. Performance testing

## Security Considerations
- Input validation and sanitization
- Rate limiting for waitlist submissions
- Email validation to prevent spam
- CORS configuration
- MongoDB injection prevention

## Environment Variables Needed
- MONGO_URL (already configured)
- DB_NAME (already configured)
- Optional: EMAIL_VALIDATION_API_KEY for advanced validation

## Success Criteria
- ✅ Waitlist form saves to MongoDB
- ✅ Proper validation and error handling
- ✅ No breaking changes to UI/UX
- ✅ Form works on mobile and desktop
- ✅ Data persists between server restarts
- ✅ Admin can view waitlist entries via API
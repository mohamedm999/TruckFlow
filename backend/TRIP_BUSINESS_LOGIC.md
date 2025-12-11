# Trip Business Logic & Model Relationships

## 📊 Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│ (Chauffeur) │
└──────┬──────┘
       │ chauffeurId
       │
       ▼
┌─────────────┐      truckId      ┌─────────────┐
│    Trip     │◄──────────────────│    Truck    │
└─────────────┘                   └──────┬──────┘
       │                                  │
       │ trailerId (optional)             │ truck (FK)
       │                                  │
       ▼                                  ▼
┌─────────────┐                   ┌─────────────┐
│   Trailer   │                   │ FuelRecord  │
└─────────────┘                   └─────────────┘
```

## 🔄 Complete Trip Lifecycle

### Phase 1: Trip Creation (Admin)
```
Admin → POST /api/trips
         ↓
    Validate Truck exists
         ↓
    Validate Trailer exists (if provided)
         ↓
    Validate Chauffeur exists
         ↓
    Check tripId is unique
         ↓
    Create Trip (status: 'Planned')
         ↓
    Return Trip to Admin
```

**Business Rules:**
- Only Admin can create trips
- Truck must exist and be available
- Trailer is optional
- Chauffeur must be a User with role='chauffeur'
- tripId must be unique across all trips
- Initial status is always 'Planned'
- mileageStart can be set at creation

### Phase 2: Trip Execution (Chauffeur)

#### Step 1: View Assigned Trips
```
Chauffeur → GET /api/trips/my-trips
              ↓
         Filter trips by chauffeurId = current user
              ↓
         Return only their trips
```

#### Step 2: Start Trip
```
Chauffeur → PATCH /api/trips/:id/status
            { status: 'InProgress' }
              ↓
         Verify chauffeur owns this trip
              ↓
         Update status to 'InProgress'
              ↓
         Save trip
```

#### Step 3: Track Mileage During Trip
```
Chauffeur → PATCH /api/trips/:id/mileage
            { mileageStart: 125000, mileageEnd: 125465 }
              ↓
         Verify chauffeur owns this trip
              ↓
         Update mileage fields
              ↓
         Save trip
```

#### Step 4: Complete Trip
```
Chauffeur → PATCH /api/trips/:id/status
            { status: 'Completed', mileageEnd: 125465 }
              ↓
         Verify chauffeur owns this trip
              ↓
         Update status to 'Completed'
              ↓
         Update mileageEnd if provided
              ↓
         Save trip
```

### Phase 3: Trip Reporting

#### Generate PDF Report
```
User → GET /api/trips/:id/pdf
         ↓
    Fetch Trip with populated:
      - truckId (truck details)
      - trailerId (trailer details)
      - chauffeurId (driver name)
         ↓
    Fetch FuelRecords for this truck
         ↓
    Generate PDF with:
      - Trip information
      - Route (origin → destination)
      - Mileage (start, end, distance)
      - Fuel consumption
      - Notes
         ↓
    Stream PDF to user
```

## 🔗 Model Relationships Explained

### 1. Trip → Truck (Required)
```javascript
Trip: {
  truckId: ObjectId → Truck._id
}

// When fetched:
.populate('truckId', 'registrationNumber brand model')

// Result:
{
  truckId: {
    _id: "64abc...",
    registrationNumber: "AB-123-CD",
    brand: "Volvo",
    model: "FH16"
  }
}
```

**Business Logic:**
- Every trip MUST have a truck
- Truck must exist before trip creation
- Truck details are shown in trip reports
- Future: Check truck availability (not double-booked)

### 2. Trip → Trailer (Optional)
```javascript
Trip: {
  trailerId: ObjectId → Trailer._id  // Can be null
}

// When fetched:
.populate('trailerId', 'registrationNumber type')

// Result:
{
  trailerId: {
    _id: "64def...",
    registrationNumber: "TR-456-EF",
    type: "Flatbed"
  }
}
```

**Business Logic:**
- Trailer is optional (some trips don't need trailers)
- If provided, trailer must exist
- Trailer details shown in PDF if present

### 3. Trip → User/Chauffeur (Required)
```javascript
Trip: {
  chauffeurId: ObjectId → User._id
}

// When fetched:
.populate('chauffeurId', 'firstName lastName')

// Result:
{
  chauffeurId: {
    _id: "64ghi...",
    firstName: "Jean",
    lastName: "Dupont"
  }
}
```

**Business Logic:**
- Every trip MUST have a chauffeur
- Chauffeur must be a User with role='chauffeur'
- Only the assigned chauffeur can update trip status/mileage
- Chauffeur can only see their own trips via /my-trips

### 4. Trip → FuelRecord (Indirect)
```javascript
// FuelRecord has:
{
  truck: ObjectId → Truck._id,
  date: Date,
  liters: Number,
  totalCost: Number
}

// To get fuel for a trip:
FuelRecord.find({ truck: trip.truckId })
```

**Business Logic:**
- Fuel records are linked to trucks, not trips directly
- When generating trip PDF, fetch all fuel records for that truck
- Future: Filter fuel records by trip date range
- Shows total fuel consumption in PDF

## 🎯 Key Business Rules

### Authorization Rules

1. **Admin Can:**
   - Create trips (assign chauffeur, truck, trailer)
   - Update any trip details (origin, destination, notes)
   - Delete trips
   - View all trips
   - Reassign trips to different chauffeurs/trucks

2. **Chauffeur Can:**
   - View only their assigned trips
   - Update status of their trips
   - Update mileage of their trips
   - Download PDF of their trips
   - **Cannot:** Create, delete, or reassign trips

3. **Both Can:**
   - View trip details
   - Download trip PDFs

### Status Workflow Rules

```
Planned → InProgress → Completed
   ↓
Cancelled (can cancel from any status)
```

**Rules:**
- New trips start as 'Planned'
- Only chauffeur can change status
- When status → 'Completed', mileageEnd should be provided
- Cannot go backwards (Completed → InProgress)

### Mileage Tracking Rules

1. **mileageStart:**
   - Set at trip creation or before starting
   - Should match truck's current odometer
   - Cannot be changed after trip starts

2. **mileageEnd:**
   - Set when completing trip
   - Must be greater than mileageStart
   - Used to calculate trip distance

3. **Distance Calculation:**
   ```javascript
   tripDistance = mileageEnd - mileageStart
   ```

## 💡 Real-World Example

### Scenario: Delivery from Paris to Lyon

#### 1. Admin Creates Trip
```javascript
POST /api/trips
{
  "tripId": "TRIP-2024-001",
  "truckId": "64abc123...",      // Volvo FH16, AB-123-CD
  "trailerId": "64def456...",    // Flatbed trailer
  "chauffeurId": "64ghi789...",  // Jean Dupont
  "origin": "Paris Warehouse",
  "destination": "Lyon Distribution Center",
  "mileageStart": 125000,
  "notes": "Fragile electronics, handle with care"
}
```

**System validates:**
- ✅ Truck AB-123-CD exists
- ✅ Trailer exists
- ✅ Jean Dupont is a chauffeur
- ✅ TRIP-2024-001 is unique
- ✅ Creates trip with status='Planned'

#### 2. Chauffeur Views Trip
```javascript
GET /api/trips/my-trips
// Jean logs in, sees his assigned trip
```

#### 3. Chauffeur Starts Trip
```javascript
PATCH /api/trips/64xyz.../status
{
  "status": "InProgress"
}
// Status changes to InProgress
```

#### 4. During Trip: Fuel Stop
```javascript
POST /api/fuel
{
  "truck": "64abc123...",
  "odometer": 125200,
  "liters": 150,
  "pricePerLiter": 1.45
}
// Fuel record created, linked to truck
```

#### 5. Chauffeur Completes Trip
```javascript
PATCH /api/trips/64xyz.../status
{
  "status": "Completed",
  "mileageEnd": 125465
}
// Trip completed
// Distance: 125465 - 125000 = 465 km
```

#### 6. Generate Report
```javascript
GET /api/trips/64xyz.../pdf
// PDF includes:
// - Trip: TRIP-2024-001
// - Truck: Volvo FH16 (AB-123-CD)
// - Trailer: Flatbed (TR-456-EF)
// - Driver: Jean Dupont
// - Route: Paris → Lyon
// - Distance: 465 km
// - Fuel: 150L @ 1.45€/L = 217.50€
// - Consumption: 32.25 L/100km
```

## 🔍 Data Flow Summary

```
┌──────────┐
│  Admin   │ Creates Trip
└────┬─────┘
     │
     ▼
┌──────────────────────────────────┐
│  Trip (Planned)                  │
│  - truckId → Truck               │
│  - trailerId → Trailer           │
│  - chauffeurId → User            │
│  - origin, destination           │
│  - mileageStart                  │
└────┬─────────────────────────────┘
     │
     ▼
┌──────────┐
│Chauffeur │ Views & Starts Trip
└────┬─────┘
     │
     ▼
┌──────────────────────────────────┐
│  Trip (InProgress)               │
│  - Chauffeur updates mileage     │
│  - Fuel records created          │
└────┬─────────────────────────────┘
     │
     ▼
┌──────────┐
│Chauffeur │ Completes Trip
└────┬─────┘
     │
     ▼
┌──────────────────────────────────┐
│  Trip (Completed)                │
│  - mileageEnd set                │
│  - Distance calculated           │
│  - Ready for reporting           │
└────┬─────────────────────────────┘
     │
     ▼
┌──────────┐
│  Anyone  │ Downloads PDF Report
└──────────┘
```

## 🚀 Future Enhancements

1. **Truck Availability Check**
   - Prevent double-booking trucks
   - Check if truck is in 'Active' status

2. **Date Range for Trips**
   - Add plannedDeparture, actualDeparture, actualArrival dates
   - Filter fuel records by trip date range

3. **Trip Validation**
   - Ensure mileageEnd > mileageStart
   - Validate status transitions

4. **Notifications**
   - Notify chauffeur when trip is assigned
   - Alert admin when trip is completed

5. **Analytics**
   - Average trip distance
   - Fuel efficiency per trip
   - Chauffeur performance metrics

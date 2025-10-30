# API Specification: Reflectary Backend

**Purpose:** A backend service providing REST-like API endpoints for managing notifications, forms, and timelines.

---

## API Endpoints

### POST /api/Notification/setMessage

**Description:** Creates a new notification message for a user with specified content, time, and topic.

**Requirements:**
- No specific requirements beyond basic argument presence

**Effects:**
- Adds a message for the user with given content, time and topic
- Returns Message id

**Request Body:**
```json
{
  "user": "string",
  "content": "string",
  "time": "string",
  "topic": "string"
}
```

**Success Response Body (Action):**
```json
{
  "message": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Notification/sendMessage

**Description:** Retrieves and removes a scheduled message when the current time matches the message's scheduled time.

**Requirements:**
- Message exists and current equals message.time

**Effects:**
- Returns (content, topic) and remove the message from state

**Request Body:**
```json
{
  "message": "string",
  "current": "string"
}
```

**Success Response Body (Action):**
```json
{
  "content": "string",
  "topic": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Notification/_getUserMessages

**Description:** Retrieves all messages for a specific user.

**Requirements:**
- None

**Effects:**
- Returns array of user messages

**Request Body:**
```json
{
  "user": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "user": "string",
    "content": "string",
    "time": "string",
    "topic": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Form/createForm

**Description:** Creates a new form with specified fields for a user.

**Requirements:**
- None

**Effects:**
- Creates a new form with the specified fields
- Returns Form id

**Request Body:**
```json
{
  "user": "string",
  "name": "string",
  "fields": [
    {
      "prompt": "string",
      "charLimit": "number"
    }
  ]
}
```

**Success Response Body (Action):**
```json
{
  "form": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Form/fillField

**Description:** Fills in a specific field of a form with the provided answer.

**Requirements:**
- Field exists
- Form exists
- Field belongs to user's form
- Form is not already submitted
- Answer length does not exceed charLimit

**Effects:**
- Updates the field with the provided answer

**Request Body:**
```json
{
  "user": "string",
  "field": "string",
  "answer": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Form/submitForm

**Description:** Submits a form, marking it as completed and recording the submission time.

**Requirements:**
- Form exists
- Form belongs to user
- Form is not already submitted

**Effects:**
- Marks form as submitted
- Records submission time

**Request Body:**
```json
{
  "user": "string",
  "form": "string",
  "current": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Form/_getFormFields

**Description:** Retrieves all fields for a specific form.

**Requirements:**
- None

**Effects:**
- Returns array of form fields

**Request Body:**
```json
{
  "form": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "form": "string",
    "prompt": "string",
    "charLimit": "number",
    "answer": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Timeline/createTimeline

**Description:** Creates a new timeline for a user with the specified name.

**Requirements:**
- Timeline name does not already exist for the user

**Effects:**
- Creates a new timeline
- Returns Timeline id

**Request Body:**
```json
{
  "user": "string",
  "name": "string"
}
```

**Success Response Body (Action):**
```json
{
  "timeline": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Timeline/addEntry

**Description:** Adds a new entry to an existing timeline.

**Requirements:**
- Timeline exists and belongs to user
- Entry name does not already exist in the timeline

**Effects:**
- Adds a new entry to the timeline
- Returns Entry id

**Request Body:**
```json
{
  "user": "string",
  "name": "string",
  "time": "string",
  "timeline": "string"
}
```

**Success Response Body (Action):**
```json
{
  "entry": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Timeline/removeEntry

**Description:** Removes an entry from a timeline.

**Requirements:**
- Entry exists
- Entry belongs to user's timeline

**Effects:**
- Removes the entry from the timeline

**Request Body:**
```json
{
  "user": "string",
  "entry": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Timeline/removeTimeLine

**Description:** Removes an entire timeline and all its entries.

**Requirements:**
- Timeline exists and belongs to user

**Effects:**
- Removes the timeline and all its entries

**Request Body:**
```json
{
  "user": "string",
  "timeline": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Timeline/_listEntriesChrono

**Description:** Lists all entries in a timeline in chronological order.

**Requirements:**
- None

**Effects:**
- Returns array of timeline entries sorted by time

**Request Body:**
```json
{
  "timeline": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "string",
    "timeline": "string",
    "name": "string",
    "time": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

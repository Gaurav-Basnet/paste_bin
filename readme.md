# 📋 Pastebin

A lightweight self-hosted pastebin service for creating, sharing, and managing text or code snippets — with optional expiration and a clean web UI.

---

## Features

- Create pastes with an optional title and expiration time
- Shareable short URLs (e.g. `/p/abc123`)
- Auto-expiry via MongoDB TTL index (10 minutes, 1 hour, or 1 day)
- Syntax selection in the frontend (plain text, JavaScript, Python, Bash, JSON, HTML)
- REST API for programmatic access
- Minimal, responsive frontend with copy-to-clipboard support

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Runtime   | Node.js                           |
| Framework | Express.js                        |
| Database  | MongoDB (via Mongoose)            |
| ID gen    | [nanoid](https://github.com/ai/nanoid) (6-char short IDs) |
| Frontend  | Vanilla HTML/CSS/JS + Tabler Icons |

---

## Project Structure

```
.
├── index.js                  # App entry point
├── routes/
│   └── pasteRoutes.js        # Route definitions
├── controllers/
│   └── pasteController.js    # Request handlers
├── model/
│   └── Paste.js              # Mongoose schema
└── view/
    └── index.html            # Frontend UI
```

---

## Getting Started

### Prerequisites

- Node.js v16+
- MongoDB running locally on port `27017`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pastebin.git
cd pastebin

# Install dependencies
npm install
```

### Run the App

```bash
node index.js
```

The server starts at **http://localhost:8000**.

---

## API Reference

### Create a Paste

```
POST /paste
```

**Request body:**

```json
{
  "title": "My snippet",
  "content": "console.log('hello')",
  "expiresIn": "1h"
}
```

| Field       | Type   | Required | Description                              |
|-------------|--------|----------|------------------------------------------|
| `content`   | string | ✅ Yes   | The paste content                        |
| `title`     | string | No       | Title (defaults to `"Untitled Paste"`)   |
| `expiresIn` | string | No       | `"10m"`, `"1h"`, `"1d"`, or omit for never |

**Response `201`:**

```json
{
  "message": "Paste created successfully",
  "url": "/p/abc123",
  "paste": { ... }
}
```

---

### Get a Paste

```
GET /p/:id
```

Returns paste content, or `410 Gone` if expired.

**Response `200`:**

```json
{
  "title": "My snippet",
  "content": "console.log('hello')"
}
```

---

### Delete a Paste

```
DELETE /paste/:id
```

**Response `200`:**

```json
{
  "message": "Paste deleted successfully"
}
```

---

### Get All Pastes

```
GET /paste
```

Returns all pastes sorted by newest first.

**Response `200`:**

```json
{
  "count": 3,
  "pastes": [ ... ]
}
```

---

## Data Model

```js
{
  title:     String,   // default: "Untitled Paste"
  content:   String,   // required
  shortId:   String,   // unique 6-char nanoid
  expiresAt: Date,     // null = never expires
  createdAt: Date,
  updatedAt: Date
}
```

Expiration is enforced by a **MongoDB TTL index** on `expiresAt` — expired documents are automatically deleted from the database.

---

## Configuration

To change the server URL for the frontend, edit the `APP_URL` constant in `view/index.html`:

```js
const APP_URL = "http://localhost:8000"; // ← change this one place only
```

To use a remote MongoDB instance, update the connection string in `index.js`:

```js
mongoose.connect("mongodb://127.0.0.1:27017/pastebin");
```

---

## License

MIT
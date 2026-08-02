# 🎵 Playlisto

> A self-hosted music streaming server that lets you stream your personal Google Drive music library through a modern web player or Kodi.

Playlisto acts as a proxy between Google Drive and client applications, allowing browsers and media players to stream audio without directly accessing Google Drive download endpoints.

The project consists of three major components:

- **Backend Streaming Server** (FastAPI)
- **Web Frontend** (React + Vite)
- **Kodi Addon**

---

# Features

- Stream music directly from Google Drive
- Modern web player
- Kodi addon support
- FLAC streaming with seek support
- Google Drive API integration
- Encrypted configuration storage
- Linux setup scripts
- Self-hosted architecture

### Supported Audio Formats

- FLAC
- MP3
- WAV
- M4A
- OGG

---

# High-Level Architecture

```text
                  Google Drive
                 (Music Library)
                        │
                        ▼
               ┌─────────────────┐
               │ Playlisto       │
               │ Backend API     │
               │ (FastAPI)       │
               └───────┬─────────┘
                       │
          ┌────────────┼────────────┐
          ▼                           ▼
    React Web Player           Kodi Addon
      (Frontend)          plugin.audio.playlisto
```

The backend handles all communication with Google Drive and streams audio to connected clients.

Clients never communicate directly with Google Drive.

---

# Repository Structure

```text
playlisto/
├── backend/
├── frontend/
├── plugin.audio.playlisto/
├── addonsZip/
├── logs/
├── start.sh
├── stop.sh
└── README.md
```

## backend/

Backend API responsible for Google Drive integration and audio streaming.

```text
backend/
├── app
│   ├── main.py
│   ├── drive.py
│   ├── streaming.py
│   ├── storage.py
│   └── models.py
│
├── data
│   ├── folders.json
│   ├── folders.enc
│   ├── providers.enc
│   ├── config.enc
│   ├── sources.enc
│   └── secret.key
│
├── requirements.txt
└── setup
    ├── arch.sh
    ├── ubuntu.sh
    └── termux.sh
```

---

## frontend/

React application providing the web music player.

```text
frontend/
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── pages
│   │   ├── PlayerPage.tsx
│   │   └── SettingsSidebar.tsx
│   └── assets
│
├── package.json
└── vite.config.ts
```

---

## plugin.audio.playlisto/

Kodi addon for streaming music through the Playlisto backend.

```text
plugin.audio.playlisto/
├── addon.xml
├── default.py
├── api.py
└── resources/
    └── settings.xml
```

---

# Backend Architecture

The backend is implemented using **FastAPI**.

Its responsibilities include:

- Communicating with the Google Drive API
- Retrieving folder contents
- Filtering supported audio files
- Streaming audio to clients
- Handling HTTP range requests

## `main.py`

Entry point of the FastAPI server.

Provides API endpoints such as:

```text
POST /load-folder
GET  /folders
GET  /stream/{file_id}
```

---

## `drive.py`

Responsible for interacting with the Google Drive API.

Functions include:

- Extract folder IDs
- Query Google Drive
- Filter supported audio files
- Build playlist metadata

---

## `streaming.py`

Implements the streaming proxy.

```text
Client
   │
   ▼
FastAPI /stream/{file_id}
   │
   ▼
Google Drive Download Endpoint
   │
   ▼
Audio Stream
```

This enables browser playback, seeking, and compatibility with multiple clients.

---

## `storage.py`

Handles encrypted local configuration and metadata.

Stores:

- Saved folders
- Providers
- Configuration
- Encryption keys

---

# Frontend Architecture

The frontend is built with **React** and **Vite**.

Responsibilities include:

- Displaying playlists
- Audio playback
- Player controls
- Settings management

## `PlayerPage`

Main playback interface.

Features:

- Play / Pause
- Next / Previous
- Playlist
- Seek bar

---

## `SettingsSidebar`

Allows users to configure:

- Google Drive folders
- Backend settings

Example streaming endpoint:

```text
http://localhost:8000/stream/{file_id}
```

---

# Kodi Addon

Playlisto includes a Kodi addon that connects to the backend and streams music directly inside Kodi.

Location:

```text
plugin.audio.playlisto/
```

## `addon.xml`

Defines addon metadata and entry points.

## `default.py`

Main addon script responsible for building Kodi navigation menus.

## `api.py`

Handles communication with the Playlisto backend API.

The addon streams music using the same backend streaming endpoint as the web player.

---

# Installation

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- Google Drive API credentials

---

## Clone Repository

```bash
git clone https://github.com/yourrepo/playlisto.git
cd playlisto
```

---

## Backend Setup

```bash
cd backend

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Start Everything

Start both frontend and backend:

```bash
./start.sh
```

Stop all services:

```bash
./stop.sh
```

---

# Kodi Addon Installation

Create the addon ZIP:

```bash
zip -r plugin.audio.playlisto.zip plugin.audio.playlisto
```

Inside Kodi:

```text
Settings
  └── Add-ons
        └── Install from ZIP file
```

Configure the backend URL in the addon settings.

---

# Security Notes

The Google Drive API credentials are only used by the backend.

**Never expose them in the frontend.**

Recommended restrictions:

- Restrict API access to the Google Drive API
- Restrict usage by server IP address

---

# Future Improvements

Planned features include:

- Metadata caching
- Album artwork
- Recursive folder traversal
- Playlist management
- Mobile-optimized UI
- Docker deployment
- Additional storage providers

---

# License

This project is licensed under the **MIT License**.

---

# Contributing

Contributions are welcome!

Typical workflow:

```bash
git checkout -b feature/my-feature
git commit
git push
```

Then open a Pull Request.

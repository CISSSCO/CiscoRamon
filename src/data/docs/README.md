
# Table of Contents

1.  [Playlisto](#orgf5f937e)
2.  [Features](#org5b369fb)
3.  [High Level Architecture](#org03a20bd)
4.  [Repository Structure](#org6fe0f80)
    1.  [backend/](#org6e36c19)
    2.  [frontend/](#org3ed2533)
    3.  [plugin.audio.playlisto/](#org42ca6b0)
5.  [Backend Architecture](#org7557523)
    1.  [main.py](#orgb558a97)
    2.  [drive.py](#org958fa49)
    3.  [streaming.py](#org25ef853)
    4.  [storage.py](#org0a5ac6e)
6.  [Frontend Architecture](#org8cac28b)
    1.  [PlayerPage](#orgdd24359)
    2.  [SettingsSidebar](#orgcc21a18)
7.  [Kodi Addon](#org36c4538)
    1.  [addon.xml](#org19a75dd)
    2.  [default.py](#org101c844)
    3.  [api.py](#org23b277d)
8.  [Installation](#orgfa6cd04)
    1.  [Prerequisites](#org38d5272)
    2.  [Clone repository](#orgfa02a47)
    3.  [Setup backend](#org3f4540e)
    4.  [Setup frontend](#org6dd35a7)
    5.  [Start full stack](#org9d0ad77)
9.  [Kodi Addon Installation](#org080127d)
10. [Security Notes](#org1913be3)
11. [Future Improvements](#orgf3d7bd7)
12. [License](#orgca4cad9)
13. [Contributing](#org0508f35)



<a id="orgf5f937e"></a>

# Playlisto

Playlisto is a self-hosted music streaming system designed to play music stored in Google Drive.

The system consists of three components:

-   Backend streaming server
-   Web frontend player
-   Kodi addon client

Playlisto acts as a proxy between Google Drive and client applications, allowing browsers and media players to stream audio without directly interacting with Google Drive download endpoints.

The project is intended for personal music libraries stored in Google Drive.


<a id="org5b369fb"></a>

# Features

-   Stream audio directly from Google Drive
-   Web player interface
-   Kodi addon support
-   FLAC streaming with seek support
-   Google Drive API integration
-   Encrypted configuration storage
-   Linux setup scripts
-   Self-hosted architecture

Supported formats include:

-   FLAC
-   MP3
-   WAV
-   M4A
-   OGG


<a id="org03a20bd"></a>

# High Level Architecture

The system architecture is composed of a backend streaming API and two clients.

                  Google Drive
                 (music files)
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
    (frontend)                 plugin.audio.playlisto

The backend handles communication with Google Drive and streams audio to clients.

Clients never connect to Google Drive directly.


<a id="org6fe0f80"></a>

# Repository Structure

    playlisto/
    ├── backend/
    ├── frontend/
    ├── plugin.audio.playlisto/
    ├── addonsZip/
    ├── logs/
    ├── start.sh
    ├── stop.sh
    └── README.org


<a id="org6e36c19"></a>

## backend/

Backend API responsible for Drive integration and streaming.

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


<a id="org3ed2533"></a>

## frontend/

React application used as the web player.

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


<a id="org42ca6b0"></a>

## plugin.audio.playlisto/

Kodi addon for streaming music from the Playlisto backend.

    plugin.audio.playlisto/
    ├── addon.xml
    ├── default.py
    ├── api.py
    └── resources/settings.xml


<a id="org7557523"></a>

# Backend Architecture

The backend is implemented using FastAPI.

Responsibilities include:

-   communicating with Google Drive API
-   retrieving folder contents
-   filtering audio files
-   streaming audio to clients
-   handling range requests

Important modules:


<a id="orgb558a97"></a>

## main.py

Entry point of the FastAPI server.

Defines API routes such as:

    POST /load-folder
    GET  /folders
    GET  /stream/{file_id}


<a id="org958fa49"></a>

## drive.py

Handles Google Drive API communication.

Responsibilities:

-   extract folder IDs
-   query Google Drive API
-   filter supported audio files
-   build playlist metadata


<a id="org25ef853"></a>

## streaming.py

Handles streaming proxy logic.

Flow:

    Client
      │
      ▼
    FastAPI /stream/{file_id}
      │
      ▼
    Google Drive download endpoint
      │
      ▼
    streamed chunks returned to client

This enables proper browser playback and seeking.


<a id="org0a5ac6e"></a>

## storage.py

Handles local data persistence.

Used for storing:

-   saved folders
-   providers
-   configuration
-   encryption keys


<a id="org8cac28b"></a>

# Frontend Architecture

The frontend is built using React and Vite.

Main responsibilities:

-   display playlist
-   audio playback
-   player controls
-   settings configuration

Important components:


<a id="orgdd24359"></a>

## PlayerPage

The main player interface.

Features:

-   play and pause
-   next and previous track
-   track list
-   seek bar


<a id="orgcc21a18"></a>

## SettingsSidebar

Allows users to configure:

-   Google Drive folders
-   backend settings

Audio playback uses the backend streaming endpoint.

Example:

    http://localhost:8000/stream/{file_id}


<a id="org36c4538"></a>

# Kodi Addon

Playlisto includes a Kodi addon allowing playback directly inside Kodi.

Location:

plugin.audio.playlisto/

Important files:


<a id="org19a75dd"></a>

## addon.xml

Defines addon metadata and entrypoints.


<a id="org101c844"></a>

## default.py

Main addon script.

Responsible for building Kodi navigation menus.


<a id="org23b277d"></a>

## api.py

Handles communication with the Playlisto backend API.

Kodi streams audio using the same backend streaming endpoint.


<a id="orgfa6cd04"></a>

# Installation


<a id="org38d5272"></a>

## Prerequisites

-   Python 3.10 or newer
-   Node.js 18 or newer
-   npm
-   Google Drive API key


<a id="orgfa02a47"></a>

## Clone repository

    git clone https://github.com/yourrepo/playlisto.git
    cd playlisto


<a id="org3f4540e"></a>

## Setup backend

    cd backend
    
    python -m venv .venv
    source .venv/bin/activate
    
    pip install -r requirements.txt

Run server:

    uvicorn app.main:app --reload

Backend runs at:

<http://localhost:8000>


<a id="org6dd35a7"></a>

## Setup frontend

    cd frontend
    
    npm install
    npm run dev

Frontend runs at:

<http://localhost:5173>


<a id="org9d0ad77"></a>

## Start full stack

From project root:

    ./start.sh

Stop services:

    ./stop.sh


<a id="org080127d"></a>

# Kodi Addon Installation

Create zip archive:

    zip -r plugin.audio.playlisto.zip plugin.audio.playlisto

Install inside Kodi:

Settings → Add-ons → Install from zip file

Configure backend URL inside addon settings.


<a id="org1913be3"></a>

# Security Notes

The Google Drive API key is used only by the backend.

Never expose the API key in frontend code.

Recommended restrictions:

-   restrict API key to Google Drive API
-   restrict by server IP


<a id="orgf3d7bd7"></a>

# Future Improvements

Possible future features:

-   metadata caching
-   album artwork
-   recursive folder traversal
-   playlist saving
-   mobile optimized UI
-   Docker deployment
-   additional storage providers


<a id="orgca4cad9"></a>

# License

MIT License


<a id="org0508f35"></a>

# Contributing

Contributions are welcome.

Suggested workflow:

    git checkout -b feature/my-feature
    git commit
    git push

Open a pull request.


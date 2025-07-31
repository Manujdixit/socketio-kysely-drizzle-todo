# SocketIO Kysely Drizzle Todo App

## Overview

A full-stack collaborative todo application featuring real-time updates, group management, and authentication. Built with a modern tech stack using React, Vite, Socket.IO, Kysely, Drizzle ORM, and TypeScript.

---

## Features

- Real-time task creation, update, and deletion (Socket.IO)
- Group/room management: join, leave, create groups
- User authentication: register, login, logout
- QR code scanning for joining groups
- Modern UI with lucide-react icons
- Context Providers for auth, socket, and group state
- Custom hooks for todos, groups, authentication, and socket events
- Collaborative task management within groups/rooms

---

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Socket.IO Client, lucide-react icons
- **Backend**: Node.js, TypeScript, Socket.IO, Kysely, Drizzle ORM
- **Database**: PostgreSQL (or compatible SQL DB)
- **Other**: html5-qrcode (QR scanner), Zod (validation), Context API

---

## Architecture

### Client (Frontend)

- **React + Vite**: SPA with functional components and hooks
- **Socket.IO**: Real-time communication for tasks and group events
- **Custom Hooks**: For todos, groups, authentication, and socket events
- **UI/UX**: Responsive design, overlays, sheets, sidebar, and lucide-react icons

### Server (Backend)

- **Node.js + TypeScript**: API and Socket.IO server
- **Socket.IO**: Handles real-time events (task CRUD, room join/leave, user presence)
- **Kysely + Drizzle ORM**: Database abstraction and migrations
- **Authentication**: Token-based, user sessions tracked via localStorage

## User Flow

1. **Register/Login:**

   - User registers or logs in via the client UI
   - Credentials are sent to the backend REST API; a token/userId is stored in localStorage

2. **Authentication:**

   - On app load, the client checks localStorage for authentication and identifies the user to the backend via Socket.IO

3. **Group/Room Management:**

   - User can create a new group/room or join an existing one (via room ID or QR code)
   - Joining triggers both an API call (for membership) and a Socket.IO event (for real-time presence)

4. **Task Management:**

   - User creates, updates, or deletes tasks in dashboard or group context
   - Task actions emit Socket.IO events; backend updates DB and broadcasts changes to relevant users/rooms

5. **Real-Time Collaboration:**

   - All group members see updates instantly; dashboard tasks are private to the user

6. **Logout:**
   - User logs out, clearing localStorage and disconnecting the socket

---

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database

### 1. Clone the Repository

```sh
git clone https://github.com/Manujdixit/socketio-kysely-drizzle-todo.git
cd socketio-kysely-drizzle-todo
```

### 2. Install Dependencies

#### Backend

```sh
cd backend
npm install
```

#### Client

```sh
cd ../client
npm install
```

### 3. Configure Environment

- **Backend**: Create a `.env` file in `backend/` with your database connection string and any secrets
- **Client**: Update API/socket URLs in `client/src/lib/utils.ts` if needed

### 4. Run Database Migrations

```sh
cd backend
npm run db:all
```

### 5. Start the Backend (Server)

```sh
npm run dev
```

### 6. Start the Frontend (Client)

```sh
cd ../client
npm run dev
```

### 7. Access the App

- Open [http://localhost:5173](http://localhost:5173) in your browser

---

## Folder Structure

```
backend/
  src/
    controllers/
    database/
    middleware/
    models/
    routes/
    services/
    socket/
    types/
    utils/
  drizzle.config.ts
  package.json

client/
  src/
    components/
    context/
    hooks/
    lib/
    pages/
    socket/
    types/
    utils/
  package.json
```

---

## Usage

- Register or login to create your user
- Create or join groups (rooms) to collaborate
- Add, edit, or delete tasks in real-time
- Use the sidebar to navigate between dashboard and groups
- Scan QR codes to join groups easily

---

## Contributing

Pull requests and issues are welcome! Please follow conventional commit messages and ensure code is formatted with Prettier/ESLint.

---

## License

MIT

---

## Author

Manuj Dixit

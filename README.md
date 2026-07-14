# Chatty

A full-stack real-time chat application that lets users find and connect with others through a unique code-based search system, then message instantly with live, bidirectional communication.

## ✨ Features

- **Real-time messaging** powered by Socket.IO for instant, bidirectional communication between users.
- **Unique user code-based search system** — discover and connect with other users for private conversations without needing usernames or emails.
- **Persistent chat history** — user profiles, messages, and conversation history stored in MongoDB.
- **Efficient global state management** using Zustand for a fast, predictable client experience.
- **Full-stack MERN architecture** — React frontend, Node.js/Express backend.

## 🛠️ Tech Stack

**Frontend:** React, Zustand
**Backend:** Node.js, Express
**Real-time Communication:** Socket.IO
**Database:** MongoDB

## 📂 Project Structure

```
Chatty/
├── backend/       # Express API, Socket.IO server, auth
├── frontend/      # React client
├── package.json
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/rishantsingh0707/Chatty.git
cd Chatty

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory with the following:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL= your_frontend_url
CLOUDINARY_API_KEY= your_cloudinary_api_key
CLOUDINARY_API_SECRET= your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME= your_cloudinary_cloud_name

```

Create a `.env` file in the `backend` directory with the following:

```

VITE_API_URL=your_backend_url

```
### Running Locally

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Live Demo

[Demo link](https://chatty-9kn5-3lgvk886z-rishantsingh0707s-projects.vercel.app/)

## 👤 Author

**Rishant Singh**
[GitHub](https://github.com/rishantsingh0707) · [LinkedIn](https://www.linkedin.com/in/rishant-singh1408)
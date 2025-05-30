# Login System

A full-stack login system built with React (Vite) and Express.js.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas account)

## Setup

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/login-system
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Features

- User registration (Sign Up)
- User authentication (Sign In)
- Form validation
- Error handling
- Responsive design using Material-UI

## Tech Stack

- Frontend:
  - React (Vite)
  - Material-UI
  - Axios
  - React Router

- Backend:
  - Express.js
  - MongoDB
  - Mongoose
  - bcryptjs
  - jsonwebtoken 
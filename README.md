# PerfectChat 🔥

![React](https://img.shields.io/badge/React-18-blue)
![Firebase](https://img.shields.io/badge/Firebase-9-orange)
![Vite](https://img.shields.io/badge/Vite-4.x-yellow)

Real-time chat application built with React and Firebase. Features Google authentication, instant messaging, and image sharing.

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- npm v8+
- Firebase account

## Installation

```bash
# Clone the repository
git clone https://github.com/maksimaleinikov/perfectChat.git
cd perfectChat

# Install dependencies
npm install

# Start development server
npm run dev
```

## Firebase setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" → Name it → Continue
3. Enable Google Analytics (optional) → Create Project

### 2. Configure Services

### Authentication

1. Go to Authentication → Sign-in method
2. Enable "Google" provider
3. Click "Save"

### Firestore Database

1. Go to Firestore Database → Create Database
2. Start in "test mode" → Next
3. Select location → Enable

### Storage

1. Go to Storage → Get Started
2. Start in "test mode" → Next
3. Select location → Done

### 3. Connect to App

1. Create a .env file in the project root
2. Fill it using this template (get values from Firebase Console)

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

➡ **Access the app:** [http://localhost:3000](http://localhost:3000)

## 💻 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

## 🌐 Deployment

```bash
# Initialize Firebase Hosting (run once)
firebase init hosting
# Select: Existing project, public directory 'dist', SPA: Yes

# Build and deploy
npm run build
firebase deploy
```

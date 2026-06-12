# TravelGo ✈️🌍

TravelGo is a premium travel planning and booking platform built with the MERN stack (MongoDB, Express, React, Node.js). It features a modern, responsive user interface with luxurious design aesthetics and a robust backend for managing destinations, packages, and bookings.

## 🌟 Key Features

- **User Authentication**: Secure JWT-based login and registration.
- **Premium UI/UX**: Designed with Tailwind CSS, Framer Motion animations, and a focus on visual excellence.
- **Dynamic Tour Packages**: Browse, filter, and search through curated luxury travel packages.
- **Booking System**: Seamlessly book packages with intuitive modals and tracking.
- **Admin Dashboard**: Comprehensive control panel to manage inquiries, users, and bookings.
- **Responsive Design**: Flawlessly optimized for desktop, tablet, and mobile viewing.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, React Router, React Leaflet.
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT.
- **Deployment Ready**: Optimized for Vercel with Serverless Functions.

## 📂 Project Structure

```
travelgo/
├── frontend/             # React (Vite) application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages (Home, Packages, Admin Dashboard, etc.)
│   │   ├── utils/        # API configuration and utilities
│   │   └── routes/       # React Router configurations
│   ├── index.html
│   └── vite.config.js
├── backend/              # Node.js/Express server
│   ├── model/            # Mongoose schemas
│   ├── routers/          # Express route handlers
│   ├── controller/       # Business logic controllers
│   ├── Server.js         # Entry point (Vercel Serverless adapted)
│   └── seedPackages.js   # Database seeding scripts
├── vercel.json           # Vercel monorepo deployment config
├── .env.example          # Environment variables template
└── package.json          # Root Monorepo configuration
```

## 🚀 Local Development

1. **Clone the repository.**
2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
3. **Set up Environment Variables:**
   Rename `.env.example` to `.env` inside the `backend` folder and provide your MongoDB connection string.
4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *This command spins up both the frontend (Vite) and backend (Express) concurrently.*

## 🌍 Production Deployment

TravelGo is pre-configured to be deployed as a Monorepo on **Vercel**. 
Please see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for step-by-step dashboard instructions, or [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for general deployment architectures.

---
*Built for unforgettable journeys.*
# 🌍 TravelGo - Tour Planning Agency

A full-stack MERN application for a tour planning agency with package booking, user authentication, admin dashboard, and payment integration.

## 🚀 Features

- **User Authentication** - Sign up, login, JWT-based auth
- **Tour Packages** - Browse, search, and filter tour packages
- **Booking System** - Book tours with payment integration (Razorpay)
- **Admin Dashboard** - Manage packages, bookings, users, and content
- **Wishlist** - Save favorite packages
- **Reviews & Ratings** - User reviews for packages
- **Responsive Design** - Mobile-friendly UI

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcryptjs
- **Payments:** Razorpay

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd tour-planning-agency-main

# Install all dependencies
npm run install:all
# OR manually:
npm install --prefix frontend
npm install --prefix backend
```

## ⚙️ Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/travelgo?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Frontend
The frontend is pre-configured to proxy API calls to `http://localhost:5000`. Modify `vite.config.js` if needed.

## 🏃 Run the Application

### Development Mode (Both Frontend & Backend)
```bash
npm run dev
# or
npm start
```

This runs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Run separately
```bash
# Backend only
npm run dev --prefix backend

# Frontend only
npm run dev --prefix frontend
```

### Build for Production
```bash
npm run build --prefix frontend
```

## 📁 Project Structure

```
tour-planning-agency-main/
├── backend/
│   ├── controller/     # Route handlers
│   ├── model/          # Mongoose models
│   ├── routers/        # API routes
│   ├── utlis/          # Utilities (auth, jwt, upload)
│   ├── Server.js       # Main server file
│   └── .env            # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── routes/     # Route definitions
│   │   ├── context/    # React context (Auth, etc.)
│   │   ├── assets/     # Static assets
│   │   └── utils/      # Helper functions
│   └── dist/           # Production build
├── .gitignore
├── package.json        # Root scripts (concurrently)
└── README.md
```

## 🔑 Default Admin Credentials

After first run, create an admin user via:
```bash
node backend/seedAdmin.js
```

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | User login |
| GET | /api/packages | Get all packages |
| POST | /api/bookings | Create booking |
| GET | /api/admin/... | Admin routes |

## ⚠️ Security Notes

- Change `JWT_SECRET` in production
- Use strong MongoDB credentials
- Enable proper Network Access in MongoDB Atlas
- Never commit `.env` file to version control

## 📄 License

ISC
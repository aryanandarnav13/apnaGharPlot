# 🏡 ApnaGhar Plots

A modern, full-stack web application for land selling and plot management business. Built with React, Node.js, Express, PostgreSQL, and Cloudinary for permanent image storage.

**Live Application**: [https://apna-ghar-plot.vercel.app](https://apna-ghar-plot.vercel.app)

---

## 📋 Description

ApnaGhar Plots LLP is a bilingual (Hindi/English) real estate platform designed specifically for land selling businesses. The application features a modern UI, complete admin dashboard, inquiry management system, and secure cloud storage for media files.

---

## ✨ Key Features

### User Features
- 🌐 **Bilingual Support** - Complete Hindi/English translations (default: Hindi)
- 🏘️ **Browse Plots** - View available plots with images, videos, and detailed information
- 🔍 **Smart Filters** - Filter by location, status, and price range (collapsible on mobile)
- 📱 **Responsive Design** - Mobile-first, works seamlessly on all devices
- 📞 **Inquiry System** - Submit inquiries to get contact details (no login required)
- 🏠 **House Design Visualization** - View associated house designs for each plot
- 🗺️ **Interactive Maps** - Google Maps integration for plot locations
- 🎥 **Media Galleries** - Auto-sliding image and video carousels
- 🔒 **Price Control** - Configurable price display (exact, masked, or hidden)

### Admin Features
- 🔐 **Secure Admin Panel** - JWT-based authentication
- 📊 **Dashboard** - Overview of plots and inquiries
- 🏗️ **Plot Management** - Full CRUD operations for plots
- 📧 **Inquiry Management** - Track and update inquiry status (Inquired, In Progress, Booked, Closed)
- 🏘️ **House Design Management** - Manage house designs linked to plots
- 👤 **Owner Info Management** - Display team/owner information on homepage
- ⚙️ **Settings** - Configure default language, contact information
- ☁️ **Cloud Storage** - Cloudinary integration for permanent image/video storage

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI framework
- **Vite** - Build tool
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling
- **i18next** - Internationalization
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express** 4.18.2 - Web framework
- **Sequelize** 6.35.0 - ORM
- **PostgreSQL** - Database (via pg & pg-hstore)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud media storage

---

## 📁 Project Structure

```
apnaGharPlot/
├── backend/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── upload.js          # File upload (Multer + Cloudinary)
│   ├── models/
│   │   ├── User.js
│   │   ├── Plot.js
│   │   ├── HouseDesign.js
│   │   ├── Inquiry.js
│   │   ├── OwnerInfo.js
│   │   └── Settings.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── plots.js
│   │   ├── houseDesigns.js
│   │   ├── inquiries.js
│   │   ├── ownerInfo.js
│   │   ├── settings.js
│   │   └── upload.js
│   ├── .env                   # Environment variables
│   ├── server.js              # Entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── PlotCard.jsx
    │   │   ├── MediaSlider.jsx
    │   │   ├── ImageUpload.jsx
    │   │   └── BackButton.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Plots.jsx
    │   │   ├── PlotDetail.jsx
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminPlots.jsx
    │   │       ├── AdminHouseDesigns.jsx
    │   │       ├── AdminInquiries.jsx
    │   │       ├── AdminOwnerInfo.jsx
    │   │       └── AdminSettings.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── i18n/
    │   │   ├── config.js
    │   │   └── locales/
    │   │       ├── en.json
    │   │       └── hi.json
    │   ├── App.jsx
    │   └── main.jsx
    ├── vercel.json            # Vercel routing config
    └── package.json
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn
- Cloudinary account (free tier)

### 1. Clone Repository
```bash
git clone https://github.com/aryanandarnav13/apnaGharPlot.git
cd apnaGharPlot
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create `backend/.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/apnaghar_plots

# JWT
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Cloudinary (for image/video storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE apnaghar_plots;
\q
```

#### Start Backend Server
```bash
npm start
# Server will run on http://localhost:5000
```

#### Seed Database (Optional)
Visit: http://localhost:5000/api/seed-database

This will create:
- Admin user
- Sample plots
- Sample house designs
- Sample inquiries
- Owner info
- Default settings

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment Variables
Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Server
```bash
npm run dev
# App will run on http://localhost:3000
```

### 4. Access Application

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:5000/api

**Admin Credentials**:
- Email: admin@example.com
- Password: password123

---

## 🌐 Production Deployment

### Architecture
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Render PostgreSQL
- **Media Storage**: Cloudinary

### 1. Setup Cloudinary

1. Create free account: https://cloudinary.com/users/register/free
2. Get credentials from dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 2. Deploy Backend (Render)

#### A. Create PostgreSQL Database
1. Go to https://dashboard.render.com
2. Click "New" → "PostgreSQL"
3. Configure:
   - Name: apnaghar-plots-db
   - Region: Oregon (or closest)
   - Plan: Free
4. Click "Create Database"
5. Copy **Internal Database URL**

#### B. Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - Name: apnagharplot-backend
   - Root Directory: backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

#### C. Set Environment Variables
Add these in Render dashboard (Environment tab):
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<paste Internal Database URL from step A>
JWT_SECRET=<generate strong random string>
JWT_EXPIRE=7d
FRONTEND_URL=https://apna-ghar-plot.vercel.app
CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_API_KEY=<your API key>
CLOUDINARY_API_SECRET=<your API secret>
```

4. Click "Create Web Service"
5. Wait for deployment (3-5 minutes)
6. Copy your backend URL: `https://apnagharplot-backend.onrender.com`

#### D. Seed Production Database
Visit: `https://apnagharplot-backend.onrender.com/api/seed-database`

### 3. Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: dist

4. Add Environment Variable:
   ```
   VITE_API_URL=https://apnagharplot-backend.onrender.com/api
   ```

5. Click "Deploy"
6. Wait for deployment (1-2 minutes)
7. Your app is live! 🎉

### 4. Post-Deployment

1. **Test the application**:
   - Visit your Vercel URL
   - Browse plots
   - Submit test inquiry
   - Login to admin panel

2. **Change admin password**:
   - Login with demo credentials
   - Go to admin dashboard
   - Change password immediately

3. **Upload actual plot data**:
   - Add your plots via admin panel
   - Upload images (stored permanently on Cloudinary)
   - Configure plot details, pricing, locations

4. **Configure settings**:
   - Set default language
   - Update contact information
   - Add owner/team information

---

## 🔑 Important Notes

### Security
- Change default admin password immediately after deployment
- Never commit `.env` files to Git
- Use strong JWT secret (32+ characters)
- Keep Cloudinary credentials secure

### Free Tier Limits
- **Render**: Backend sleeps after 15 mins of inactivity (wakes up on request)
- **Cloudinary**: 25 GB storage, 25 GB bandwidth/month
- **Vercel**: Unlimited bandwidth for hobby projects

### Troubleshooting
- **Backend not responding**: Check Render logs for errors
- **Images not loading**: Verify Cloudinary credentials
- **CORS errors**: Check `FRONTEND_URL` matches your Vercel domain
- **Database errors**: Verify `DATABASE_URL` is correct

---

## 📞 Support & Contact

For any issues or questions, please open an issue on GitHub or contact the development team.

---

## 👨‍💻 Developer

Built for ApnaGhar Plots - Making land ownership accessible.




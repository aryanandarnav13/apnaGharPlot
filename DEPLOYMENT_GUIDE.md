# 🚀 Free Deployment Guide for ApnaGhar Plots

This guide will help you deploy your ApnaGhar Plots application for **FREE** using modern hosting platforms.

## 📋 Deployment Architecture

We'll use:
- **Frontend**: Vercel (Free tier - unlimited bandwidth)
- **Backend**: Render (Free tier - 750 hours/month)
- **Database**: Render PostgreSQL (Free tier - expires after 90 days) or Supabase (Free tier - permanent)

---

## 🗄️ Step 1: Deploy Database

### Option A: Render PostgreSQL (Recommended for Quick Setup)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - **Name**: `apnaghar-plots-db`
   - **Database**: `apnaghar_plots`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your location
   - **Instance Type**: Free
   - Click "Create Database"

3. **Get Database Credentials**
   - After creation, you'll see:
     - **Internal Database URL**: Use this for backend on Render
     - **External Database URL**: Use this for local development
   - Copy the **Internal Database URL** - you'll need it later

### Option B: Supabase PostgreSQL (Recommended for Permanent Free)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - **Name**: `apnaghar-plots`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
   - Click "Create new project"

3. **Get Database Connection String**
   - Go to Project Settings → Database
   - Find "Connection string" → "URI"
   - Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)
   - Replace `[YOUR-PASSWORD]` with your actual password

---

## 🖥️ Step 2: Deploy Backend (Render)

1. **Push Your Code to GitHub**
   ```bash
   # If you haven't already
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/your-username/apnaghar-plots.git
   git branch -M main
   git push -u origin main
   ```

2. **Create Render Web Service**
   - Go to [render.com](https://render.com) dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `apnaghar-plots` repository

3. **Configure Web Service**
   - **Name**: `apnaghar-plots-backend`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:

   ```
   NODE_ENV=production
   PORT=5000
   
   # Database (use the URL you copied earlier)
   DATABASE_URL=<your-database-url-from-step-1>
   
   # Or if using separate variables:
   DB_HOST=<from-render-or-supabase>
   DB_PORT=5432
   DB_NAME=apnaghar_plots
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   
   # JWT (generate a random secret)
   JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_very_secure_and_random
   JWT_EXPIRE=7d
   
   # Frontend URL (we'll update this after deploying frontend)
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. **Create Web Service**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Once deployed, copy your backend URL (e.g., `https://apnaghar-plots-backend.onrender.com`)

6. **Seed the Database**
   After deployment, run the seed command:
   - In Render dashboard, go to your web service
   - Click "Shell" tab (or use Render's console)
   - Run: `cd backend && node config/seed.js`
   
   Or use this migration endpoint:
   - Visit: `https://your-backend-url.onrender.com/health`
   - Then manually insert data via SQL or use your local machine to seed:
   ```bash
   # Update backend/.env with production DATABASE_URL
   cd backend
   node config/seed.js
   ```

---

## 🌐 Step 3: Deploy Frontend (Vercel)

1. **Update Frontend API URL**
   
   Edit `frontend/.env.production` (create if doesn't exist):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

   Or update `frontend/src/services/api.js`:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com/api';
   ```

2. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add production API URL"
   git push
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "Add New" → "Project"
   - Import your `apnaghar-plots` repository

4. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

6. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-app.vercel.app`

---

## 🔄 Step 4: Update Backend with Frontend URL

1. **Go back to Render**
   - Open your backend web service
   - Go to "Environment" tab
   - Update `FRONTEND_URL` to your Vercel URL:
     ```
     FRONTEND_URL=https://your-app.vercel.app
     ```
   - Click "Save Changes"
   - Service will auto-redeploy

---

## ✅ Step 5: Test Your Deployment

1. **Visit your frontend URL**: `https://your-app.vercel.app`

2. **Test these features**:
   - ✅ Home page loads
   - ✅ Language switcher works
   - ✅ Plots listing page shows all plots
   - ✅ Plot detail page loads
   - ✅ Inquiry form submission works
   - ✅ Admin login works: `admin@example.com` / `password123`
   - ✅ Admin can manage plots, house designs, owner info, inquiries

3. **If something doesn't work**:
   - Check Render logs: Dashboard → Your Service → Logs
   - Check browser console (F12)
   - Check CORS settings in backend

---

## 🎯 Alternative Free Hosting Options

### Option 1: All on Render

**Frontend + Backend + Database on Render**

- **Database**: Render PostgreSQL (Free - 90 days)
- **Backend**: Render Web Service (Free)
- **Frontend**: Render Static Site (Free)

**Frontend Deployment on Render:**
- New → Static Site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

### Option 2: Railway (If you have credit card for verification)

**All-in-One on Railway**

1. Sign up at [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add PostgreSQL database
4. Deploy backend and frontend in same project
5. Environment variables auto-configured

### Option 3: Netlify (Frontend) + Render (Backend + Database)

Same as Vercel + Render, just use Netlify instead:
- Go to [netlify.com](https://netlify.com)
- Drag and drop your `frontend/dist` folder after building
- Or connect GitHub and auto-deploy

---

## 📝 Important Notes

### Render Free Tier Limitations
- **Web Services**: Spin down after 15 minutes of inactivity
- **First request after sleep**: Takes 30-60 seconds to wake up
- **Hours**: 750 free hours per month (enough for 1 app running 24/7)
- **Database**: Free for 90 days, then expires (need to upgrade or migrate)

### Solutions for "Sleeping" Issue
1. **Use a uptime monitor** (free):
   - [UptimeRobot](https://uptimerobot.com) - ping your backend every 5 minutes
   - [Cron-job.org](https://cron-job.org) - schedule pings

2. **Add to environment variables**:
   ```
   RENDER_EXTERNAL_URL=https://your-backend-url.onrender.com
   ```

### Vercel Limitations
- **Build time**: 45 minutes (more than enough)
- **Bandwidth**: Unlimited on free tier
- **Deployments**: Unlimited

---

## 🔒 Security Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change admin password from default
- [ ] Update email in footer and contact details
- [ ] Update social media links
- [ ] Enable HTTPS (auto on Vercel/Render)
- [ ] Set up CORS properly (already configured)
- [ ] Test all forms and submissions
- [ ] Add Google Analytics (optional)

---

## 🐛 Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify all environment variables are set
- Check database connection string

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Make sure backend is deployed and running

### Database connection failed
- Verify database URL is correct
- Check if using "Internal" URL on Render (for backend on Render)
- Check if using "External" URL for local development

### Inquiry form not working
- Check backend logs
- Verify `/api/inquiries` endpoint is accessible
- Check browser console for errors

---

## 💰 Cost Breakdown

| Service | Free Tier | Limitations | Upgrade Cost |
|---------|-----------|-------------|--------------|
| Vercel | Unlimited | - | $20/month |
| Render Web Service | 750 hrs/month | Sleeps after 15 min | $7/month |
| Render PostgreSQL | 90 days | 1GB storage | $7/month |
| Supabase PostgreSQL | Forever | 500MB database | $25/month |
| **Total** | **FREE** | See limitations | ~$15-30/month |

---

## 🎉 You're Done!

Your ApnaGhar Plots application is now live and accessible worldwide for FREE!

**Share your links:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`

**Admin Access**: `https://your-app.vercel.app/login`

---

## 📞 Need Help?

If you face any issues during deployment:
1. Check the logs in Render/Vercel dashboard
2. Verify all environment variables
3. Test endpoints with Postman/Thunder Client
4. Check browser console for frontend errors

Good luck! 🚀


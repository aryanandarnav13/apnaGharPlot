# ✅ Quick Deployment Checklist

Follow this step-by-step checklist to deploy your ApnaGhar Plots application for FREE in under 30 minutes.

---

## Before You Start

- [ ] Code is working locally
- [ ] You have a GitHub account
- [ ] You have tested admin login and plot listing

---

## Step 1: Prepare Code (5 minutes)

### Option A: Keep MySQL (Limited Free Options)
- [ ] Code is ready as-is
- [ ] Check MYSQL_DEPLOYMENT.md for hosting options

### Option B: Switch to PostgreSQL (Recommended)
- [ ] Run: `cd backend && npm install pg pg-hstore`
- [ ] Run: `npm uninstall mysql2`
- [ ] Rename `backend/config/db.postgres.js` to `backend/config/db.js`
- [ ] Update `backend/package.json` dependencies

---

## Step 2: Push to GitHub (2 minutes)

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repository on GitHub.com
# Then push:
git remote add origin https://github.com/YOUR-USERNAME/apnaghar-plots.git
git branch -M main
git push -u origin main
```

- [ ] Code is on GitHub

---

## Step 3: Deploy Database (5 minutes)

### For PostgreSQL (Free Forever):

**Option 1: Supabase (Recommended)**
- [ ] Sign up at [supabase.com](https://supabase.com)
- [ ] Create new project: `apnaghar-plots`
- [ ] Set strong database password
- [ ] Go to Settings → Database → Copy "URI" connection string
- [ ] Save this connection string somewhere safe

**Option 2: Render (Free for 90 days)**
- [ ] Sign up at [render.com](https://render.com)
- [ ] New + → PostgreSQL
- [ ] Name: `apnaghar-plots-db`
- [ ] Create Database
- [ ] Copy "Internal Database URL"

---

## Step 4: Deploy Backend (10 minutes)

- [ ] Go to [render.com](https://render.com)
- [ ] New + → Web Service
- [ ] Connect your GitHub repository
- [ ] Configure:
  - **Name**: `apnaghar-plots-backend`
  - **Root Directory**: `backend`
  - **Runtime**: Node
  - **Build Command**: `npm install`
  - **Start Command**: `node server.js`
  - **Plan**: Free

- [ ] Add Environment Variables (Click "Advanced"):
  ```
  NODE_ENV=production
  PORT=5000
  DATABASE_URL=<paste-your-database-url-here>
  JWT_SECRET=<create-random-strong-secret-here>
  JWT_EXPIRE=7d
  FRONTEND_URL=https://your-app.vercel.app
  ```

- [ ] Create Web Service
- [ ] Wait for deployment (~5-10 minutes)
- [ ] Copy your backend URL (e.g., `https://apnaghar-plots-backend.onrender.com`)
- [ ] Test: Visit `https://your-backend-url.onrender.com/health`

---

## Step 5: Seed Database (3 minutes)

- [ ] In Render, go to your web service → "Shell" tab
- [ ] Run: `cd backend && node config/seed.js`
- [ ] Verify: "✅ Database seeded successfully!"

---

## Step 6: Deploy Frontend (5 minutes)

### Update API URL First:

**Create `frontend/.env.production`:**
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

- [ ] File created and saved

**Commit and push:**
```bash
git add .
git commit -m "Add production API URL"
git push
```

### Deploy to Vercel:

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] New Project → Import your repository
- [ ] Configure:
  - **Framework**: Vite
  - **Root Directory**: `frontend`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

- [ ] Add Environment Variable:
  ```
  VITE_API_URL=https://your-backend-url.onrender.com/api
  ```

- [ ] Deploy
- [ ] Wait 2-3 minutes
- [ ] Copy your Vercel URL (e.g., `https://apnaghar-plots.vercel.app`)

---

## Step 7: Update Backend CORS (2 minutes)

- [ ] Go back to Render → Your backend service
- [ ] Environment → Edit `FRONTEND_URL`
- [ ] Change to: `https://your-app.vercel.app`
- [ ] Save (will auto-redeploy)

---

## Step 8: Test Everything (5 minutes)

Visit your app: `https://your-app.vercel.app`

- [ ] Home page loads correctly
- [ ] Language switcher works (Hindi ↔ English)
- [ ] "Browse All Plots" button works
- [ ] Plots listing page shows plots
- [ ] Click on a plot → Detail page loads
- [ ] Images and videos show correctly
- [ ] House designs section appears (if plot has designs)
- [ ] Inquiry form appears
- [ ] Submit inquiry (with name + phone) → Success modal shows
- [ ] Admin login works: `https://your-app.vercel.app/login`
  - Email: `admin@example.com`
  - Password: `password123`
- [ ] Admin dashboard loads
- [ ] Can view/edit plots
- [ ] Can view inquiries
- [ ] Can change default language setting
- [ ] Can edit owner info
- [ ] Logout works

---

## Step 9: Final Touches (5 minutes)

### Security:
- [ ] Change admin password in database or through admin panel
- [ ] Update contact email in footer
- [ ] Update owner information
- [ ] Update social media links (or remove them)

### Optional - Prevent Backend Sleep:
- [ ] Sign up at [uptimerobot.com](https://uptimerobot.com)
- [ ] Add New Monitor:
  - **Type**: HTTP(s)
  - **URL**: `https://your-backend-url.onrender.com/health`
  - **Interval**: 5 minutes
- [ ] This keeps your backend awake!

---

## 🎉 Deployment Complete!

### Your Live URLs:
- **Website**: `https://your-app.vercel.app`
- **Admin Panel**: `https://your-app.vercel.app/login`
- **Backend API**: `https://your-backend.onrender.com`

### Share with clients:
```
Visit: https://your-app.vercel.app
Admin Access: https://your-app.vercel.app/login
```

---

## 🐛 Troubleshooting

### Backend won't start:
- Check Render logs
- Verify DATABASE_URL is correct
- Make sure all env variables are set

### Frontend can't load plots:
- Check browser console (F12)
- Verify `VITE_API_URL` is correct
- Make sure backend is running (visit /health endpoint)
- Check CORS settings

### Inquiry form not working:
- Check backend logs in Render
- Verify `/api/inquiries` endpoint works
- Test with Postman or Thunder Client

### Database empty:
- Run seed command again in Render Shell
- Or manually insert data via SQL

---

## 💰 Total Cost: $0/month

You've successfully deployed a full-stack application for FREE! 🚀

### When Free Tier Expires:

**Render PostgreSQL (after 90 days):**
- Option 1: Migrate to Supabase (permanent free)
- Option 2: Upgrade Render DB ($7/month)

**Render Backend (never expires but sleeps):**
- Use UptimeRobot to keep it awake
- Or upgrade to Starter ($7/month) for no sleep

**Vercel (never expires):**
- Free forever for personal projects! 🎉

---

## Need Help?

Refer to:
- `DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- `MYSQL_DEPLOYMENT.md` - MySQL hosting options
- Render Docs: [render.com/docs](https://render.com/docs)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)

Good luck! 🍀


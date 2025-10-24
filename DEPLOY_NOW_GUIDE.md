# 🚀 Deploy Your Project NOW - Step by Step

Your code is **ALREADY CONFIGURED** for deployment! Follow these exact steps.

---

## ⚠️ IMPORTANT: Database Choice

Your backend currently uses **MySQL**, but Render's free tier offers **PostgreSQL**.

**You have 2 options:**

### Option A: Switch to PostgreSQL (Recommended - Free Forever) ✅
- ✅ Free on Render (includes database)
- ✅ Free on Supabase (permanent)
- ✅ Takes 2 minutes to switch
- ✅ Follow **OPTION A** below

### Option B: Keep MySQL (Limited Free Options) ⚠️
- ⚠️ Few free hosting options
- ⚠️ May need to pay for database (~$5-10/month)
- See `MYSQL_DEPLOYMENT.md` for options

**Recommendation**: Use PostgreSQL (Option A) - it's free and better supported!

---

## 🧩 OPTION A: POSTGRESQL DEPLOYMENT (Recommended)

### STEP 0 — Switch to PostgreSQL (2 minutes)

```bash
# 1. Install PostgreSQL driver
cd backend
npm install pg pg-hstore
npm uninstall mysql2

# 2. Replace db.js with PostgreSQL version
# On Windows:
move config\db.js config\db.mysql.backup
move config\db.postgres.js config\db.js

# On Mac/Linux:
mv config/db.js config/db.mysql.backup
mv config/db.postgres.js config/db.js

# 3. Update package.json dependencies
# (npm already updated it in step 1)

# 4. Commit changes
cd ..
git add .
git commit -m "Switch to PostgreSQL for production deployment"
git push
```

**Done!** Your backend now supports PostgreSQL ✅

---

### STEP 1 — Prepare Environment Variables

You'll set these in Render dashboard (DON'T commit .env file):

```env
# Backend Environment Variables for Render
NODE_ENV=production
PORT=5000

# Database (Render will provide this URL after creating database)
DATABASE_URL=<will-get-from-render-in-step-3>

# JWT Secret (GENERATE A NEW ONE!)
JWT_SECRET=<generate-using-command-below>

# Frontend URL (will get from Vercel in step 5)
FRONTEND_URL=<will-get-from-vercel>
```

**Generate JWT_SECRET now:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output - you'll need it!

---

### STEP 2 — Deploy Backend on Render

1. **Go to**: https://render.com
2. **Sign in** with GitHub
3. Click **"New +"** → **"Web Service"**
4. **Connect your GitHub** repository (`apnaGharPlot`)
5. **Configure**:
   - **Name**: `apnagharplots-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. Click **"Advanced"** → **"Add Environment Variable"**

   Add these (leave DATABASE_URL empty for now):
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<paste-your-generated-secret>
   FRONTEND_URL=https://apnagharplots.vercel.app
   ```

7. **DON'T deploy yet!** First create database in next step.

---

### STEP 3 — Create PostgreSQL Database on Render

1. **Go to Render Dashboard** → **"New +"** → **"PostgreSQL"**
2. **Configure**:
   - **Name**: `apnagharplots-db`
   - **Database**: `apnaghar_plots`
   - **User**: (auto-generated)
   - **Region**: **Same as your backend service!**
   - **Instance Type**: `Free`
3. Click **"Create Database"**
4. Wait for database to be ready (~2 minutes)
5. Once ready, click on database → **Copy "Internal Database URL"**

   It looks like:
   ```
   postgresql://user:password@host:5432/database
   ```

6. **Go back to your backend service** → **"Environment"** tab
7. **Add new variable**:
   ```
   DATABASE_URL=<paste-internal-database-url-here>
   ```
8. **Save Changes** → Backend will auto-deploy

9. **Wait for deployment** (~5 minutes)

10. **Copy your backend URL**:
    ```
    https://apnagharplots-backend.onrender.com
    ```

11. **Seed the database**:
    - Go to your service → **"Shell"** tab
    - Run: `node config/seed.js`
    - Wait for "✅ Database seeded successfully!"

---

### STEP 4 — Deploy Frontend on Vercel

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. Click **"Add New..."** → **"Project"**
4. **Import** your `apnaGharPlot` repository
5. **Configure**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

6. Click **"Environment Variables"** → Add:
   ```
   VITE_API_URL=https://apnagharplots-backend.onrender.com/api
   ```
   (Use your actual backend URL from Step 3)

7. Click **"Deploy"**

8. **Wait for deployment** (~2-3 minutes)

9. **Your frontend is live!**
   ```
   https://apnagharplots.vercel.app
   ```
   (Or whatever Vercel gives you)

---

### STEP 5 — Connect Frontend & Backend

1. **Update Backend CORS**:
   - Go to Render → Your backend service
   - Go to **"Environment"** tab
   - Edit `FRONTEND_URL` variable
   - Change to your actual Vercel URL:
     ```
     FRONTEND_URL=https://apnagharplots.vercel.app
     ```
   - **Save** → Will auto-redeploy

2. **Test Your App**:
   - Visit: `https://apnagharplots.vercel.app`
   - Check if home page loads ✅
   - Check if plots load ✅
   - Test language switcher ✅
   - Try submitting an inquiry ✅

3. **If plots don't load**:
   - Open browser DevTools (F12) → Console
   - Check for CORS errors
   - Verify backend URL in Vercel env vars
   - Wait 1-2 minutes for CORS update to take effect

---

### STEP 6 — Post-Deployment (5 minutes)

1. **Login to Admin**:
   ```
   URL: https://apnagharplots.vercel.app/login
   Email: admin@example.com
   Password: password123
   ```

2. **Change Admin Password** (IMPORTANT!):
   - Go to admin dashboard
   - Change password to something secure

3. **Update Settings**:
   - Update owner information
   - Set default contact information
   - Choose default language (Hindi/English)

4. **Add Real Content** (optional):
   - Add your actual plots
   - Upload real images
   - Update contact information

5. **Set Up UptimeRobot** (Keeps backend awake):
   - Go to: https://uptimerobot.com
   - Sign up (free)
   - Add New Monitor:
     - Type: HTTP(s)
     - URL: `https://apnagharplots-backend.onrender.com/health`
     - Interval: 5 minutes
   - This prevents your backend from sleeping!

---

## 🎉 YOU'RE LIVE!

### Your URLs:
- **Frontend**: `https://apnagharplots.vercel.app`
- **Backend**: `https://apnagharplots-backend.onrender.com`
- **Admin Panel**: `https://apnagharplots.vercel.app/login`

### Share with Customers:
```
🏡 ApnaGhar Plots
Visit: https://apnagharplots.vercel.app
Browse plots, view house designs, submit inquiries!
```

---

## 🧩 OPTION B: MYSQL DEPLOYMENT

If you want to keep MySQL, see `MYSQL_DEPLOYMENT.md` for hosting options.

**Note**: Most require payment or have very limited free tiers.

---

## 🐛 Troubleshooting

### Backend won't start:
- Check Render logs (Dashboard → Your Service → Logs)
- Verify DATABASE_URL is set correctly
- Make sure all env variables are set

### Frontend can't connect:
- Check VITE_API_URL in Vercel (Settings → Environment Variables)
- Verify CORS: FRONTEND_URL in backend matches your Vercel URL
- Check browser console for errors (F12)

### Database connection error:
- Make sure you're using "Internal Database URL" (not External)
- Verify backend and database are in same region
- Check database is running (Render → Database → Status)

### Plots not loading:
- Make sure you ran seed script: `node config/seed.js`
- Check backend /health endpoint works
- Verify API_URL in frontend

### Inquiry form not working:
- Check backend logs
- Verify /api/inquiries endpoint is accessible
- Test with Postman: POST to your-backend/api/inquiries

---

## ⏱️ Total Deployment Time

- STEP 0 (PostgreSQL Switch): 2 minutes
- STEP 1 (Prepare): 2 minutes  
- STEP 2 (Backend): 5 minutes
- STEP 3 (Database): 5 minutes
- STEP 4 (Frontend): 3 minutes
- STEP 5 (Connect): 2 minutes
- STEP 6 (Post-Deploy): 5 minutes

**Total: ~25 minutes** ⏰

---

## ✅ Your Code is Already Ready!

✅ **PORT**: Already using `process.env.PORT || 5000`  
✅ **CORS**: Already configured with `process.env.FRONTEND_URL`  
✅ **API URL**: Frontend already uses `VITE_API_URL`  
✅ **Start Script**: `npm start` already in package.json  
✅ **Build Script**: `vite build` already configured  
✅ **Error Handling**: Already implemented  
✅ **Authentication**: Already working  
✅ **Database**: Just needs PostgreSQL driver (2 min fix)  

**You're ready to deploy RIGHT NOW!** 🚀

---

## 💰 Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| **Render Backend** | FREE | 750 hrs/month (enough for 24/7) |
| **Render PostgreSQL** | FREE | 90 days trial, then $7/month |
| **Supabase PostgreSQL** | FREE | Forever (500MB) ⭐ |
| **Vercel Frontend** | FREE | Forever ⭐ |
| **UptimeRobot** | FREE | Forever ⭐ |
| **Total** | **$0/month** | Completely free! 🎉 |

**Tip**: Use Supabase for database (free forever) instead of Render database (free for 90 days).

---

## 🆘 Need Help?

1. Check troubleshooting section above
2. Check Render/Vercel logs
3. Read `DEPLOYMENT_GUIDE.md` for more details
4. Check browser console (F12) for errors

---

## 🎯 Quick Checklist

Before deploying:
- [ ] JWT_SECRET generated
- [ ] PostgreSQL driver installed (`npm install pg pg-hstore`)
- [ ] db.js replaced with db.postgres.js
- [ ] Changes committed and pushed to GitHub

During deployment:
- [ ] Backend deployed on Render
- [ ] Database created on Render
- [ ] DATABASE_URL added to backend env
- [ ] Seed script run successfully
- [ ] Frontend deployed on Vercel
- [ ] VITE_API_URL set in Vercel
- [ ] FRONTEND_URL updated in backend

After deployment:
- [ ] Website loads correctly
- [ ] Admin login works
- [ ] Change admin password
- [ ] UptimeRobot monitor added

---

**Ready? Let's deploy!** 🚀

Start with **STEP 0** if using PostgreSQL (recommended), or skip to **STEP 2** if keeping MySQL.

Good luck! 🍀


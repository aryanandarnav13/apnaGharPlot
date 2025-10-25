# 🌩️ Cloudinary Setup Guide - Fix Image Storage Issue

## 🚨 The Problem

**Render's free tier uses ephemeral storage** - when your backend restarts (every 15 mins of inactivity), **ALL uploaded files are DELETED**! 

This is why your images turned black/corrupted today.

## ✅ The Solution: Cloudinary (FREE)

Cloudinary Free Tier includes:
- ✅ **25 GB storage**
- ✅ **25 GB bandwidth/month**
- ✅ **Permanent file storage** (never deleted)
- ✅ **Fast CDN delivery**
- ✅ **Automatic image optimization**

---

## 📋 Step-by-Step Setup

### 1️⃣ Create Cloudinary Account

1. Go to: https://cloudinary.com/users/register/free
2. Sign up with your email
3. Verify your email
4. Login to dashboard

### 2️⃣ Get Your Credentials

1. After login, you'll see your dashboard
2. Look for **"Account Details"** section or click on your profile icon → Settings → API Keys
3. You'll see:
   ```
   Cloud Name: your_cloud_name
   API Key: 123456789012345
   API Secret: abc123def456ghi789
   ```
4. **Copy these values** - you'll need them next

### 3️⃣ Add Credentials to Render

1. Go to: https://dashboard.render.com
2. Select your **backend service** (apnagharplot-backend)
3. Click **"Environment"** tab
4. Add these 3 environment variables:

| Key | Value |
|-----|-------|
| `CLOUDINARY_CLOUD_NAME` | (paste your cloud name) |
| `CLOUDINARY_API_KEY` | (paste your API key) |
| `CLOUDINARY_API_SECRET` | (paste your API secret) |

5. Click **"Save Changes"**
6. Render will automatically redeploy your backend

### 4️⃣ Test Image Upload

1. Wait 2-3 minutes for Render to redeploy
2. Go to your admin panel: https://apna-ghar-plot.vercel.app/admin
3. Try uploading a new image for a plot
4. Check the image URL - it should now be: `https://res.cloudinary.com/...`

---

## 🔍 Verify It's Working

**Before (Local Storage - BAD):**
```
https://apnagharplot-backend.onrender.com/uploads/img-12345.jpg
❌ Gets deleted on restart
```

**After (Cloudinary - GOOD):**
```
https://res.cloudinary.com/your_cloud_name/image/upload/v123/apnaghar-plots/img-12345.jpg
✅ Permanent storage
```

---

## 🎯 What Changed in Your Code

### Backend Changes:
1. ✅ `backend/config/cloudinary.js` - Cloudinary configuration
2. ✅ `backend/middleware/upload.js` - Uses memory storage instead of disk
3. ✅ `backend/routes/upload.js` - Uploads to Cloudinary cloud
4. ✅ `backend/server.js` - Removed local `/uploads` folder serving

### Frontend Changes:
1. ✅ `frontend/src/components/MediaSlider.jsx` - Handles both Cloudinary & legacy URLs
2. ✅ `frontend/src/components/PlotCard.jsx` - Handles both Cloudinary & legacy URLs

### Why It Works:
- **Old images**: Still work (uses backend URL for `/uploads` paths)
- **New images**: Stored on Cloudinary (uses full `https://` URLs)
- **No data loss**: Images survive backend restarts

---

## 📸 What Happens to Old Images?

**Unfortunately, old images uploaded before this fix are LOST** (already deleted by Render). 

You'll need to:
1. Re-upload images for your plots
2. New images will be stored permanently on Cloudinary
3. Never lose images again!

---

## 🆘 Troubleshooting

### Images Not Uploading?

1. **Check Render logs**:
   ```
   Render Dashboard → Your Service → Logs
   ```
   Look for "Cloudinary" errors

2. **Verify credentials**:
   - Go to Cloudinary dashboard
   - Settings → API Keys
   - Copy credentials again
   - Update in Render environment variables

3. **Check Cloudinary dashboard**:
   - Media Library → apnaghar-plots folder
   - Your uploads should appear here

### "Invalid API Key" Error?

- Double-check: `CLOUDINARY_API_KEY` (not API_SECRET)
- Make sure there are **no spaces** before/after the values in Render

### Still Not Working?

Check backend logs in Render:
```bash
# Look for these lines:
✅ "Image uploaded successfully"
❌ "Cloudinary upload error"
```

---

## 💰 Cost Breakdown

| Tier | Storage | Bandwidth | Price |
|------|---------|-----------|-------|
| Free | 25 GB | 25 GB/month | $0 |
| Paid | Unlimited | 65 GB/month | $89/year |

**Your needs**: ~5-10 GB for now → **FREE tier is perfect!**

---

## 🎉 Benefits

1. ✅ **Images never disappear** (permanent cloud storage)
2. ✅ **Faster loading** (Cloudinary CDN)
3. ✅ **Automatic optimization** (smaller file sizes)
4. ✅ **Free tier** (25 GB storage)
5. ✅ **Video support** (up to 100MB each)

---

## 🚀 Deploy Now

```bash
# Push the code
git add .
git commit -m "Migrate to Cloudinary for permanent image storage"
git push

# Frontend auto-deploys on Vercel
# Backend auto-deploys on Render (after adding env vars)
```

**After deployment, add Cloudinary credentials to Render and test uploading!**

---

## 📞 Need Help?

If you see any errors after deployment, share:
1. Render backend logs
2. Browser console errors
3. Screenshot of Cloudinary dashboard

**Your images are now safe forever! 🎉**

